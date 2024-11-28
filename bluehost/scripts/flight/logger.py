import time
import config

def log(message):
	"""
	function to write a message to the log file
	also includes a current timestamp as provided by time.ctime()
	"""
	if message[-1] != '\n':
		message = message[:] + '\n'	# ensure each logged
						# message has its
						# own line
	logfile = file(config.logdata, "a")
	logfile.write(time.ctime() + ": " + message)
	logfile.close()

def logUnknown(flight):
	"""
	function to log the discovery of an aircraft which does not
	exist in types.dat, and as such has an unknown capacity
	"""
	message = "Unknown flight type encountered (" + flight.airline + "/" + flight.aircraft + ")"
	log(message)
