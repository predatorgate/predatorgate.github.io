all:
	@python3 parser.py
	cp data.csv ../data/timeline.csv
	cp sources.json people.csv victims.csv ../data/

reset:
	rm -f sources.json
	make
