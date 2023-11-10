<?

  require_once './lib/firebaseLib.php';
  date_default_timezone_set('CET');

  function month_multiplier($month) {
    if ($month == 1)
      return 0.54;
    if ($month == 2)
      return 0.69;
    if ($month == 3)
      return 0.87;
    if ($month == 4)
      return 0.90;
    if ($month == 5)
      return 0.87;
    if ($month == 6)
      return 0.90;
    if ($month == 7)
      return 0.85;
    if ($month == 8)
      return 0.80;
    if ($month == 9)
      return 0.80;
    if ($month == 10)
      return 0.69;
    if ($month == 11)
      return 0.59;
    if ($month == 12)
      return 0.44;
    return 0.70;
  }

  function day_multiplier($day) {
    // if (date('m-d-Y') == '02-13-2015' || date('m-d-Y') == '02-14-2015' || date('m-d-Y') == '02-15-2015' || date('m-d-Y') == '02-16-2015' || date('m-d-Y') == '02-17-2015') {
    //   return 1.5;
    // }
    if ($day == 0 || $day == 5 || $day == 6) // weekend
      return 1;
    else // weekday
      return 0.46;
  }

  $url = 'https://venicedata.firebaseio.com/'; //'https://vpc.firebaseio.com';
  $key = 'gG1wZ2oyUxca6Rro3XYsXaKH9ODG7nrKEUqVujWm';
  // $fb = new fireBase($url);
  $fb = new fireBase($url, $key);

  $venice_airport_arrivals = $fb->get('dashboard/flights/passenger_ref');

  $air_arrivals = floor($venice_airport_arrivals + $venice_airport_arrivals * 0.389);
  $cruise_arrivals = $fb->get('dashboard/ships/tourists');
  $max_occupancy = 23733;
  $estimated_hotels = floor($max_occupancy * month_multiplier(date('n')) * day_multiplier(date('j') - 1));

  $air_overnights = floor((1262000/3450000) * $air_arrivals);
  $train_overnights = floor((1347000/5879000) * $estimated_hotels);
  $auto_overnights = floor((268000/5879000) * $estimated_hotels);
  $coach_overnights = floor((365000/5879000) * $estimated_hotels);
  $bus_overnights = floor((120000/5879000) * $estimated_hotels);
  $cruise_overnights = floor(((514000+329000)/239000) * $cruise_arrivals);
  $boat_overnights = 0;

  $air_daytrips = 0;
  $train_daytrips = floor(((450000+6670000)/1347000) * $train_overnights);
  $auto_daytrips = floor((751000/268000) * $auto_overnights);
  $coach_daytrips = floor(((547000+1787000)/365000) * $coach_overnights);
  $bus_daytrips = floor(((1110000+600000)/120000) * $bus_overnights);
  $cruise_daytrips = 0;
  $boat_daytrips = floor((466000+160000+2235000)/(450000+6670000+751000+547000+1787000+1110000+600000+466000+160000+2235000) * ($train_daytrips + $auto_daytrips + $coach_daytrips + $bus_daytrips + $cruise_daytrips));

  $train_arrivals = floor((509000/1347000) * $train_overnights + $train_overnights + $train_daytrips);
  $auto_arrivals = floor((95000/268000) * $auto_overnights + $auto_overnights + $auto_daytrips);
  $coach_arrivals = floor((131000/365000) * $coach_overnights + $coach_overnights + $coach_daytrips);
  $bus_arrivals = floor((44000/120000) * $bus_overnights + $bus_overnights + $bus_daytrips);
  $boat_arrivals = $boat_daytrips;

  $total_arrivals = $air_arrivals + $cruise_arrivals + $train_arrivals + $auto_arrivals + $bus_arrivals + $coach_arrivals + $boat_arrivals;
  $total_overnights = $air_overnights + $cruise_overnights + $train_overnights + $auto_overnights + $bus_overnights + $coach_overnights + $boat_overnights;
  $total_daytrips = $air_daytrips + $cruise_daytrips + $train_daytrips + $auto_daytrips + $bus_daytrips + $coach_daytrips + $boat_daytrips;

  $entry = array(
    'date' => date('Y-m-d G:i:s'),
    'air_arrivals' => $air_arrivals,
    'air_overnights' => $air_overnights,
    'air_daytrips' => $air_daytrips,
    'train_arrivals' => $train_arrivals,
    'train_overnights' => $train_overnights,
    'train_daytrips' => $train_daytrips,
    'auto_arrivals' => $auto_arrivals,
    'auto_overnights' => $auto_overnights,
    'auto_daytrips' => $auto_daytrips,
    'coach_arrivals' => $coach_arrivals,
    'coach_overnights' => $coach_overnights,
    'coach_daytrips' => $coach_daytrips,
    'bus_arrivals' => $bus_arrivals,
    'bus_overnights' => $bus_overnights,
    'bus_daytrips' => $bus_daytrips,
    'cruise_arrivals' => $cruise_arrivals,
    'cruise_overnights' => $cruise_overnights,
    'cruise_daytrips' => $cruise_daytrips,
    'boat_arrivals' => $boat_arrivals,
    'boat_overnights' => $boat_overnights,
    'boat_daytrips' => $boat_daytrips,
    'total_arrivals' => $total_arrivals,
    'total_overnights' => $total_overnights,
    'total_daytrips' => $total_daytrips,
    'total_arrivals)' => $total_arrivals);

  print_r($entry);

  $fb->push('/dashboard/tourists', $entry);
?>
