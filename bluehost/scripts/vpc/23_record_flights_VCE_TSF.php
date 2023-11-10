	<?
	error_reporting(E_ERROR);
	//ini_set('display_errors', 1);

	require_once("./lib/simple_html_dom.php");
	require_once './lib/firebaseLib.php';
	require_once './lib/airport_utilities.php';

	date_default_timezone_set('CET');
	
	// $url = 'https://vpc.firebaseio.com';
	// $fb = new fireBase($url);
	$url = 'https://venicedata.firebaseio.com/';
        $key = 'gG1wZ2oyUxca6Rro3XYsXaKH9ODG7nrKEUqVujWm';
	$fb = new fireBase($url, $key);
    
    	$flight_locker = array();
  
   // asks flightbase if we know about this flight. 
   // If data is available, is returned straight
   // otherwise performs a query to SeatGuru (getairplanecapacity)
   function checkFlightData($carrier, $flight_number, $urlencoded_data){
   		$url = 'https://venicedata.firebaseio.com/';
		$fb_reader = new fireBase($url);
    	$capacity = $fb_reader->get('/dashboard/airplane_data/'.$carrier.'/'.$flight_number.'/capacity');
    	
    	$url = 'https://venicedata.firebaseio.com/';
    	$key = 'gG1wZ2oyUxca6Rro3XYsXaKH9ODG7nrKEUqVujWm';
    	$fb_writer = new fireBase($url, $key);
    	
    	echo "STORED CAPACITY" .$capacity;
    	if (! is_numeric($capacity)){
    		echo "SCRAPING CAPACITY";
    		// get capacity
    		$capacity = getAirplaneCapacity($carrier, $flight_number, $urlencoded_data);
			//if ($capacity != 0){
			$fb_writer->set('/dashboard/airplane_data/'.$carrier.'/'.$flight_number.'/capacity', $capacity);
			//}
    	}
    	
    	// if it was not possible to get the information from seatguru, assign average capacity 160
    	if ($capacity == 0) $capacity = 160;
    	
    	return $capacity;
    	
    	//print_r($data);
    	//echo ($data['capacity_ref']);
    }
    
    function scrapeArrivalFlightsAllDay($url){
   		$arrived_flights = 0;
		$arrived_passengers = 0;
		$html_contents = @file_get_contents($url);

	    $DOM = new DOMDocument;
		$DOM->loadHTML($html_contents);
				
		$xpath = new DOMXpath($DOM);
		$tags = $xpath->query('//table[@id="tabellaarrivi"]');			
		
		//tabellaarrivi
	    foreach($tags as $tag)
	        {
	            $tr = $tag->getElementsByTagName('tr');
	            foreach($tr as $data)
	            {
	            	$status = '';
	                $td = $data->getElementsByTagName('td');
	                
	                $flght = $td->item(0)->nodeValue;
	                $tokens = explode(" ", $flght);

	               
	                
	                $from_airport = $td->item(2)->nodeValue;
	                $carrier = $tokens[0];
	                $flight_number = $tokens[1];
   	                $arrival_time = $td->item(3)->nodeValue;
	                $status = trim($td->item(5)->nodeValue);

	                
		            if (strpos($status,'Landed') !== false) {
						
		                if (strlen($carrier) > 1 && strlen($flight_number) > 2 ){
		                    echo 'getting -> carrier ' .$carrier." FN ".$flight_number;
		                  //	echo "\n";
							$date = new DateTime($current_date);
							$urlencoded_data =  urlencode($date->format('m/d/Y')); // 31.07.2012		
		                	$passengers = checkFlightData($carrier, $flight_number, $urlencoded_data);

				            $landed = true;
				            $arrived_passengers = $arrived_passengers + $passengers;
				            $arrived_flights++;
							$flight_locker[$carrier.$flight_number]++;
		                }
					}	                
	                
	                
	            }
	        }
			return  array($arrived_passengers, $arrived_flights);
	
    }
    
    
    function scrapeDepartureFlightsAllDay($url){
   		$arrived_flights = 0;
		$arrived_passengers = 0;
		$html_contents = @file_get_contents($url);

	    $DOM = new DOMDocument;
		$DOM->loadHTML($html_contents);
		echo $html_contents;
				
		$xpath = new DOMXpath($DOM);
		$tags = $xpath->query('//table[@id="tabellapartenze"]');			
		
		//tabellaarrivi
	    foreach($tags as $tag)
	        {
	            $tr = $tag->getElementsByTagName('tr');
	            foreach($tr as $data)
	            {
	            	$status = '';
	                $td = $data->getElementsByTagName('td');
	                
	                $flght = $td->item(0)->nodeValue;
	                $tokens = explode(" ", $flght);

	                $from_airport = $td->item(2)->nodeValue;
	                $carrier = $tokens[0];
	                $flight_number = $tokens[1];
   	                $arrival_time = $td->item(3)->nodeValue;
	                $status = trim($td->item(7)->nodeValue);
	                
		            if (strpos($status,'Departed') !== false) {
						
		                if (strlen($carrier) > 1 && strlen($flight_number) > 2 ){
		                    //echo 'getting -> carrier ' .$carrier." FN ".$flight_number;
		                    //echo "\n";
							$date = new DateTime($current_date);
							$urlencoded_data =  urlencode($date->format('m/d/Y')); // 31.07.2012		
		                	$passengers = checkFlightData($carrier, $flight_number, $urlencoded_data);

				            $landed = true;
				            $arrived_passengers = $arrived_passengers + $passengers;
				            $arrived_flights++;
							$flight_locker[$carrier.$flight_number]++;
		                }
					}	                
	                
	                
	            }
	        }
			return  array($arrived_passengers, $arrived_flights);
	
    }




	//getFlightsForHours(12,15);
	$airports = array();
	$flights_arrived = array();
	$tourists_arrived = array();
	$passengers_arrived = array();
	$i = 0;
	$average_airplane_fillrate = 0.9;

	$airports_arrival['IT_VCE'] = "http://www.veniceairport.it/en/flights/todays-flights/all-arrivals/ftype-A/ftframe-alldaylong/page-1.html?_=1438102494247";
	$airports_arrival['IT_TSF'] = "http://www.trevisoairport.it/en/flights/todays-flights/all-arrivals/ftype-A/ftframe-alldaylong/page-1.html?_=1438160502137";

	$airports_departures['IT_VCE'] = "http://www.veniceairport.it/en/flights/todays-flights/all-departures/ftype-D/ftframe-alldaylong/page-1.html?_=1450274639414";
	$airports_departures['IT_TSF'] = "http://www.trevisoairport.it/en/flights/todays-flights/all-departures/ftype-D/ftframe-alldaylong/page-1.html?_=1450274639414";

	/*
	$airports['IT_VCE'] = "%28VCE%29+Venice+Marco+Polo+Airport%2C+Venice%2C+IT";
	$airports['IT_TSF'] = urlencode("(TSF) Treviso Airport, Venice, IT");
	*/
	
	// scrape arrivals
	foreach ($airports_arrival as $key => $airport){
		$total_passengers = 0;
		$total_flights = 0;
		$passengers_arrived[$key] = 0;
		$flights_arrived[$key] = 0;
		$tourists_arrived[$key] = 0;
		
		$flight_data = array();
		$flight_data = scrapeArrivalFlightsAllDay($airport);
		$total_passengers = $flight_data[0] + $total_passengers;
		$total_flights = 	$flight_data[1] + $total_flights;
		$passengers_arrived[$key] = intval($average_airplane_fillrate * ( $total_passengers));
		$flights_arrived[$key] = $total_flights;
		$tourists_arrived[$key] = intval($passengers_arrived[$key] * .7);

		echo $key." - TOTAL PASS: ".$passengers_arrived[$key];
		echo $key." - TOTAL FLIGHTS ".$flights_arrived[$key];	
		
		
		$fb->set('/dashboard/airport_data/'.$key.'/flights_ref', $flights_arrived[$key]);
		$fb->set('/dashboard/airport_data/'.$key.'/passenger_ref', $tourists_arrived[$key]);
		$fb->set('/dashboard/airport_data/'.$key.'/capacity_ref', $passengers_arrived[$key]);
	
		$airport_entry = array('time' => date('Y-m-d G:i:s'),
																	'flightsArrived' => $flights_arrived[$key],
																	'passengersArrived' => $passengers_arrived[$key],
																	'touristsArrived' => $tourists_arrived[$key]);
		$fb->push('/dashboard/flightLogs/'.$key, $airport_entry);
		
		// push new flightlog
		
		$date = date('m/d/Y h:i:s a', time());
		$day = date('mdY', time());

		$hour_now = date('H', time());
		$fb->set('/dashboard/airport_data/logs/'.$key.'/arrivals/'.$day.'/'.$hour_now, $airport_entry);
	
		

	}
	
	
	// scrape departures
	foreach ($airports_departures as $key => $airport){
		$total_passengers = 0;
		$total_flights = 0;
		$passengers_departed[$key] = 0;
		$flights_departed[$key] = 0;
		$tourists_departed[$key] = 0;
		
		$flight_data = array();
		$flight_data = scrapeDepartureFlightsAllDay($airport);
		$total_passengers = $flight_data[0] + $total_passengers;
		$total_flights = 	$flight_data[1] + $total_flights;
		$passengers_departed[$key] = intval($average_airplane_fillrate * ( $total_passengers));
		$flights_departed[$key] = $total_flights;
		$tourists_departed[$key] = intval($passengers_departed[$key] * .7);

		echo $key." - TOTAL PASS: "	.$passengers_departed[$key];
		echo $key." - TOTAL FLIGHTS ".$flights_departed[$key];	
		
		
		$fb->set('/dashboard/airport_data/departures/'.$key.'/flights_ref', $flights_departed[$key]);
		$fb->set('/dashboard/airport_data/departures/'.$key.'/passenger_ref', $tourists_departed[$key]);
		$fb->set('/dashboard/airport_data/departures/'.$key.'/capacity_ref', $passengers_departed[$key]);
	
		$airport_entry = array('time' => date('Y-m-d G:i:s'),
		'flightsDeparted' => $flights_departed[$key],
		'passengersDeparted' => $passengers_departed[$key],
		'touristsDeparted' => $tourists_departed[$key]);
		
		$fb->push('/dashboard/flightLogs/departures/'.$key, $airport_entry);


		// push new flightlog
		
		$date = date('m/d/Y h:i:s a', time());
		$day = date('mdY', time());

		$hour_now = date('H', time());
		$fb->set('/dashboard/airport_data/logs/'.$key.'/departures/'.$day.'/'.$hour_now, $airport_entry);

	}	


?>