# -*- coding: utf-8 -*-

import csv
import json
import requests
from bs4 import BeautifulSoup
from collections import defaultdict


html_date_template = '''
    <div class="timeline-item" date-is='{{date}}'>
        {{paragraphs}}
    </div>
'''

html_node_template = '''
        <p>
            {{description}}
            [Πηγές: {{sources}}]
        </p>
'''

try:
    with open('sources.json') as f:
        sources = json.load(f)
except FileNotFoundError:
    sources = {}

dates = []
events = defaultdict(list)
with open('data.csv') as f:
    reader = csv.reader(f)
    for idx, row in enumerate(reader):
        if idx > 0:
            (date, event, url, entry_id) = row
            if str(idx) not in sources.keys() and url:
                if 'linkmix.co' not in url:
                    sources[str(idx)] = [url]
                else:
                    r = requests.get(url)
                    html = r.text
                    soup = BeautifulSoup(html, 'html.parser')
                    sources[str(idx)] = [
                        node.text for node in soup.find_all('div', {'class': 'mainURL'})
                    ]
                with open('sources.json', 'w') as f:
                    f.write(json.dumps(sources, indent=4))
            if date:
                links = ', '.join([
                    '<a href="{}" target="_blank">{}</a>'.format(val, i+1) for (i, val) in enumerate(sources[str(idx)])
                ])
                date = date.replace('/', '-')
                if date not in dates:
                    dates.append(date)
                events[date].append((event, links))

for reverse in [False, True]:
    html_body = '''
        <a href="{}.html">Αντίστροφη Χρονολογική Σειρά</a>
    '''.format('reverse' if reverse else 'index') 

    if reverse:
        dates = reversed(dates)

    for date in dates:
        node = '\n <div class="separator">~</div> \n'.join([
            html_node_template.replace('{{sources}}', event[1]).replace('{{description}}', event[0]) for event in events[date]
        ])

        html_body += html_date_template.replace('{{date}}', date).replace('{{paragraphs}}', node)

    with open('template.html') as f:
        template = f.read()

    if reverse:
        f = open('index.html', 'w')
    else:
        f = open('reverse.html', 'w')
    f.write(template.replace('{{main_body}}', html_body))
    f.close()


table_template = '''
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Όνομα</th>
          <th scope="col">Περιγραφή</th>
        </tr>
      </thead>
      <tbody>
        {{table_body}}
      </tbody>
    </table>
'''

table_node = '''
        <tr>
          <td>{{name}}</td>
          <td>{{description}}</td>
        </tr>
'''

involved_body = ''
people = []
with open('people.csv') as f:
    reader = csv.reader(f)
    for idx, row in enumerate(reader):
        if idx > 0:
            involved_body += table_node.replace('{{name}}', row[0]).replace('{{description}}', row[1])
involved_body = table_template.replace('{{table_body}}', involved_body)


table_template = '''
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Όνομα</th>
          <th scope="col">Περιγραφή</th>
          <th scope="col">Μέθοδος</th>
        </tr>
      </thead>
      <tbody>
        {{table_body}}
      </tbody>
    </table>
'''

table_node = '''
        <tr>
          <td>{{name}}</td>
          <td>{{description}}</td>
          <td>{{method}}</td>
        </tr>
'''

victims_body = ''
people = []
with open('victims.csv') as f:
    reader = csv.reader(f)
    for idx, row in enumerate(reader):
        if idx > 0:
            victims_body += table_node.replace('{{name}}', row[0]).replace('{{description}}', row[1]).replace('{{method}}', row[2])

victims_body = table_template.replace('{{table_body}}', victims_body)


with open('template_people.html') as f:
    template = f.read()

with open('people.html', 'w') as f:
    f.write(template.replace('{{involved}}', involved_body).replace('{{victims}}', victims_body))
