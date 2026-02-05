all:
	/home/jim/.virtualenvs/di/bin/python3 parser.py
	mv timeline.csv gr/timeline.csv
	/home/jim/.virtualenvs/di/bin/python3 translate_timeline.py

reset:
	rm -f sources.json
	make
