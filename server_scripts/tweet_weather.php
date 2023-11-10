<?
  require_once('../twitter-api-php/TwitterAPIExchange.php');
  require_once('./tide_functions.php');

  $json_string = file_get_contents("http://api.wunderground.com/api/fa540e285d09b3f0/geolookup/forecast/q/VCE.json");
  $parsed_json = json_decode($json_string);
  $current_weather = $parsed_json->{'forecast'}->{'txt_forecast'}->{'forecastday'}[0]->{'fcttext_metric'};

  // Remove wind forecast
  $weather_without_wind = explode(".", $current_weather);
  array_pop($weather_without_wind);  
  array_pop($weather_without_wind);
  $current_weather = implode(".", $weather_without_wind) . ".";

  $highest_tide_today = highestTideToday();
  $color_for_tide = colorForTide($highest_tide_today['tide_level']);
  if ($color_for_tide == "Green" || $highest_tide_today['tide_level'] == -999)
	 $current_weather .= " No high tides expected.";
  else
	 $current_weather .= " Highest tide will be " . $highest_tide_today['tide_level'] . "m @ " . $highest_tide_today['time'] . " [Code " . $color_for_tide . "].";
  
  $weather_tweet = "Today's forecast: " . $current_weather;

  $settings = array(
      'oauth_access_token' => "2229859416-O7Tlj8DcPWyO9f6REFzEDbfPk6n6KSB5IVyGhc4",
      'oauth_access_token_secret' => "7oL5Cci8PQRMdlPwC6SZ07iOZyTwEfeMxM3waTdffXaPW",
      'consumer_key' => "rTNAbJaLZ6Z80XfvCzOYw",
      'consumer_secret' => "c9ybjc2Anewwh0Jb8pzvQs8VxwJ0LXzf7xvNeLhw3AM"
  );

  $url = 'https://api.twitter.com/1.1/statuses/update.json';
  $requestMethod = 'POST';

  $postfields = array('status' => $weather_tweet);
  $twitter = new TwitterAPIExchange($settings);
  echo $twitter->buildOauth($url, $requestMethod)
               ->setPostfields($postfields)
               ->performRequest();
?>
