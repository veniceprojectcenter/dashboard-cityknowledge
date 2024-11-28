<?
	require_once './lib/firebaseLib.php';

	// $url = 'https://vpc.firebaseio.com';
	// $fb = new fireBase($url);
	$url = 'https://venicedata.firebaseio.com/';
  $key = 'gG1wZ2oyUxca6Rro3XYsXaKH9ODG7nrKEUqVujWm';
  $fb = new fireBase($url, $key);

	$population = array('population' => getPopulation(), 'timestamp' => date("Y-m-d H:i:s", mktime(0, 0, 0)));
	$fb->push('/dashboard/venicePopulation', $population);
	$fb->set('/dashboard/currentPopulation', $population['population']);

	function getPopulation() {
		$feed_contents = file_get_contents('http://portale.comune.venezia.it/millefoglie/statistiche/scheda/QUARTIERE-POPOLA-2$1$------');
		$DOM = new DOMDocument;
		$DOM->loadHTML($feed_contents);

		$items = $DOM->getElementsByTagName('td');
 		$population = intval($items->item($items->length - 1)->nodeValue);

		/* Alternate estimator */
    /* $a = 75021909653928;
		   $b = -0.0104235080470971;
		   $c = date(Y) + ( date(z) / 365 );
		   $population = intval($a * exp($b * $c)); */
		/*                     */

		return $population;
	}

	$date = date("j-M-y");
	$population_record = "\n" . $date . "\t" . $population['population'];
	file_put_contents ("./logs/population.tsv", $population_record, FILE_APPEND);
?>
