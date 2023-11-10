
<?
ini_set('display_errors', '1');
	require_once("../lib/simple_html_dom.php");
	require_once('firebaseLib.php');
	date_default_timezone_set('CET');


print_r(highestTideToday());
	function highestTideToday() {
		$tide_measurements = getTideMeasurements();
		$max_seen_tide = -999;
		$max_seen_time = "";
		foreach ($tide_measurements as $tide_measurement) {
			$date_time = $tide_measurement['date_time'];
			$date_time_arr = explode(" ", $date_time);
			$time = $date_time_arr[1];
			$max_min = $tide_measurement['max_min'];
			$tide_level = $tide_measurement['tide_level'];
			if (phpDateTime($date_time) > time() && $max_min == 'massimo' && $tide_level > $max_seen_tide && date('d', phpDateTime($date_time)) == 15) {									$max_seen_tide = $tide_level;
				$max_seen_time = $time;
			}
		}
		return array("tide_level" => $max_seen_tide, "time" => $max_seen_time);
	}

	function getNextPeak() {
		$tide_measurements = getTideMeasurements();
		foreach ($tide_measurements as $tide_measurement) {
			$date_time = $tide_measurement['date_time'];
			$date_time_arr = explode(" ", $date_time);
			$time = $date_time_arr[1];
			$max_min = $tide_measurement['max_min'];
			$tide_level = $tide_measurement['tide_level'];
			if (phpDateTime($date_time) > time() && $max_min == 'massimo') {
				return array("tide_level" => $tide_level, "time" => $time);
			}
		}
	}

	function getNextSignificantTide() {
		$tide_measurements = getTideMeasurements();
		foreach ($tide_measurements as $tide_measurement) {
			$date_time = $tide_measurement['date_time'];
			$date_time_arr = explode(" ", $date_time);
			$time = $date_time_arr[1];
			$max_min = $tide_measurement['max_min'];
			$tide_level = $tide_measurement['tide_level'];
			if (phpDateTime($date_time) > time() && $max_min == 'massimo' && $tide_level >= 0.80) {
				return array("tide_level" => $tide_level, "time" => $time);
			}
		}
		return NULL;
	}

	// Takes in a time in DD/MM/YYYY HH:MM format
	function phpDateTime($date_time) {
		$date_time = str_replace('/', '-', $date_time);
		return strtotime($date_time);
	}

	// Returns the upcoming tide measurements
	function getTideMeasurements() {
		$tide_measurements = array();

		$html = file_get_html('http://www.comune.venezia.it/flex/cm/pages/ServeBLOB.php/L/IT/IDPagina/1748');
		$count = 0;
		foreach($html->find('tr') as $row) {
    		$date_time = $row->find('th',0)->plaintext;
		    $max_min = $row->find('td',0)->plaintext;
	    	$tide_level = floatval($row->find('td',1)->plaintext);
	
			if ($date_time == '' || $tide_level == '' || $max_min == '') 
				continue;

			$tide_measurements[$count]['date_time'] = $date_time;
			$tide_measurements[$count]['tide_level'] = $tide_level / 100;
			$tide_measurements[$count]['max_min'] = $max_min;

			$count++;
		}
		return $tide_measurements;
	}

	function getCurrentTideLevel() {
		$feed_contents = file_get_contents('http://93.62.201.235/maree/ESPORTAZIONI/DATI/Punta_Salute.html');
		$DOM = new DOMDocument;
		$DOM->loadHTML($feed_contents);

		$items = $DOM->getElementsByTagName('td');
		$current_tide_level = floatval($items->item($items->length - 2)->nodeValue);

		$tide_measurements = getTideMeasurements();
		foreach ($tide_measurements as $tide_measurement) {
			$date_time = $tide_measurement['date_time'];
			$tide_level = $tide_measurement['tide_level'];
			if (phpDateTime($date_time) > time()) {
				$direction = ($tide_level > $current_tide_level ? 1 : -1);
				break;
			}
		}

		return array("tide_level" => $current_tide_level, "direction" => $direction);
	}
?>