<?
	require_once 'firebaseLib.php';

	$url = 'https://vpc.firebaseio.com';
	$fb = new fireBase($url);

	$rss = simplexml_load_file('http://www.ilgazzettino.it/rss/nordest_venezia.xml');
	$titles = "";
	$tags = "";
	foreach ($rss->channel->item as $item) {
		foreach (explode(' ', $item->link) as $link) {
			$page = file_get_contents($link);
			$dom = new DomDocument();
			$dom->loadHTML($page);
			$xpath = new DOMXPath($dom);
			foreach ($xpath->query('//a[contains(@href, "tag")]') as $a) {
			    $tag = strtolower($a->nodeValue);
				if (!preg_match('/\s/',$tag) && strlen($tag) >= 4 && $tag != "venezia" && $tag != "chioggia" && $tag != "mestre" && $tag != "gazzettino" && $tag != "spinea" && $tag != "murano" && $tag != "marghera" && $tag != "jesolo" && $tag != "san" && $tag != "brenta" && $tag != 'italia' && $tag != 'italiano' && $tag != 'jesolana') {
					if ($tags != "")
						$tags .= " ";
					$tags .= $tag;
				}	
			}
		}
	}

	$tags_arr = explode(" ", $tags);
	$tags_json = json_encode($tags_arr);

	$fb->set('/dashboard/newsTags', $tags_json);
?>