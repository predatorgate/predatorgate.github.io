# -*- coding: utf-8 -*-

import csv
import hashlib
import json
import requests
from time import sleep
from bs4 import BeautifulSoup


def make_entry_id(date, description):
    """Generate a stable 8-char hex ID from date + description.

    This is deterministic: the same date and description will always
    produce the same ID, regardless of row position in the spreadsheet.
    """
    raw = f"{date}|{description}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()[:8]


try:
    with open('sources.json') as f:
        sources = json.load(f)
except FileNotFoundError:
    sources = {}

with open('timeline.csv') as f:
    reader = csv.reader(f)
    for idx, row in enumerate(reader):
        if idx > 0:
            date = row[0]
            event = row[1]
            url = row[2]

            # skip empty rows (trailing rows from the spreadsheet)
            if not date and not event:
                continue

            entry_key = make_entry_id(date, event)

            if entry_key not in sources and url:
                print('[*] Getting source for', date, f'(id: {entry_key})')
                if 'linkmix.co' not in url:
                    sources[entry_key] = [url]
                else:
                    flag = False
                    while not flag:
                        try:
                            r = requests.get(url)
                            flag = True
                        except:
                            print('Error when collecting page, sleeping')
                            sleep(5)
                    html = r.text
                    soup = BeautifulSoup(html, 'html.parser')
                    sources[entry_key] = [
                        node.text for node in soup.find_all('div', {'class': 'mainURL'})
                    ]
                with open('sources.json', 'w') as f:
                    f.write(json.dumps(sources, indent=4))
