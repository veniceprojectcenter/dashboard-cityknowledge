require_relative 'scrape'

sec_in_day = 86400

neighborhoods = [
	'Castello', 
	'Cannaregio',
	'San+Marco',
	'Giudecca'  ,
	'Dorsoduro%2FAccademia',
	'Murano',
	'Lido',
	'San+Polo',
	'Santa+Croce'
]

# Run for three days of checkin
times = [
	Time.now,
	(Time.now + sec_in_day),
	(Time.now + 2 * sec_in_day)
]


# Establish PostgreSQL 
ActiveRecord::Base.establish_connection(
	adapter: 	'postgresql',
	encoding: 	'unicode',
	host:		'ckdashboard.crwyee3ptpyo.us-east-1.rds.amazonaws.com',
	database: 	'ckdashboard',
	username: 	'ckdashboard',
	password: 	'ck-dashb0ard!!!'
)
class DashAirbnb < ActiveRecord::Base
end


times.each do |day|
	scrape = Scraper.new
# (City, List of Neighborhoods, Check-In - Format of Time.now)
	scrape.scrape_airbnb("Venezia%2C+VE", neighborhoods, day)
end
