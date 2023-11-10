# Libraries needed
require 'mechanize'
require 'open-uri'
require 'active_support/all'
require 'active_record'
require 'firebase'

class Scraper

	# PASS CITY NAME, LIST OF NEIGHBORHOODS, and TIME FORMAT LIKE
	def scrape_airbnb(city, neighborhoods, checkin)
	
		#################################################################################
		# SET TO true IN ORDER TO PRINT DEBUG MESSAGES TO THE TERMINAL
		$debug = false
		#################################################################################

		# Establish firebase connection
		# Writing to Andrey's personal database, for testing
		firebase_authkey = '8xVIFxch1GYEhHlB8pZiQiF6qu23QGQUqDu8PFHY'
		firebase_uri = 'https://testfox-9b363.firebaseio.com/'
		@firebase = Firebase::Client.new(firebase_uri, firebase_authkey)

		# Establish new mechanize instance
		url_mech = Mechanize.new

		# Clear the Firebase
		#@firebase.delete("Venice")

		# Loop for each neighborhood
		neighborhoods.each do |n|
			
			# Tracking number available per neighborhood
			nhood_avail = 0

			# Track list of listing IDs, for removing duplicates
			id_list = []
			id_list.clear

			# Running search results for 1-4 guests (Start at max # of guests to search)
			current_guests = 4

			while (current_guests > 0) do

				# While loop to go through each page of search results
				# Loop breaks when blank page is grabbed
				current_page = 1
				while true do

					# Creating parameters used for string together a URL
					parameters = {
						# Each :(stuff) => :(other) is a replacement effect
						# The "locale" will be replaced with "en" using the .map function later
						# Neighborhoods, as it is the variable changing each time throught the iteration
						# is not a constant, and will associate with the n variable each time
						# the times are gotten from a function, and thus are not constant strings
						:locale                 => :en,
						'neighborhoods%5B%5D' 	=> n,
						:source               	=> :page,
						:location             	=> city,
						:checkin              	=> checkin.strftime('%d-%m-%y'),#checkin.strftime('%d-%m-%y'),
						:checkout             	=> (checkin + 86400).strftime('%d-%m-%y'),#(checkin + 86400).strftime('%d-%m-%y'),
						:guests               	=> current_guests,
						:page 				  	=> current_page,
						:s_tag                	=> '1hJKB75U',
						:ss_id                	=> 'zxt7wvv1'
					}
					
					# Creating a search URL
					url = "https://www.airbnb.it/search/search_results?"
					url += parameters.map{|k, v| "#{k}=#{v}"}.join('&')
					p url if $debug

					# Obtaining parsable JSON file
					result_page = url_mech.get(url)
					result_info = JSON.parse(result_page.body)

					# Base end of searching off of if the returned page has listings described
					inval_page = (result_info["results_json"]["search_results"]).size == 0 ? true : false

						# End when no longer getting pages with listings
						if inval_page
							break
						# Break after 50 pages, Murano errors and returns infinte pages
						# Not sure why, but setting a break ends and publishes results
						elsif current_page > 50
							break
						else

							p "#{n}, page #{current_page}, with #{current_guests} guest(s)}"
							p "checkin on #{parameters[:checkin]}, checkout on #{parameters[:checkout]}"

							current_page += 1

							# Array of listings, perform code block per listing
							listings_list = result_info["results_json"]["search_results"]

							# Operate on each listing on given results page
							listings_list.each do |single_listing|
								if (id_list.include? single_listing["listing"]["id"])
									# Picked up during this search already
									p 'Duplicate' if $debug
								else
									# New listing for search, begin updating PostgreSQL
									p single_listing["listing"]["id"] if $debug
									id_list.insert(-1, single_listing["listing"]["id"])

									# Either write new row or update existing row, based on coords
									DashAirbnb.find_or_initialize_by(
										:location => n,
										:host_id => single_listing["listing"]["user"]["id"],
										:lat => single_listing["listing"]["lat"],
										:lng => single_listing["listing"]["lng"],
										:checkin => checkin.strftime('%Y%m%d')
									).update_attributes(
										:date => Time.now.strftime('%Y%m%d'),
										:list_id => single_listing["listing"]["id"],
										:listing_type => single_listing["listing"]["room_type"],
										:price => single_listing["pricing_quote"]["rate"]["amount"],
										:no_reviews => single_listing["listing"]["reviews_count"],
										:name => single_listing["listing"]["name"],
										:free_rooms => single_listing["listing"]["bedrooms"],
										:stars => single_listing["listing"]["star_rating"],
										:city => city,
										:checkout => (checkin + 86400).strftime('%Y%m%d')
									)

									# Counting total avail in nhood
									nhood_avail += 1
								end

							end

						end

					# End of Rescue for page errors		
				end # End of WHILE loop for iteration per listing

				current_guests -= 1
			end # End of WHILE loop for number of guests


			# Information about number of listings open in {n}, and the % of total available there
			p "#{nhood_avail} in #{n}"
			

		end # End neighborhoods.each

	end # End scrape_airbnb def

end # End class def