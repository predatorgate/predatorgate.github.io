#!/usr/bin/env python3
"""
Translates the Greek timeline.csv to English using the Anthropic API.

Usage:
    pip install anthropic python-dotenv
    echo 'ANTHROPIC_API_KEY=sk-ant-...' > .env
    python translate_timeline.py

This reads gr/timeline.csv and produces en/timeline.csv.
It processes events in batches of 10 to stay within context limits,
with automatic retry and resume support.

Each entry is identified by a hash of its date and event text
(columns 1 and 2). This means:
  - New entries are detected regardless of where they are inserted.
  - Edited entries are detected (the hash changes) and retranslated.
"""

import csv
import hashlib
import os
import sys
import time

from dotenv import load_dotenv

try:
    import anthropic
except ImportError:
    print(
        "Please install the anthropic package: "
        "pip install anthropic"
    )
    sys.exit(1)

INPUT_FILE = os.path.join(
    os.path.dirname(__file__), "gr", "timeline.csv"
)
OUTPUT_FILE = os.path.join(
    os.path.dirname(__file__), "en", "timeline.csv"
)
BATCH_SIZE = 10
MODEL = "claude-sonnet-4-5-20250929"

SYSTEM_PROMPT = (
    "You are a professional translator specialising in "
    "Greek-to-English translation of political, legal, and "
    "journalistic content. You are translating events from the "
    "Predatorgate surveillance scandal timeline in Greece.\n"
    "\n"
    "Key translation guidelines:\n"
    "- Preserve ALL proper names in their commonly used English "
    "transliteration (e.g., Kyriakos Mitsotakis)\n"
    "- For Greek government bodies, provide the English "
    "translation followed by the Greek acronym in parentheses "
    "on first mention:\n"
    "  - EYP -> Greek Intelligence Service (EYP)\n"
    "  - ADAE -> Authority for Communication Security and "
    "Privacy (ADAE)\n"
    "  - EAD -> National Transparency Authority (EAD)\n"
    "  - ESIEA -> Athens Journalists' Union (ESIEA/ESHEA)\n"
    "  - AMPE -> Athens-Macedonian News Agency (AMPE)\n"
    "  - ERT -> Hellenic Broadcasting Corporation (ERT)\n"
    "  - ELAS -> Hellenic Police (ELAS)\n"
    "- Keep dates in their original DD/MM/YYYY format\n"
    "- Keep URLs unchanged\n"
    "- Keep the Sort Number unchanged\n"
    "- Maintain the same CSV structure: "
    "Date,Event,Link,Sort Number\n"
    "- Translate idioms and legal terms accurately\n"
    "- Keep technical terms "
    "(Predator, zero-click, TETRA, etc.) in English\n"
    "- Be precise with political and legal terminology\n"
    "\n"
    "Return ONLY the translated CSV rows, one per line, "
    "with no headers and no additional text."
)


def make_entry_id(date, description):
    """Generate a stable 8-char hex ID from date + description.

    Identical to the one used in parser.py so that entry IDs
    are consistent across the project.
    """
    raw = f"{date}|{description}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()[:8]


def read_input_csv(filepath):
    """Read the Greek timeline CSV and return list of rows."""
    rows = []
    with open(filepath, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        next(reader)  # skip header
        for row in reader:
            if len(row) >= 2 and row[0].strip() and row[1].strip():
                rows.append(row)
    return rows


def read_existing_output(filepath):
    """Read the English output CSV.

    Returns a dict keyed by entry_id whose values are the
    translated CSV rows (5 columns: Date, Event, Link,
    Sort Number, Entry ID).
    """
    by_id = {}
    if not os.path.exists(filepath):
        return by_id
    with open(filepath, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        next(reader, None)  # skip header
        for row in reader:
            if len(row) >= 5:
                by_id[row[4].strip()] = row
    return by_id


def translate_batch(client, batch_rows):
    """Send a batch of rows to Claude for translation."""
    items = []
    for i, row in enumerate(batch_rows):
        items.append(
            f"[{i}] Date: {row[0]}\n"
            f"Event: {row[1]}\n"
            f"Link: {row[2]}\n"
            f"Sort: {row[3]}"
        )

    prompt = (
        f"Translate the following {len(batch_rows)} Greek "
        "timeline events to English.\n"
        "Return them as CSV rows (Date,Event,Link,Sort Number)"
        " - one per event, in the same order.\n"
        "Keep dates, URLs, and sort numbers unchanged. Only "
        "translate the Event text.\n"
        "Wrap event text in double quotes if it contains "
        "commas.\n"
        "\n"
        f"{chr(10).join(items)}"
    )

    message = client.messages.create(
        model=MODEL,
        max_tokens=8192,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}],
    )

    return message.content[0].text


def parse_csv_response(response_text, expected_count):
    """Parse the CSV response from Claude."""
    lines = [
        line.strip()
        for line in response_text.strip().split("\n")
        if line.strip()
    ]

    filtered = []
    for line in lines:
        if (
            line.startswith("Date,")
            or line.startswith("```")
            or line.startswith("[")
        ):
            continue
        filtered.append(line)

    rows = []
    for line in filtered:
        try:
            parsed = list(csv.reader([line]))[0]
            if len(parsed) >= 4:
                rows.append(parsed[:4])
            elif len(parsed) == 3:
                rows.append(parsed + [""])
        except Exception:
            continue

    return rows


