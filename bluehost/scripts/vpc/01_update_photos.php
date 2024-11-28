<?
  error_reporting(E_ALL);
  ini_set('display_errors', 1);

  require_once './lib/firebaseLib.php';
  
  //$fb = new firebase('https://vpc.firebaseio.com/dashboard');
  $url = 'https://venicedata.firebaseio.com/dashboard';
  $key = 'gG1wZ2oyUxca6Rro3XYsXaKH9ODG7nrKEUqVujWm';
  $fb = new fireBase($url, $key);
  

  $api_url = 'https://api.instagram.com/v1/media/search?lat=45.44&lng=12.33&access_token=206358740.46d5187.2b106d6b12914708a1a92e37b29ec867';
  $photos = json_decode(file_get_contents($api_url));
  $fb->set('venice_photos', array());
  foreach ($photos->data as $photo) {
    $url = $photo->images->standard_resolution->url;
    $fb->push('/venice_photos', array('url' => $url));
  }
?>
