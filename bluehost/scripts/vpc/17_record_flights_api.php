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

	function getFlightsForHours_API($airport, $starting_hour, $number_hours, &$flight_locker){
		$arrived_flights = 0;
		$arrived_passengers = 0;
		$date = new DateTime($current_date);
		$urlencoded_data =  urlencode($date->format('m/d/Y')); // 31.07.2012
		
		$year =  $date->format("Y");
		$month =  $date->format("m");
		$day =  $date->format("d");
		
		echo 'DATE : '.$year. " ".$month." ".$day;

		// get API request
		$url =  "https://api.flightstats.com/flex/flightstatus/rest/v2/json/airport/status/".$airport."/arr/".$year."/".$month."/".$day."/".$starting_hour."?appId=da05d597&appKey=59bf601b087ed7628ef729bcb7eec81a&utc=false&numHours=".$number_hours;
		
		echo $url;
	
		
		// simulate get for development 
		$html_contents = @file_get_contents($url);		

		$API_RESULT = (json_decode($html_contents, true));
	//	print_r($API_RESULT['flightStatuses']);
		
		foreach ($API_RESULT['flightStatuses'] as $key => $value){
			// get flight status
			$status =  $value['status'];
			$flight_number = $value['flightNumber'];
			$carrier = $value['carrierFsCode'];
			
			//echo $flight_number." - ".$carrier." ".$status."\n";
			echo "FLIGHTS ARRIVED: ".$arrived_flights." PASSENGERS: ".$arrived_passengers."\n";
			
			if ($status == "L") {
				// airplane landed
					            
                $passengers = checkFlightData($carrier, $flight_number, $urlencoded_data);

				//echo "LANDED, SEEN? ".@$flight_locker[$carrier.$flight_number];	
		
				if (!isset($flight_locker[$carrier.$flight_number])){
					$flight_locker[$carrier.$flight_number] = 0;
				}            	
		
			   	if ($flight_locker[$carrier.$flight_number] == 0){
					$arrived_passengers = $arrived_passengers + $passengers;
				    //echo "ARRIVED UPDATE ".$arrived_passengers;
					$arrived_flights++;
					$flight_locker[$carrier.$flight_number]++;
			    }
			    else {
					$flight_locker[$carrier.$flight_number]++;
			    }
					

			}
			
		}
		
		return  array($arrived_passengers, $arrived_flights);		
		
	}
	


  	// MAIN

	$airports = array();
	$flights_arrived = array();
	$tourists_arrived = array();
	$passengers_arrived = array();
	$i = 0;
	
	
	$airports['IT_VCE'] = "VCE";
	$airports['IT_TSF'] = "TSF";
	
	
	
	//getFlightsForHours($airports[0],0, 6);
	//checkFlightData(0,0,0);
	foreach ($airports as $key => $airport){
		
		$average_airplane_fillrate = 0.9;
		
		$flight_data = array();
		
		$flight_data[0] =  getFlightsForHours_API($airport, 0, 6, $flight_locker);
		$flight_data[1] =  getFlightsForHours_API($airport, 6, 6, $flight_locker);
		$flight_data[2] =  getFlightsForHours_API($airport, 12, 6, $flight_locker);
		$flight_data[3] =  getFlightsForHours_API($airport, 18, 6, $flight_locker);
		
		
		//$flight_data[0] = getFlightsForHours_API($airport,0, 6, $flight_locker);
		//$flight_data[1] = getFlightsForHours_API($airport,6, 9, $flight_locker);
		//$flight_data[2] = getFlightsForHours_API($airport,9, 12, $flight_locker);
		//$flight_data[3] = getFlightsForHours_API($airport,12, 15, $flight_locker);
		//$flight_data[4] = getFlightsForHours_API($airport,15, 18, $flight_locker);
		//$flight_data[5] = getFlightsForHours_API($airport,18, 21, $flight_locker);
		//$flight_data[6] = getFlightsForHours_API($airport,21, 0, $flight_locker);

		$total_passengers = $flight_data[0][0] +
							$flight_data[1][0] +
							$flight_data[2][0] +
							$flight_data[3][0];

		$total_flights = 	$flight_data[0][1] +
							$flight_data[1][1] +
							$flight_data[2][1] +
							$flight_data[3][1];
							
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