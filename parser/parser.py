# -*- coding: utf-8 -*-

import csv
from collections import defaultdict

html_date_template = '''
    <div class="timeline-item" date-is='{{date}}'>
        {{paragraphs}}
    </div>
'''

html_node_template = '''
        <p>
            {{description}}
            [<a href={{link}} target="_blank">Πηγή</a>]
        </p>
'''

dates = []
events = defaultdict(list)
with open('data.csv') as f:
    reader = csv.reader(f)
    for idx, row in enumerate(reader):
        if idx > 0:
            (date, event, link, entry_id) = row
            if date:
                date = date.replace('/', '-')
                if date not in dates:
                    dates.append(date)
                events[date].append((event, link))

html_body = ''
for date in dates:
    node = '\n <div class="separator">~</div> \n'.join([
        html_node_template.replace('{{link}}', event[1]).replace('{{description}}', event[0]) for event in events[date]
    ])

    html_body += html_date_template.replace('{{date}}', date).replace('{{paragraphs}}', node)

with open('template.html') as f:
    template = f.read()

with open('index.html', 'w') as f:
    f.write(template.replace('{{main_body}}', html_body))


html_node_template = '''
        <h3>{{name}}</h3>
        <p class="people-item">
            {{description}}
        </p>
'''

html_body = ''
people = []
with open('people.csv') as f:
    reader = csv.reader(f)
    for idx, row in enumerate(reader):
        if idx > 0:
            html_body += html_node_template.replace('{{name}}', row[0]).replace('{{description}}', row[1])

with open('template_people.html') as f:
    template = f.read()

with open('people.html', 'w') as f:
    f.write(template.replace('{{main_body}}', html_body))
