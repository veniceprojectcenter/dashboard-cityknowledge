<?php
 
 $queryvale="venice";
 
 if(isset($_GET["query"])){
    $queryvale=$_GET["query"];
 }
 
 
require_once('TwitterAPIExchange.php');
 
/** Set access tokens here - see: https://dev.twitter.com/apps/ **/
 $settings = array(
    'oauth_access_token'        => '2333147916-fxfFLz7PUYoM2cQeoO9s1GIv75BsA59UXrPXktb',
    'oauth_access_token_secret' => 'vov34Eb9EVdTdfcacccFHUclFybKq1RL3GBybIOil20R2',
    'consumer_key'              => 'qu98wj9fyMKxoIYxIGjpZjTao',
    'consumer_secret'           => 'GrY8uQj5UugGAHw5TBi8HwdmxniqJZo6gBhzLICsRoZatCQxB4'
);
 
$url           = 'https://api.twitter.com/1.1/search/tweets.json';
$getfield      = '?q=#'.$queryvale; 
$requestMethod = 'GET';

$twitter = new TwitterAPIExchange($settings);
 
//Exec twitter API 
$response = $twitter->setGetfield($getfield)
             ->buildOauth($url, $requestMethod)
             ->performRequest();

$obj = json_decode($response, true);             

$HTML="";

  
  
$HTML.="<div style=\"height: 100%; width: 100%\">";
if(count(@$obj["statuses"])>0){
    foreach ($obj["statuses"] as $index => $result) {
    
        $tweet      = $result['text'];
        $user          = $result['user']['screen_name'];
        $profile_image = $result['user']['profile_image_url'];
        
        $HTML.= "<br>";
        $HTML.= "<img src=\"".$profile_image."\" width=\"30px\" height=\"30px\" />";
        $HTML.= " <a target=\"_blank\" href=\"http://twitter.com/$user\">@$user</a>";
        $HTML.= "<br/>";
        $HTML.= " $tweet";
        $HTML.= "<br>";
    } 
}
$HTML.= "</div>";


//Send data	
$json_data = array( 'error' => 0, 'error_Str' => '' ,'html' => $HTML );
header('Content-type: application/json');
die( json_encode($json_data) );
			  
?>