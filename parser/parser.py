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

for reverse in [False, True]:
    html_body = '''
        <a href="{}.html">Αντίστροφη Χρονολογική Σειρά</a>
    '''.format('reverse' if reverse else 'index') 

    if reverse:
        dates = reversed(dates)

    for date in dates:
        node = '\n <div class="separator">~</div> \n'.join([
            html_node_template.replace('{{link}}', event[1]).replace('{{description}}', event[0]) for event in events[date]
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


involved_template = '''
        <h4>{{name}}</h4>
        <p class="people-item">
            {{description}}
        </p>
'''
involved_body = ''
people = []
with open('people.csv') as f:
    reader = csv.reader(f)
    for idx, row in enumerate(reader):
        if idx > 0:
            involved_body += involved_template.replace('{{name}}', row[0]).replace('{{description}}', row[1])


victims_template = '''
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


victims_html_node = '''
        <tr>
          <td>{{name}}</td>
          <td>{{description}}</td>
        </tr>
'''
victims_body = ''
people = []
with open('victims.csv') as f:
    reader = csv.reader(f)
    for idx, row in enumerate(reader):
        if idx > 0:
            victims_body += victims_html_node.replace('{{name}}', row[0]).replace('{{description}}', row[1])

victims_body = victims_template.replace('{{table_body}}', victims_body)


with open('template_people.html') as f:
    template = f.read()

with open('people.html', 'w') as f:
    f.write(template.replace('{{involved}}', involved_body).replace('{{victims}}', victims_body))
