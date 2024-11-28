<?php

  /*
  
   CRON: Daily
   
  */
  
  
	error_reporting(E_ERROR);
	ini_set('display_errors', E_ERROR);
 
	require_once './lib/firebaseLib.php';
	//date_default_timezone_set('CET');
  date_default_timezone_set('UTC');

	// $url = 'https://vpc.firebaseio.com';
	// $fb = new fireBase($url);
	$url = 'https://venicedata.firebaseio.com/';
  $key = 'gG1wZ2oyUxca6Rro3XYsXaKH9ODG7nrKEUqVujWm';
  $fb = new fireBase($url, $key);
 
function get_web_page_by_post($url,$post_data){
           
         
        //traverse array and prepare data for posting (key1=value1)
        foreach ( $post_data as $key => $value) {
            $post_items[] = $key . '=' . $value;
        }
         
        //create the final string to be posted using implode()
        $post_string = implode ('&', $post_items);
         
        //create cURL connection
        $curl_connection = 
          curl_init($url);
         
        //set options
        curl_setopt($curl_connection, CURLOPT_CONNECTTIMEOUT, 30);
        curl_setopt($curl_connection, CURLOPT_USERAGENT, 
          "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)");
        curl_setopt($curl_connection, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl_connection, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($curl_connection, CURLOPT_FOLLOWLOCATION, 1);
         
        //set data to be posted
        curl_setopt($curl_connection, CURLOPT_POSTFIELDS, $post_string);
         
        //perform our request
        $result = curl_exec($curl_connection);
         
        //show information regarding the request
        print_r(curl_getinfo($curl_connection));
        echo curl_errno($curl_connection) . '-' . 
        curl_error($curl_connection);
         
        //close the connection
        curl_close($curl_connection);
        
        return $result;

}

	function grabVeniceEventsFromWheresup($lat_from,$lat_to,$lng_from,$lng_to,$current_year,$current_month,$current_day ) {

      	
      	$date_from=$current_year.'-'.$current_month.'-'.$current_day.'T00:00:00.000Z';
      	$date_to  =$current_year.'-'.$current_month.'-'.$current_day.'T23:59:00.000Z';
      	
      	echo "<br>Load venice wheresup events from: $date_from to: $date_to";
	
        $fields = array(
            'op' => 'event/searchEvents',
            'vs' => '100',
            'limit' => '1000',
            'offset' => '0',
            'lat_to' => $lat_to,
            'lng_to' => $lng_to,
            'lng_from' => $lng_from,
            'lat_from' => $lat_from,
            'date_from' =>$date_from,
            'date_to' =>$date_to,
            'filter_not_repeated' => '1',
            'basic' => '1',
            'lang' => 'it',
            'timeoffset' => '2',
            'token' => 'false',
            'order_by' => 'importance,date'
        );

       
    $url= "http://wheresup.com/index.php/tools/packages/wheresup/api"; 
		echo "<br>Url:".$url ;
    		
    $response = get_web_page_by_post($url,$fields);
    //echo "<pre>"; print_r($response); echo "</pre>";		
    $resArr = array();
    $resArr = json_decode($response);
    
    //echo "<pre>"; print_r($resArr->{'result'}->{'events'}); echo "</pre>";		
    
    $return_events=array();
		
		/*
		   stdClass Object ( [url] => 4bc351i0gu [name] => VISITE GUIDATE GRATUITE [start] => 2015-05-02T06:00:00+02:00 [end] => 2015-05-02T21:59:59+02:00 [latitude] => 45.4386 [longitude] => 12.3267 [catID] => 11 [cityGeoName] => Venezia [cityGeoHash] => rrWI ) stdClass Object ( [url] => 611711i0g6 [name] => SCOPRI QUALCOSA DI SANA "PIANTA" [start] => 2015-05-02T12:30:00+02:00 [end] => 2015-05-02T21:59:59+02:00 [latitude] => 45.43678127 [longitude] => 12.3253285908 [catID] => 11 [cityGeoName] => Venezia [cityGeoHash] => rrWI ) 
		*/
		foreach($resArr->{'result'}->{'events'} AS $IND=>$EVENT){
		  echo "<br><br>". $EVENT->{'name'};
		  
	    $return_event=array();
	    
	    $return_event["name"]     =$EVENT->{'name'};
	    $return_event["lon"]      =$EVENT->{'latitude'};
	    $return_event["lat"]      =$EVENT->{'longitude'};
	    $return_event["catID"]    =$EVENT->{'catID'};
	    $return_event["url"]      =$EVENT->{'url'};
	    $return_event["url"]      ='http://wheresup.com/#!/it/s/rrWI/venezia/o?pos=la:'.$EVENT->{'latitude'}.',lng:'.$EVENT->{'latitude'}.',zoom:13';
	    $return_event["urlhash"]  =$EVENT->{'url'};
	    $return_event["id"]       =$EVENT->{'url'};//for osm
		  
		  $return_events[]=$return_event;
		  
		  print_r( $return_event);
		}
		 
		return $return_events;
	}
	
	
	function generateKmlFromArray($data){
	  
        	 
            	// Creates the KML/XML Document.
            	$dom = new DOMDocument('1.0', 'UTF-8');
             
            	// Creates the root KML element and appends it to the root document.
            	$node = $dom->createElementNS('http://earth.google.com/kml/2.1', 'kml');
            	$parNode = $dom->appendChild($node);
             
            	// Creates a KML Document element and append it to the KML element.
            	$dnode = $dom->createElement('Document');
            	$docNode = $parNode->appendChild($dnode);
             
 
        			if (count($data) > 0) { // found something
         
        				// Iterates through the results, creating one Placemark for each row.
        				foreach($data AS $IND => $row)
        				{
        					 // Creates a Placemark and append it to the Document.
        					  $node = $dom->createElement('Placemark');
        					  $placeNode = $docNode->appendChild($node);
         
        					  // Creates an id attribute and assign it the value of id column.
        					  if(isset($row['osm_id']))
        					     $placeNode->setAttribute('id', 'placemark' . $row['osm_id']);
        					  if(isset($row['id']))
        					     $placeNode->setAttribute('id', 'placemark' . $row['id']);
         
        					  // Create name, and description elements and assigns them the values of the name and address columns from the results.
        					  $nameNode = $dom->createElement('name',htmlentities($row['name']));
        					  $placeNode->appendChild($nameNode);
         
        					  // Creates a Point element.
        					  $pointNode = $dom->createElement('Point');
        					  $placeNode->appendChild($pointNode);
         
        					  // Creates a coordinates element and gives it the value of the lng and lat columns from the results.
        					  $coorStr = $row['lon'] . ','  . $row['lat'];
        					  $coorNode = $dom->createElement('coordinates', $coorStr);
        					  $pointNode->appendChild($coorNode);
          				}
           
          			} else { // nothing found
          			  echo "<br>KML Gen no data";
          			}
      
                $kmlOutput = $dom->saveXML();
                
                return  $kmlOutput;
        	
	}
	
	 
 	$current_month     = date('m'); 
	$current_day       = date('d'); 
	$current_year      = date('Y');



  $today    =$current_year.$current_month.$current_day;
      	
  $city   ='venice';
  $lat_to = '45.45406486525207';
  $lng_to = '12.39123048216561';
  $lng_from ='12.279736417834556';
  $lat_from = '45.43636076299431';
            
	$EVENTS= grabVeniceEventsFromWheresup($lat_from,$lat_to,$lng_from,$lng_to,$current_year,$current_month,$current_day );
	
	$KML   = generateKmlFromArray($EVENTS);
	
	echo "<br><br>Store data in firebase...";
	
  	$firebase_url='/dashboard/cityevents/'.$city.'/'.$today.'/';
	
	 //$fb->delete($firebase_url);
	 
	 foreach($EVENTS AS $IND => $EVENT){
  	$fb->push($firebase_url.'events_list/', $EVENT); 
	 }
	 
	 	echo "<br><br>Store kml data in firebase...<br>";
	 	echo $KML;
	
	
	$fb->set($firebase_url.'events_kml', $KML); 
	
	//$fb->push('/dashboard/ships/inport', $ship_arrivals);
	
?>
