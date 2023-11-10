
<?
	require_once("../lib/simple_html_dom.php");
	require_once('firebaseLib.php');

	$url = 'https://vpc.firebaseio.com';
	$fb = new fireBase($url);

	$display_fog_notice = shouldDisplayFogNotice();
	$fb->set('/dashboard/displayFogNotice', $display_fog_notice);

	// Fog notice displayed if visibility < 150m
	function shouldDisplayFogNotice() {
		$visibility = getVisibility();
		preg_match('/(&lt;|&gt;)(\d+)(k?m)/', $visibility, $matches);
		$visibility_dist = $matches[2];
		if ($matches[1] != "&lt;")
			return false;
		if ($matches[3] == "km")
			$visibility_dist *= 1000;
		return ($visibility_dist < 150 ? 0 : 0);
	}

	function getVisibility() {
		$html = file_get_html('http://www.ilmeteo.it/portale/meteo/previsioni1.php?citta=Venezia&c=7729');
		$visibility = "";
		foreach($html->find('tr') as $row) {
			if (strpos($row, "class=\"dark\"") || strpos($row, "class=\"light\"")) {
				$visibility_str = preg_replace('/\s+/', ' ',$row->find('td',9)->plaintext);
				$visibility_split = explode(" ", $visibility_str);
				$visibility = $visibility_split[0];
				break;
			}
		}
		return $visibility;
	}
?>