import { createHash } from "crypto"

export interface TimelineEvent {
  date: string
  description: string
  link: string
  entryId: string
  sources: string[]
}

/**
 * Generate a stable 8-char hex ID from date + description.
 * Must match the Python make_entry_id() function exactly.
 */
function makeEntryId(date: string, description: string): string {
  const raw = `${date}|${description}`
  return createHash("sha256").update(raw, "utf-8").digest("hex").slice(0, 8)
}

export function parseCSV(csvContent: string): TimelineEvent[] {
  const lines = csvContent.split("\n")
  const events: TimelineEvent[] = []

  // Detect whether the CSV has an Entry ID column (5 columns = English)
  // by checking the header row.
  const header = lines[0] || ""
  const hasEntryIdColumn = header.toLowerCase().includes("entry id")

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Parse CSV line handling quoted fields with commas
    const fields: string[] = []
    let currentField = ""
    let inQuotes = false

    for (let j = 0; j < line.length; j++) {
      const char = line[j]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === "," && !inQuotes) {
        fields.push(currentField)
        currentField = ""
      } else {
        currentField += char
      }
    }
    fields.push(currentField) // Add last field

    if (fields.length >= 3) {
      const date = fields[0].trim()
      if (!date) continue

      // English CSV: read the hash from column 5.
      // Greek CSV: compute the hash from the Greek date + description.
      const entryId = hasEntryIdColumn && fields.length >= 5
        ? fields[4].trim()
        : makeEntryId(fields[0], fields[1])

      events.push({
        date: fields[0],
        description: fields[1],
        link: fields[2],
        entryId,
        sources: [],
      })
    }
  }

  return events
}

export function enrichWithSources(events: TimelineEvent[], sourcesMap: Record<string, string[]>): TimelineEvent[] {
  return events.map((event) => ({
    ...event,
    sources: sourcesMap[event.entryId] || [],
  }))
}
