import time
import config
import logger

class Flight:
	def __init__(self):
		self.origin = None
		self.airline = None
		self.flight = None
		self.aircraft = None
		self.departure = None
		self.arrival = None
	def __str__(self):
		string = ""
		string += "City of Origin: " + self.origin + "\n"
		string += "Airline: " + self.airline + "\n"
		string += "Flight Number: " + self.flight + "\n"
		string += "Aircraft Type: " + self.aircraft + "\n"
		string += "Departure Time: " + time.ctime(float(self.departure)) + "\n"
		string += "Arrival Time: " + time.ctime(float(self.arrival)) + "\n"
		return string
	def __eq__(self, other):
		return isinstance(other, self.__class__) and self.__dict__ == other.__dict__

def findSeats(flight):
	types = open(config.typedata, "a+")
	for line in types.readlines():
		if line.find(flight.airline + "/" + flight.aircraft) >=0:
			if line.find(config.typeunknown) >= 0:
				types.close()
				return None
			else:
				types.close()
				return int(line[line.find(":") + 2 : len(line)])
	else:
		types.write(flight.airline + "/" + flight.aircraft + ": " + config.typeunknown + "\n")
		logger.logUnknown(flight)
		types.close()
		return None
