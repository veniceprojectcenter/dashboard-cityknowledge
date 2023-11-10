<?php
	error_reporting(E_ERROR);
	ini_set('display_errors', E_ERROR);
	ini_set('max_execution_time', 600); //300 seconds = 5 minutes
	set_time_limit(600);
 

	require_once("./lib/simple_html_dom.php");
	require_once './lib/firebaseLib.php';
	require_once './lib/airport_utilities.php';

	date_default_timezone_set('CET');
	
	// $url = 'https://vpc.firebaseio.com';
	// $fb = new fireBase($url);
	$url = 'https://venicedata.firebaseio.com/';
    $key = 'gG1wZ2oyUxca6Rro3XYsXaKH9ODG7nrKEUqVujWm';
	$fb = new fireBase($url, $key);
	
	$result_array = array();	
	
     

	function parsePage($page_number, &$result_array){
		// create XPATH parser
		//get all the RE
		$RE_url = "http://www.immobiliare.it/ricerca.php?idCategoria=1&idContratto=1&idTipologia=&sottotipologia=&idTipologiaStanza=&idFasciaPrezzo=&idNazione=IT&idRegione=&idProvincia=&idComune=&idLocalita=&idAreaGeografica=&prezzoMinimo=&prezzoMassimo=&balcone=&balconeOterrazzo=&boxOpostoauto=&stato=&terrazzo=&bagni=&mappa=&foto=&boxAuto=&riscaldamenti=&giardino=&superficie=&superficieMinima=&superficieMassima=&raggio=2873.0228699800987&locali=&localiMinimo=&localiMassimo=&criterio=rilevanza&ordine=desc&map=0&tipoProprieta=&arredato=&inAsta=&noAste=&aReddito=&fumatore=&animali=&franchising=&flagNc=&gayfriendly=&internet=&sessoInquilini=&vacanze=&categoriaStanza=&fkTipologiaStanza=&ascensore=&classeEnergetica=&verticaleAste=&pag=10&centro=45.43604465175716,12.33489990234375&pag=$page_number";// page---
		//echo $RE_url;
		$html_contents = @file_get_contents($RE_url);
	
		// get the number of pages available
		$DOM = new DOMDocument;
		$DOM->loadHTML($html_contents);
		
		
		$count = 0;					
		$xpath = new DOMXpath($DOM);		
		$listings = $xpath->query('//div[@class="wrapper_riga_annuncio"]');	
			
		$titolo = "";
		$indirizzo = "";
		$sestiere = "";
		
		$id = "";
		$descrizione = "";
		$dimensione = "";
		$stanze = "";
		$costo = "";
		$RE_id = "";
 

	    foreach($listings as $key => $entry ){
	    	
	    	// get id
	    	$id = $xpath->query('//a[@class="scrollDist"]', $entry);
	    	$raw_id = $id->item($count)->getAttribute( 'id' );
    		$RE_id =  preg_replace('/[^A-Za-z0-9\s.\s-]/','',$raw_id);
    		//echo $RE_id."\n";
	    	/*
			foreach($id as $key => $value){
				$raw_id = $value->getAttribute( 'id' );
	    		$RE_id =  preg_replace('/[^A-Za-z0-9\s.\s-]/','',$raw_id);
				$result_array[$count] = array();
				$result_array[$count]['id'] = $RE_id;
				echo "<br>RE_ID /  $RE_id / $count \n";
			}
			*/
	    	
	    	
	    	$title = $xpath->query('//div[@class="annuncio_title"]', $entry);
			//print_r($sub);
			
			$titolo =  trim($title->item($count)->textContent);
    		$indirizzo =  preg_replace("/[^0-9]/", "", $titolo);
	    	$result_array[$RE_id]['titolo'] = $titolo;
	    	$result_array[$RE_id]['indirizzo'] = $indirizzo;			
			

	    	
	    	$sub_cost = $xpath->query('//div[@class="bottom"]', $entry);
	    	$RE_info =  $sub_cost->item($count)->textContent;
	    	//echo $RE_info;
			$clean_string = preg_replace('/\s+/', '', $RE_info);	    		
	    	$array = explode("|", trim($clean_string));
	    		
	    	if (sizeof($array) > 2){
	    			$result_array[$RE_id]['prezzo'] =  preg_replace("/[^0-9]/", "", $array[0]);
	    			$result_array[$RE_id]['metri_quadrati'] = preg_replace("/[^0-9,.]/", "", $array[1]);
	    			$result_array[$RE_id]['locali'] = preg_replace("/[^0-9,.]/", "", $array[2]);
	    	}	  
	    	
	    	// set date 
	    	$current_month     = date('m'); 
			$current_day       = date('d'); 
			$current_year      = date('Y');
 			$today    =$current_year.$current_month.$current_day;
	    	$result_array[$RE_id]['last_update'] = $today;
	    	
	    	$sub_cost = $xpath->query('//div[@class="luogo"]', $entry);
	    	$sestiere =  $sub_cost->item($count)->getAttribute('title');
	    	$result_array[$RE_id]['sestiere'] = str_replace(' ', '', $sestiere);

	    	$count++;
	    }
	    echo sizeof($result_array);	

		return $result_array;
		
	}

	//get all the RE
	$RE_url = "http://www.immobiliare.it/ricerca.php?idCategoria=1&idContratto=1&idTipologia=&sottotipologia=&idTipologiaStanza=&idFasciaPrezzo=&idNazione=IT&idRegione=&idProvincia=&idComune=&idLocalita=&idAreaGeografica=&prezzoMinimo=&prezzoMassimo=&balcone=&balconeOterrazzo=&boxOpostoauto=&stato=&terrazzo=&bagni=&mappa=&foto=&boxAuto=&riscaldamenti=&giardino=&superficie=&superficieMinima=&superficieMassima=&raggio=2873.0228699800987&locali=&localiMinimo=&localiMassimo=&criterio=rilevanza&ordine=desc&map=0&tipoProprieta=&arredato=&inAsta=&noAste=&aReddito=&fumatore=&animali=&franchising=&flagNc=&gayfriendly=&internet=&sessoInquilini=&vacanze=&categoriaStanza=&fkTipologiaStanza=&ascensore=&classeEnergetica=&verticaleAste=&pag=10&centro=45.43604465175716,12.33489990234375";
	
	echo "<br>URL_REALESTATE:".$RE_url;
	
	$html_contents = @file_get_contents($RE_url);

	// get the number of pages available
	$DOM = new DOMDocument;
	$DOM->loadHTML($html_contents);
				
	$xpath = new DOMXpath($DOM);

	//get pages
	$pcount = $xpath->query('//div[@id="pageCount"]');	
    foreach($pcount as $tag){
        $pages = $tag->nodeValue;
        // split by 'di'
    	$pieces = explode("di ", trim($pages));
    //	echo $pieces[1];
    	$pcount = $pieces[1];

    	$pcount = intval( preg_replace('/[^0-9,.]+/i', '', $pcount));
    	echo $pcount;
    }
    
    echo "<br>PAGE_COUNT:".$pcount;

	
 //	$pcount = 2;
	for ($i = 0; $i < $pcount ; $i++){
		// get all annunci for this 
    	$result_array = parsePage($i, $result_array);
	}
	
	
	// push results to FB
	foreach($result_array as $key => $value){
		// update nodes 
		$dburl='/dashboard/realestate/immobiliare/'. urlencode($key)."/";
	    echo "<br>Save REAL_ESTATE in $dburl\n";
	    $fb->update($dburl, $value); 
	}
	
	// perform averaging
	
	echo "<br><br><br><b>****STATISTICS CALC</b><br><br>\n";
	$CONF_BACKDAYS="7";
	$YESTERDAY_BACKDAYS="1";
	 
	
	$IMMOBILIARE_TODAY              =array(); 
	$IMMOBILIARE_TODAY["selled"]    =0; 
	
	/*
	$IMMOBILIARE_TODAY["cannaregio"]["total"]       ="";
	$IMMOBILIARE_TODAY["cannaregio"]["total_meters"]="";
	*/
	
	$Today_YMD              =date('ymd');
	$Today_Timestamp        =date('U');
	
	$Yesterday_YMD           =Date('ymd', strtotime("-".$YESTERDAY_BACKDAYS." days"));
	$Yesterday_Timestamp      =Date('U',  strtotime("-".$YESTERDAY_BACKDAYS." days"));
	
	$LastWeekDate           =Date('ymd', strtotime("-".$CONF_BACKDAYS." days"));
	$LastWeekTimestamp      =Date('U',  strtotime("-".$CONF_BACKDAYS." days"));
	
	
	 //Get current 
	$DB_IMMOBILIARE      = $fb->get('/dashboard/realestate/immobiliare/');
	$DB_IMMOBILIARE_ARR  = json_decode($DB_IMMOBILIARE,true); 
	
	$total_recs=count($DB_IMMOBILIARE_ARR);
	echo "<br><br>Total recs: $total_recs";
	echo "<br><br>Date from: $LastWeekDate ($LastWeekTimestamp) to: $Yesterday_YMD ($Yesterday_Timestamp)";
	
	$IMMOBILIARE_TODAY['total']["selled"] = 0;
	
	foreach($DB_IMMOBILIARE_ARR AS $IDD => $CASA){ 
	    $date_last_upd_timestamp = strtotime($CASA["last_update"]);
	    $date_last_upd_YMD       = date('ymd',$date_last_upd_timestamp);
	 
	    echo "<br><br>RECORD last_update:$date_last_upd_YMD ($date_last_upd_timestamp)";
	 
	 
	    //Check if its between yesterday and one week ago
	    if($date_last_upd_timestamp>$LastWeekTimestamp && $date_last_upd_timestamp<$Yesterday_Timestamp){
	        
	        //if not is today is selled
	       // if(!($CASA["last_update"]==$Yesterday_YMD)){
	            //echo "<br> IS SOLD!";
			    if ($CASA['sestiere'] == 'Dorsoduro' || $CASA['sestiere'] == 'Cannaregio' || $CASA['sestiere'] == 'Castello' || $CASA['sestiere'] == 'Giudecca' || $CASA['sestiere'] == 'SanPolo' || $CASA['sestiere'] == 'SantaCroce' || $CASA['sestiere'] == 'SanMarco'){
	            
		            $IMMOBILIARE_TODAY[$CASA['sestiere']]["selled"]++;
		            $IMMOBILIARE_TODAY['total']["selled"]++;

			    }

	        //}
	    
	    }
	    
	    // check if its available today
	    if($date_last_upd_timestamp>$YesterdayTimestamp && $date_last_upd_timestamp<=$Today_Timestamp){
		    //echo "<br><br>";
		    // aggregate stuff
		    if ($CASA['sestiere'] == 'Dorsoduro' || $CASA['sestiere'] == 'Cannaregio' || $CASA['sestiere'] == 'Castello' || $CASA['sestiere'] == 'Giudecca' || $CASA['sestiere'] == 'SanPolo' || $CASA['sestiere'] == 'SantaCroce' || $CASA['sestiere'] == 'SanMarco'){
		    	$IMMOBILIARE_TODAY[$CASA['sestiere']]['total']++;
		    	$IMMOBILIARE_TODAY[$CASA['sestiere']]['total_meters'] += intval($CASA['metri_quadrati']);
		    	$IMMOBILIARE_TODAY[$CASA['sestiere']]['total_cost'] += intval($CASA['prezzo']);
		        $IMMOBILIARE_TODAY['total']["available"]++;
		    }
		    
	    }
		$IMMOBILIARE_TODAY[$CASA['sestiere']]['average_meter_cost'] = intval($IMMOBILIARE_TODAY[$CASA['sestiere']]['total_cost'] / $IMMOBILIARE_TODAY[$CASA['sestiere']]['total_meters']);
	    
	}
	
	
	$today      = date('Ymd');
	
	// push results to FB
	// update nodes 
	
	foreach ($IMMOBILIARE_TODAY as $key => $value){
		echo $key."\n";
		
		if ($key != ''){
			$dburl='/dashboard/realestate/immobiliare_todays/'.$today.'/'.$key.'/';
			echo "<br>Save REAL_ESTATE in $dburl\n";
			$fb->update($dburl, $value); 
		}
		
	}
	

	print_r($IMMOBILIARE_TODAY);
	
 
?>