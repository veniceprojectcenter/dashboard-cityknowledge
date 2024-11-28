
<?
	require_once("./lib/tide_functions.php");
	require_once('./lib/firebaseLib.php');

	// $url = 'https://vpc.firebaseio.com';
	// $fb = new fireBase($url);
	$url = 'https://venicedata.firebaseio.com/';
  $key = 'gG1wZ2oyUxca6Rro3XYsXaKH9ODG7nrKEUqVujWm';
  $fb = new fireBase($url, $key);

	$current_level = getCurrentTideLevel();
	$fb->set('/dashboard/current_tide_level', $current_level);

	$next_peak = getNextPeak();
	$fb->set('/dashboard/next_tide_peak', $next_peak);

	$next_significant_tide = getNextSignificantTide();
	if (!is_null($next_significant_tide))
		$fb->set('/dashboard/next_significant_tide', $next_significant_tide);
	else
		$fb->set('/dashboard/next_significant_tide', "");

	// record tide level and timestamp to firebase log
	$tide_record = array('timestamp' => date('Y-m-d G:i:s'),
											 'puntaSalute' => $current_level['tide_level']);
	$fb->push('/dashboard/tideLog', $tide_record);

	// record tide level and timestamp to csv file
	$tide_csv_record = "\n" . date('Y-m-d G:i:s') . "," . $current_level['tide_level'];
	file_put_contents('./logs/tide_forecast.csv', $tide_csv_record, FILE_APPEND);

	// record tide level and timestamp to json file
	$past_entries = json_decode(file_get_contents('./logs/tide_forecast.json'))->{'tide_records'};
	array_push($past_entries, $tide_record);
	file_put_contents('./logs/tide_forecast.json', json_encode(array('tide_records' => $past_entries)));
?>
