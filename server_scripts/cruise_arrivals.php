<?
  // error_reporting(E_ALL); ini_set('display_errors', 1);
  require_once("../lib/simple_html_dom.php");
  require_once 'firebaseLib.php';
  date_default_timezone_set('CET');

  $month = date('F');
  $year = date('Y');
  $url = 'http://ports.cruisett.com/schedule/Italy/733-Venice/' . $month . '_' . $year;
  $html = file_get_html($url);
  $row_num = 0;
  foreach ($html->find('table', 2)->find('tr') as $row) {
    $row_num++;
    if ($row_num == 1)
      continue;
    $arrival_date = $row->find('td', 0);
    $ships = $row->find('td', 2);
  }


  // foreach($html->find('tr') as $row) {
  //     $date_time = $row->find('th',0)->plaintext;
  //     $max_min = $row->find('td',0)->plaintext;
  //     $tide_level = floatval($row->find('td',1)->plaintext);
  // }



  // $fb->set('/dashboard/ships/ships_in_port', $ships_so_far);
  // $fb->set('/dashboard/ships/passengers', $passengers_so_far);
  // $fb->set('/dashboard/ships/crew', $crew_so_far);
  // $fb->set('/dashboard/ships/tourists', $tourists_so_far);
  // $fb->set('/dashboard/ships/ships_expected', $exp_ships);
  // $fb->set('/dashboard/ships/tourists_expected', $exp_tourists);
?>
