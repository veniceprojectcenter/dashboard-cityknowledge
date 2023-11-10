# the path to the directory in which the source files are stored
# directory = "/home/alex/School/WPI/ID 2050/Deliverables/flight/app"
directory = "/home2/venicetw/public_html/dashboard/scripts/flight"

## the path to the file in which current flight data are stored
flightdata = directory + "/flights.dat"

### the interval (24 hours, expressed in seconds) for which a recently landed flight is relevant to the program
interval = 1 * 24 * 60 * 60

### the maximum age (7 days, expressed in seconds) a flight may have before it is archived
archiveage = 7 * 24 * 60 * 60

### the function which estimates the ratio of tourists to passenger capacity for a given flight
def ratio(flight):
	return 0.125

## the path to the file in which archived flight data is stored
archivedata = directory + "/archive.dat"

## the path to the file in which data on different aircraft types are stored
typedata = directory + "/types.dat"

### the placeholder string to indicate that the number of seats in a flight is not known
typeunknown = "UNKNOWN"

## the path to the file in which log information is stored in a human-readable format
logdata = directory + "/log.txt"

# the url of the web resource which provides flight data
url = "https://flightradar24.com/data/airport/vce"

## the unique string which indicates the start of a list of flights in the web resouce
startstring = "<script>var initFlights = '["

## the unique string which indicates the end of a list of flights in the web resource
endstring = "]'; var airportIata = 'VCE';</script>"
