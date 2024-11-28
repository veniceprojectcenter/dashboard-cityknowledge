
<?
	error_reporting(E_ALL);
	ini_set('display_errors', 1);

	require_once("simple_html_dom.php");
	require_once 'firebaseLib.php';
	date_default_timezone_set('CET');

	function getFlightsForHours($starting_hour, $ending_hour) {
		$current_time = date('g:i A');
		$current_date = date('Y-m-d');
		$url = "https://www.flightstats.com/go/FlightStatus/flightStatusByAirport.do?airport=%28VCE%29+Venice+Marco+Polo+Airport%2C+Venice%2C+IT&airportQueryDate=" . $current_date . "&airlineToFilter=&airportQueryType=1&x=5&y=6&&airportQueryTime=" . $starting_hour;
		$html = file_get_html($url);
		$arrived_flights = 0;
		$i = 0;
		foreach($html->find('table', 10)->find('tr') as $row) {
			if ($i++ < 2) {
				continue;
			}
  		$scheduled_arrival_time = date('g:i A', strtotime($row->find('td', 4)->plaintext));
			if (!$scheduled_arrival_time)
				continue;
			if ($scheduled_arrival_time - $current_time <= 0 && !($scheduled_arrival_time - $current_time <= 0 && substr($scheduled_arrival_time, -2) != substr($current_time, -2))) {
				$arrived_flights++;
			}
			$i++;
		}
		return $arrived_flights;
	}

	$flights_arrived = getFlightsForHours(0, 6) +
									  getFlightsForHours(6, 9) +
									  getFlightsForHours(9, 12) +
									  getFlightsForHours(12, 15) +
								 	  getFlightsForHours(15, 18) +
									  getFlightsForHours(18, 21) +
									  getFlightsForHours(21, 0);

	$passengers_arrived = $flights_arrived * 160;
	$tourists_arrived = intval($passengers_arrived * .7);

	$url = 'https://vpc.firebaseio.com';
	$fb = new fireBase($url);
	$fb->set('/dashboard/flights/flights_ref', $flights_arrived);
	$fb->set('/dashboard/flights/passenger_ref', $tourists_arrived);
	$fb->set('/dashboard/flights/capacity_ref', $passengers_arrived);

	$venice_airport_entry = array('time' => date('Y-m-d G:i:s'),
																'flightsArrived' => $flights_arrived,
																'passengersArrived' => $passengers_arrived,
																'touristsArrived' => $tourists_arrived);
	$fb->push('/dashboard/flightLogs/venice', $venice_airport_entry);
?>
