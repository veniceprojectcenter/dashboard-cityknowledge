# Code to publish to my personal firebase, at my onawhim96@gmail.com
# Not related to any VPC firebase stuff

require 'active_support/all'

# The firebase library, used for reading, writing, etc.
require 'firebase'
require 'open-uri'
require 'active_support/all'
require 'active_record'



#########################################################################
#							FIREBASE ACCESS								#
	
# Firebase "secret", specific per firebase account
firebase_authkey = '8xVIFxch1GYEhHlB8pZiQiF6qu23QGQUqDu8PFHY'

# Connect to firebase, create new instance of it (only run once)
# The firebase_authkey is used here since my firebase is private
# If it were a public firebase, it could just be left out
firebase_uri = 'https://testfox-9b363.firebaseio.com/'
@firebase = Firebase::Client.new(firebase_uri, firebase_authkey)
#########################################################################



#########################################################################
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
#########################################################################
$debug = true
##################################

city = "Venice%2CVE"

neighborhoods = ["Castello", 
	"Cannaregio",
	"San+Marco",
	"Giudecca",
	"Dorsoduro%2FAccademia",
	"Murano",
	"Lido",
	"San+Polo",
	"Santa+Croce"
]



times = [
	Time.now.strftime('%Y%m%d'),
	(Time.now + 86400).strftime('%Y%m%d'),
	(Time.now + 2 * 86400).strftime('%Y%m%d')
]

times.each do |checkin|
	p "Given time #{checkin}" if $debug
	neighborhoods.each do |n|

		p "Neighborhood #{n}" if $debug
		client = DashAirbnb.where(location: n, checkin: checkin) 

		price_total = 0
		total_listings_nhood = 0
		total_district = 0

		# Fix spelling
		n_fix = (n == "Dorsoduro%2FAccademia") ? "Dorsoduro+Accademia" : n

		client.each do |listing|


			p "Listing #{listing.name}" if $debug
			if (listing.updated_at).strftime('%Y%m%d') == Time.now.strftime('%Y%m%d')

				p "Listing updated today" if $debug

				price_total += listing.price
				total_listings_nhood += 1

			

########################################################################################
=begin
			 
			if JSON.parse(@firebase.get("Airbnb/Venezia%2C+VE/Hosts/#{n_fix}/#{listing.list_id}").raw_body)["CreatedAt"] != nil 
			
 				total_district += 1

			end

			@firebase.update(
				"Airbnb/TotalDistricts/#{n_fix}", 
				{:TotalListings => total_district} 
				)
=end
########################################################################################

					@firebase.update(

			# Pushing data to the "data" node
			# The path for Cannaregio would be data/Cannaregio
			# Neighborhood variable passed into the function
						"Airbnb/#{listing.city}/Hosts/#{n_fix}/#{listing.list_id}", 
		
			# The list of data to pass in
			# num_avail field is set to the passed in variable
						{:Longitude => listing.lng, 
						 :Latitude => listing.lat, 
						 :Type => listing.listing_type,
						 :Name => listing.name,
						 :NumRooms => listing.free_rooms,
						 :CreatedAt => JSON.parse(@firebase.get("Airbnb/Venezia%2C+VE/Hosts/#{n_fix}/listing.list_id").raw_body)["CreatedAt"] == nil ? Time.now.strftime('%Y%m%d') : JSON.parse(@firebase.get("Airbnb/Venezia%2C+VE/Hosts/#{n_fix}/listing.list_id").raw_body)["CreatedAt"],
						 :LastAvailable => Time.now.strftime('%Y%m%d')}
					)
					p "No error"

			end

		end


			if total_listings_nhood == 0
					avg_p = 0
				else
					avg_p = (price_total / total_listings_nhood).to_f.round(2)
			end

			
			response = @firebase.update(
			"Airbnb/#{city}/#{checkin}/#{n_fix}", 
			{:AvgPrice => avg_p, 
			 :numListings => total_listings_nhood}
			)
			


	#########################################################################
	#######						DEBUGGING					    #############
	#########################################################################
		#p n
		#p listing.price
	#########################################################################
	end
end








