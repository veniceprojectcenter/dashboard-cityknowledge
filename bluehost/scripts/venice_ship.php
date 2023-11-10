<?
	require_once('firebaseLib.php');

	$url = 'https://venicedata.firebaseio.com/';
  $key = 'gG1wZ2oyUxca6Rro3XYsXaKH9ODG7nrKEUqVujWm';
  $fb = new fireBase($url, $key);
  
  date_default_timezone_set('Europe/Rome');
  $now  = time();
  $week = time() + (7 * 24 * 60 * 60);
  $today_key = date('Ymd', $now );
  $week_key  = date('Ymd', $week);
  
  $data_ships  = json_decode($fb->get('dashboard/venice_ships/ship_capacities'), true);
  $today_ships_arrivals   = json_decode($fb->get('dashboard/venice_ships/arrivals/'   . $today_key), true);
  $today_ships_departures = json_decode($fb->get('dashboard/venice_ships/departures/' . $today_key), true);
  $today_ships_overnights = json_decode($fb->get('dashboard/venice_ships/overnight/'  . $today_key), true);
  
  $vs = array();
  $vs["arrivals_ship"  ] = count($today_ships_arrivals  );
  $vs["departures_ship"] = count($today_ships_departures);
  $vs["overnights_ship"] = count($today_ships_overnights);
  
  function reduce($node, $element) {
    global $data_ships;
    $result = 0;
    foreach ($node as $key => $value) {
      // echo "\nNAVE     " . $value['ship'];
      // echo "\nCHIAVE   " . str_replace(' ', '_', strtolower($value['ship']));
      // echo "\nDATI NAVI" . $data_ships[ str_replace(' ', '_', strtolower($value['ship'])) ];
      // echo "\nELEMENTO " . $element;
      // echo "\nDATO     " . $data_ships[ str_replace(' ', '_', strtolower($value['ship'])) ][$element];
      // echo "\nRESULT   " . $result;
      $result += $data_ships[ str_replace(' ', '_', strtolower($value['ship'])) ][$element];
      // echo "\nRESULT DOPO  " . $result;
    };
    echo "\n";
    return $result;
  };
  $vs["arrivals_pass"  ] = reduce($today_ships_arrivals  , 'passengers');
  $vs["departures_pass"] = reduce($today_ships_departures, 'passengers');
  $vs["overnights_pass"] = reduce($today_ships_overnights, 'passengers');
  
  $vs["arrivals_crew"  ] = reduce($today_ships_arrivals  , 'crew');
  $vs["departures_crew"] = reduce($today_ships_departures, 'crew');
  $vs["overnights_crew"] = reduce($today_ships_overnights, 'crew');
  
  $vs["arrivals_tour"  ] = intval($vs["arrivals_pass"  ] + $vs["arrivals_crew"  ]);
  $vs["departures_tour"] = intval($vs["departures_pass"] + $vs["departures_crew"]);
  $vs["overnights_tour"] = intval($vs["overnights_pass"] + $vs["overnights_crew"]);
  
	$fb->set('dashboard/dashboard/vs', $vs);
	
	$fb->set('dashboard/ships/tourists', intval($vs["arrivals_tour"  ] + $vs["overnights_tour"]));
?>