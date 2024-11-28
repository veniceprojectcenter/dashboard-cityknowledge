import flightmod
import scraper
import config

flights = scraper.readFlights(config.url)

print("Flights:")
print(flights)

for flight in flights:
	print flight
