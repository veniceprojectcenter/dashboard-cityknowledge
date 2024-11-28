import urllib2
import sys
import time
import datetime
import pickle
import flightmod
import config

def readStrings(url):
	objects = []
	try:
		req = urllib2.Request(url)
		site = urllib2.urlopen(req)
		sitestr = site.read()
		start = sitestr.find(config.startstring) + len(config.startstring)
		end = sitestr.find(config.endstring)
		depth = 0	
		for i in range(start, end):
			if sitestr[i] == '[':
				if depth == 0:
					start = i
				depth += 1
			if sitestr[i] == ']':
				depth -= 1
				if depth == 0:
					end = i+1
					objects.append(sitestr[start:end])
	except Exception as e:
		print e
	return objects

def strToFlight(string):
	flight = flightmod.Flight()
	splits = string.split(",")
	for i in range(0, len(splits[:])):
		splits[i] = splits[i].strip(" ,\"[]")
	flight.flight = splits[1]
	flight.airline = splits[4]
	flight.aircraft = splits[5]
	flight.departure = int(splits[7])
	flight.arrival = int(splits[8])
	flight.origin = splits[11]
	return flight

def readFlights(url):
	flights = []
	strings = readStrings(url)
	for string in strings:
		flights.append(strToFlight(string))
	return flights

def save(flights, filename):
	outfile = open(filename, "w+")
	pickle.dump(flights, outfile)
	outfile.close()

def load(filename):
	try:
		infile = open(filename, "r")
		return pickle.load(infile)
		infile.close()
	except:
		return []
