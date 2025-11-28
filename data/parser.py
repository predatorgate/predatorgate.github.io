# -*- coding: utf-8 -*-

import csv
import json
import requests
from time import sleep
from bs4 import BeautifulSoup


try:
    with open('sources.json') as f:
        sources = json.load(f)
except FileNotFoundError:
    sources = {}

with open('timeline.csv') as f:
    reader = csv.reader(f)
    for idx, row in enumerate(reader):
        if idx > 0:
            (date, event, url, entry_id) = row
            entry_key = str(entry_id)
            if entry_key not in sources.keys() and url:
                print('[*] Getting source for', date)
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
