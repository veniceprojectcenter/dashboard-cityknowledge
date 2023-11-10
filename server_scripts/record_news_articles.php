<?
	require_once 'firebaseLib.php';

	function fetch_news($art_num){
		/* first grab entire xml file */
		$feed = file_get_contents('https://www.ilgazzettino.it/rss/nordest_venezia.xml');
		
		/* convert to SimpleXMLElement object */
		$feed = simplexml_load_string($feed);

		$cur_item = $feed->channel->item[$art_num];
		$item_contents = array('title'	=> (string)$cur_item->title,
							   'link'	=> (string)$cur_item->link,
							   'image'	=> (string)$cur_item->enclosure['url']);	

		return $item_contents;	
	}

	$latest_articles = array(fetch_news(0), fetch_news(1), fetch_news(2), fetch_news(3), fetch_news(4));
	$articles_json = json_encode($latest_articles);

	$url = 'https://vpc.firebaseio.com';
	$fb = new fireBase($url);

	$fb->set('/dashboard/news_articles', json_encode($latest_articles));
?>