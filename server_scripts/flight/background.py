import flightmod
import scraper
import time
import os
import config

def update(url, filename):
	"""
	Updates a file by appending current information to already known information
	"""
	flights = scraper.load(filename)	# load currently known flights from file
	if flights is None:
		flights = []
	newflights = scraper.readFlights(url)	# scrape newly available flight data from site
	for flight in newflights:
		if flight not in flights:
			flights.append(flight)	# append each new flight to the list of known flights
	scraper.save(flights, filename)	# save the updated list of flights to file

os.chdir(config.directory)

update(config.url, config.flightdata)
flights = scraper.load(config.flightdata)
archives = scraper.load(config.archivedata)

numflights = 0
unknown = 0
passengers = 0

for flight in flights[:]:
	# if the flight's arrival time is at most config.interval seconds ago and less than now
	if int(time.time()) - config.interval < flight.arrival and flight.arrival < int(time.time()):
		numflights += 1
		flightpass = flightmod.findSeats(flight)
		if flightpass != None:
			passengers += flightpass
		else:
			unknown += 1
	# if the flight is old enough to be archived
	elif flight.arrival < int(time.time()) - config.archiveage:
		archives.append(flight)
		flights.remove(flight)

scraper.save(flights, config.flightdata)
scraper.save(archives, config.archivedata)

print "\nSince " + time.ctime(time.time() - config.interval) + ", "\
 + str(numflights) + " airplanes have entered Marco Polo Airport.  Of those flights, "\
 + str(numflights - unknown) + " carried a total of " + str(passengers)\
 + " seats' worth of passengers.\n"