def save_output(output_file, all_input_rows, translated_by_id):
    """Write the output CSV with only translated rows.

    translated_by_id is a dict keyed by entry_id whose values
    are 5-column rows [Date, Event, Link, Sort Number,
    Entry ID].  Rows appear in input order; untranslated rows
    are omitted.
    """
    with open(
        output_file, "w", encoding="utf-8", newline=""
    ) as f:
        writer = csv.writer(f, quoting=csv.QUOTE_MINIMAL)
        writer.writerow([
            "Date", "Event", "Link",
            "Sort Number", "Entry ID",
        ])
        for row in all_input_rows:
            eid = make_entry_id(row[0], row[1])
            if eid in translated_by_id:
                writer.writerow(translated_by_id[eid])


def main():
    load_dotenv()
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print(
            "Error: ANTHROPIC_API_KEY not found.\n"
            "Create a .env file next to this script with:\n"
            "  ANTHROPIC_API_KEY=sk-ant-..."
        )
        sys.exit(1)

    client = anthropic.Anthropic(api_key=api_key)

    print(f"Reading input from {INPUT_FILE}...")
    all_rows = read_input_csv(INPUT_FILE)
    print(f"Found {len(all_rows)} events in input.")

    # Load already-translated entries keyed by entry_id.
    translated_by_id = read_existing_output(OUTPUT_FILE)

    # Compute entry IDs for every Greek row and find ones
    # that need translating (new or modified).
    pending = []
    for row in all_rows:
        eid = make_entry_id(row[0], row[1])
        if eid not in translated_by_id:
            pending.append(row)

    if not pending:
        print(
            "All events are already translated. "
            "Nothing to do."
        )
        return

    done_count = len(translated_by_id)
    # Some pending entries may be edits of rows whose old
    # hash is in the output.  Those stale entries are
    # dropped automatically: save_output iterates the
    # current Greek input and looks up by the *new* hash,
    # so the old hash (which no longer matches any input
    # row) is simply never written.
    print(
        f"{done_count} events already translated, "
        f"{len(pending)} new/modified to translate."
    )

    # Process pending rows in batches.
    total_batches = (
        (len(pending) + BATCH_SIZE - 1) // BATCH_SIZE
    )

    for batch_idx in range(total_batches):
        start = batch_idx * BATCH_SIZE
        end = min(start + BATCH_SIZE, len(pending))
        batch = pending[start:end]

        print(
            f"Translating batch {batch_idx + 1}/"
            f"{total_batches} "
            f"(events {start + 1}-{end})..."
        )

        retries = 3
        for attempt in range(retries):
            try:
                response = translate_batch(client, batch)
                translated = parse_csv_response(
                    response, len(batch)
                )

                if len(translated) != len(batch):
                    print(
                        f"  Warning: expected {len(batch)}"
                        f" rows, got {len(translated)}."
                        " Retrying..."
                    )
                    if attempt < retries - 1:
                        continue
                    # Last attempt: pad with originals.
                    while len(translated) < len(batch):
                        idx = len(translated)
                        translated.append(
                            list(batch[idx])
                        )
                    translated = translated[:len(batch)]

                # Force dates, links, sort numbers to match
                # originals and append entry ID as column 5.
                for orig, trans in zip(batch, translated):
                    eid = make_entry_id(orig[0], orig[1])
                    trans[0] = orig[0]
                    trans[2] = orig[2]
                    trans[3] = orig[3]
                    if len(trans) < 5:
                        trans.append(eid)
                    else:
                        trans[4] = eid
                    translated_by_id[eid] = trans

                print(
                    f"  Translated {len(translated)} events"
                )
                break

            except anthropic.RateLimitError:
                wait = 30 * (attempt + 1)
                print(
                    f"  Rate limited. Waiting {wait}s..."
                )
                time.sleep(wait)
            except Exception as e:
                print(f"  Error: {e}")
                if attempt < retries - 1:
                    time.sleep(5)
                else:
                    print(
                        f"  Failed after {retries} "
                        "attempts. Will retry on "
                        "next run."
                    )

        # Save after every batch so progress survives
        # interruptions.
        save_output(
            OUTPUT_FILE, all_rows, translated_by_id
        )
        print("  Progress saved to output file.")

        if batch_idx < total_batches - 1:
            sleep_time = 60
            print(
                f"  Sleeping {sleep_time}s before "
                "next batch..."
            )
            time.sleep(sleep_time)

    print(f"\nDone! Output written to {OUTPUT_FILE}")
    total_done = sum(
        1 for r in all_rows
        if make_entry_id(r[0], r[1]) in translated_by_id
    )
    print(
        f"Total events translated: "
        f"{total_done}/{len(all_rows)}"
    )


if __name__ == "__main__":
    main()
