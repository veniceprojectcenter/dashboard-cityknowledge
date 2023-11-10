require 'firebase'
require 'mechanize'
require 'open-uri'
require 'active_support/all'
require 'active_record'

# Writing to Andrey's personal database, for testing
firebase_authkey = '8xVIFxch1GYEhHlB8pZiQiF6qu23QGQUqDu8PFHY'
firebase_uri = 'https://testfox-9b363.firebaseio.com/'
@firebase = Firebase::Client.new(firebase_uri, firebase_authkey)

neighborhoods = [
	'Castello', 
	'Cannaregio',
	'San+Marco',
	'Giudecca'  ,
	'Dorsoduro+Accademia',
	'Murano',
	'Lido',
	'San+Polo',
	'Santa+Croce'
]

tot = 0

neighborhoods.each do |n|

	parsed = JSON.parse((@firebase.get("Airbnb/Venezia%2C+VE/Hosts/#{n}")).raw_body)
	
	parsed.each do |xx|
		tot += 1
	end
end

p "Firebase contains #{tot} Airbnb listings"