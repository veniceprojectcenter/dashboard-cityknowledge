<?
  error_reporting(E_ALL);
  ini_set('display_errors', 1);
  require_once 'lib/firebaseLib.php';
  require_once 'lib/TwitterAPIExchange.php';
  
  //$fb = new firebase('https://vpc.firebaseio.com/dashboard');
  $url = 'https://venicedata.firebaseio.com/';
  $key = 'gG1wZ2oyUxca6Rro3XYsXaKH9ODG7nrKEUqVujWm';
  $fb = new fireBase($url, $key);
  // echo "Connected to Firebase";
  
  $settings = array(
    'oauth_access_token'        => '2333147916-fxfFLz7PUYoM2cQeoO9s1GIv75BsA59UXrPXktb',
    'oauth_access_token_secret' => 'vov34Eb9EVdTdfcacccFHUclFybKq1RL3GBybIOil20R2',
    'consumer_key'              => 'qu98wj9fyMKxoIYxIGjpZjTao',
    'consumer_secret'           => 'GrY8uQj5UugGAHw5TBi8HwdmxniqJZo6gBhzLICsRoZatCQxB4'
  );
  $queryvale="venice";#"nmroads511";
  
  $url           = 'https://api.twitter.com/1.1/search/tweets.json';
  $getfield      = '?q=#'.$queryvale; 
  $requestMethod = 'GET';
  
  $twitter = new TwitterAPIExchange($settings);
  //Exec twitter API 
  $response = $twitter->setGetfield($getfield)
                      ->buildOauth($url, $requestMethod)
                      ->performRequest();
  $messages = json_decode($response, true);
  
  $fb->set('/dashboard/nmroads/tweets', array());
  foreach ($messages["statuses"] as $msg) {
    $fb->push('/dashboard/nmroads/tweets', $msg);
  }		  
?>