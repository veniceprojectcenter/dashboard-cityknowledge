<?
  error_reporting(E_ALL);
  ini_set('display_errors', 1);
  require_once 'lib/firebaseLib.php';
  
  //$fb = new firebase('https://vpc.firebaseio.com/dashboard');
  $url = 'https://venicedata.firebaseio.com/';
  $key = 'gG1wZ2oyUxca6Rro3XYsXaKH9ODG7nrKEUqVujWm';
  $fb = new fireBase($url, $key);
  // echo "Connected to Firebase";
  
  $api_url = 'http://servicev3.nmroads.com/RealMapWAR/GetMessageSigns';
  $messages = json_decode(
    file_get_contents($api_url, false, null, -1)
  );
  // echo "Messages acquired\n".file_get_contents($api_url);
  $fb->set('/dashboard/nmroads/signals', array());
  foreach ($messages->messageSigns as $msg) {
    if (!empty($msg->signText)) {
      $fb->push('/dashboard/nmroads/signals', $msg);
    } else {
      // $msg->signText = 'NO MESSAGE';
      // $fb->push('/dashboard/nmroads/signals', $msg);
    }
  }
?>
