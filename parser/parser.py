# -*- coding: utf-8 -*-

import csv

html_node_template = '''
    <div class="timeline-item" date-is='{{date}}'>
        <a href={{link}} target="_blank">
        <p>
            {{description}}
        </p>
        </a>
    </div>
'''

html_body = ''
with open('data.csv') as f:
    reader = csv.reader(f)
    for idx, row in enumerate(reader):
        if idx > 0:
            (date, event, link, entry_id) = row
            date = date.replace('/', '-')
            html_body += html_node_template.replace('{{link}}', link).replace('{{date}}', date).replace('{{description}}', event)

with open('template.html') as f:
    template = f.read()

with open('index.html', 'w') as f:
    f.write(template.replace('{{main_body}}', html_body))
