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

	function getFlightsForHours($airport, $starting_hour, $ending_hour, &$flight_locker) {
		//return  array(10, 10);

		$arrived_flights = 0;
		$arrived_passengers = 0;

		$current_time = date('g:i A');
		$current_date = date('Y-m-d');
		$url = "https://www.flightstats.com/go/FlightStatus/flightStatusByAirport.do?airport=".$airport."&airportQueryDate=" . $current_date . "&airlineToFilter=&airportQueryType=1&x=5&y=6&&airportQueryTime=" . $starting_hour;
		
		echo $url;
		
		$html_contents = @file_get_contents($url);
		
		// simulate get for development 
		//$html_contents = @file_get_contents('flightstats_file.html');

	    $DOM = new DOMDocument;
		$DOM->loadHTML($html_contents);
				
		$xpath = new DOMXpath($DOM);
		$tags = $xpath->query('//table[@class="flightStatusByAirportListingTable"]');		
		//$imgs = $xpath->query('//img[@class="logo"]');	
		
		//print_r($imgs);
		//return 0;
		
       // $tags = $DOM->getElementsByClassName('flightStatusByAirportListingTable');
        foreach($tags as $tag)
        {
            $tr = $tag->getElementsByTagName('tr');
            foreach($tr as $data)
            {
                $td = $data->getElementsByTagName('td');
                
                $from_airport = $td->item(0)->nodeValue;
                $carrier = $td->item(1)->nodeValue;
                $flight_number = $td->item(2)->nodeValue;
                $arrival_time = $td->item(3)->nodeValue;
                $status = $td->item(4)->nodeValue;
                
                //echo $carrier;
                
             	
				$the_carrier = '';
                
                if (strlen($carrier) < 2)
                {
                //	echo 'IMAGE'.$carrier;
                	$count = 0;
	                $image = $data->getElementsByTagName('img');
                	foreach($image as $img_data){
                		//echo 'wuoh-ho';
                		if ($img_data->hasAttribute( 'src' )){
							$image_url = $img_data->getAttribute( 'src' ); 
							
							//echo "COUNT ".$count;

							if (strpos($image_url,'logos') !== false)
								$index1 = strripos($image_url, '/');
								$index2 = strripos($image_url, '.gif');
								
								//echo $index1;
								
								$carrier = substr($image_url,$index1,$index2);
								$carrier = str_replace('/', '', $carrier);
								$carrier = str_replace('.gif', '', $carrier);
								$the_carrier = $carrier;
								
								if (strlen($carrier) < 4){
									//echo "IMG_EXTR -". $carrier."/r";

								}
								//else echo 'ASEOH '.$carrier ."/r";;
							
							
							break;
							
						}
                		
                	}

                	
                }
                else {
                	//...
					$index1 = strripos($carrier, '(');
					$index2 = strripos($carrier, ')');	               	
					$carrier = substr($carrier,$index1,$index2);
					$carrier = str_replace('(', '', $carrier);
					$carrier = str_replace(')', '', $carrier);			
					$the_carrier = $carrier;
					

                }
                
				$date = new DateTime($current_date);
				$urlencoded_data =  urlencode($date->format('m/d/Y')); // 31.07.2012
				//echo $date->format('d-m-Y'); // 31-07-2012
				$passengers = 0;
                
                if (strlen($carrier) > 1 && strlen($flight_number) > 2 ){
                    //echo 'getting -> carrier ' .$carrier." FN ".$flight_number;
                  //	echo "\n";

                	$passengers = checkFlightData($carrier, $flight_number, $urlencoded_data);
                	//echo "\n";

                }

	            if (strpos($status,'Landed') != false) {

			//echo "LANDED, SEEN? ".@$flight_locker[$carrier.$flight_number];	

			if (!isset($flight_locker[$carrier.$flight_number])){
				$flight_locker[$carrier.$flight_number] = 0;
			}            	

	            	if ($flight_locker[$carrier.$flight_number] == 0){
	            	
		            	$landed = true;
		            	$arrived_passengers = $arrived_passengers + $passengers;
		            //	echo "ARRIVED UPDATE ".$arrived_passengers;
		            	$arrived_flights++;
				$flight_locker[$carrier.$flight_number]++;
			//	echo "LANDED, SEEN ----> should be 1 ".$flight_locker[$carrier.$flight_number];	            	
	            	}
	            	else {
			//	echo "SKIPPNG";
	            		
	            		$flight_locker[$carrier.$flight_number]++;
	            	}
			}


				
                
            }
        }
		
		print_r($flight_locker);
		return  array($arrived_passengers, $arrived_flights);
	}




	//getFlightsForHours(12,15);
	$airports = array();
	$flights_arrived = array();
	$tourists_arrived = array();
	$passengers_arrived = array();
	$i = 0;
	
	
	$airports['IT_VCE'] = "%28VCE%29+Venice+Marco+Polo+Airport%2C+Venice%2C+IT";
	$airports['IT_TSF'] = urlencode("(TSF) Treviso Airport, Venice, IT");
	
	
	
	//getFlightsForHours($airports[0],0, 6);
	//checkFlightData(0,0,0);
	foreach ($airports as $key => $airport){
		
		$average_airplane_fillrate = 0.9;
		
		$flight_data = array();
		$flight_data[0] = getFlightsForHours($airport,0, 6, $flight_locker);
		$flight_data[1] = getFlightsForHours($airport,6, 9, $flight_locker);
		$flight_data[2] = getFlightsForHours($airport,9, 12, $flight_locker);
		$flight_data[3] = getFlightsForHours($airport,12, 15, $flight_locker);
		$flight_data[4] = getFlightsForHours($airport,15, 18, $flight_locker);
		$flight_data[5] = getFlightsForHours($airport,18, 21, $flight_locker);
		$flight_data[6] = getFlightsForHours($airport,21, 0, $flight_locker);

		$total_passengers = $flight_data[0][0] +
							$flight_data[1][0] +
							$flight_data[2][0] +
							$flight_data[3][0] +
							$flight_data[4][0] +
							$flight_data[5][0] +
							$flight_data[6][0];

		$total_flights = 	$flight_data[0][1] +
							$flight_data[1][1] +
							$flight_data[2][1] +
							$flight_data[3][1] +
							$flight_data[4][1] +
							$flight_data[5][1] +
							$flight_data[6][1];
		echo "FLIGHT LOCK" ;		
		print_r($flight_locker);

		$passengers_arrived[$key] = intval($average_airplane_fillrate * ( $total_passengers));
		$flights_arrived[$key] = $total_flights;
		
		echo $key." - TOTAL PASS: ".$passengers_arrived[$key];
		echo $key." - TOTAL FLIGHTS ".$flights_arrived[$key];
		
		$tourists_arrived[$key] = intval($passengers_arrived[$key] * .7);
		
		$fb->set('/dashboard/airport_data/'.$key.'/flights_ref', $flights_arrived[$key]);
		$fb->set('/dashboard/airport_data/'.$key.'/passenger_ref', $tourists_arrived[$key]);
		$fb->set('/dashboard/airport_data/'.$key.'/capacity_ref', $passengers_arrived[$key]);
	
		$airport_entry = array('time' => date('Y-m-d G:i:s'),
																	'flightsArrived' => $flights_arrived[$key],
																	'passengersArrived' => $passengers_arrived[$key],
																	'touristsArrived' => $tourists_arrived[$key]);
		$fb->push('/dashboard/flightLogs/'.$key, $airport_entry);
		
	}
?>