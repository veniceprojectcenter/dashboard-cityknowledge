<?php

// this functions computes the following data:
// 1 arrival track for each train for today
// 2 computes the most likely track for each train provenience
function scrapeTrainsAllDay(){
    
  	//dummy stuff
  	$prov_tracks = array();
  	
  	// init a placeholder
  	$prov_tracks['FERRARA'] = array();    
    
    for ($i = 5; $i < 24; $i++){
    
      $url = 'https://prm.rfi.it/qo_prm/QO_Arrivi_SiPMR.aspx?Id=2796&dalle='.$i.'.00&alle='.$i.'.59&ora='.$i.'.00&guid=c2e6b978-bb7e-4d17-b8bd-f21b2ed54775';
  
      echo $url;
  		$html_contents = @file_get_contents($url);
  
      $DOM = new DOMDocument;
  		$DOM->loadHTML($html_contents);
  		
  				
  		$xpath = new DOMXpath($DOM);
  		$tags = $xpath->query('//table[@class="QOtab"]');			
  		
  		$track_stats = array();

  		
  		//tabellaarrivi
  	    foreach($tags as $tag)
  	        {
  	            $tr = $tag->getElementsByTagName('tr');
  	            foreach($tr as $data)
  	            {
  	            	$status = '';
  	                $td = $data->getElementsByTagName('td');
  	                $ora = trim($td->item(0)->nodeValue);
  	                $train_id = trim($td->item(1)->nodeValue);
  	                $track = trim(str_replace("*", "", $td->item(3)->nodeValue));
  	                
  	                $provenienza = trim($td->item(2)->nodeValue);
  	                
  	                $pos = strpos($provenienza, "(");

  	                $provenienza = trim(substr ($provenienza , 0 , $pos ));
  	                
  	                if (is_numeric($prov_tracks[$provenienza][$track])){
  	                  $prov_tracks[$provenienza][$track]++;
  	                }
  	                else {
                      $prov_tracks[$provenienza][$track] = 1;

  	                }
  	                
  	                //print_r($prov_tracks);

  	                
                  	$url = 'https://venicedata.firebaseio.com/';
                  	$key = 'gG1wZ2oyUxca6Rro3XYsXaKH9ODG7nrKEUqVujWm';
                  	$fb_writer = new fireBase($url, $key);
                  	
                  	if (is_numeric($train_id) && is_numeric($track)){
                  		// get capacity
                  		$track = intval($track);
                  		echo '/dashboard/venice_trains/tracks/'.$train_id.'/track/'.$track;
                  		
                			$fb_writer->set('/dashboard/venice_trains/data/'.$train_id.'/track',$track);
                			$fb_writer->set('/dashboard/venice_trains/data/'.$train_id.'/provenienza',$provenienza);
                      $fb_writer->set('/dashboard/venice_trains/data/'.$train_id.'/orario',$ora);


                  	}  	                
  	                
  
                    echo 'TRAIN ID '.$train_id;
                    echo 'TRACK : '.$track;
  	            }
  	        }
    }
    
      	 print_r($prov_tracks);
      	 
      	 
      	 // look for maximum
      	 foreach ($prov_tracks as $key => $value){
      	 $max = 0;
      	 $max_index = 0;
      	   
      	   foreach($value as $index => $val){
      	     if ($val > $max){
      	        $max = $val;
      	        $max_index = $index;
      	     }
      	   }
      	   $track_stats[$key] = $max_index;
      	   
      	   
      	 }
      	 
      	 
      	 // save statistically relevant relation between provenienec <---> track number
        print_r($track_stats);
        $url = 'https://venicedata.firebaseio.com/';
        $key = 'gG1wZ2oyUxca6Rro3XYsXaKH9ODG7nrKEUqVujWm';
        $fb_writer = new fireBase($url, $key);
        
        foreach ($track_stats as $index => $key){
          // get capacity
          if (strlen($index)>2){
            
             $index =  trim(str_replace("CENTERALE", "", strtoupper($index)));

            
            //remove all spaces
            $index =  str_replace(" ", "_", $index);
        	  echo '/dashboard/venice_trains/tracks/'.$index.'/track/'.$track."\n";
        	  $fb_writer->set('/dashboard/venice_trains/tracks/'.$index.'/track',$key);
          }
        }
                  	


       	

    }


  function mapNumberToTrack($number){
    
      //  clean up
      $number = substr($number,1);
      $number = substr($number,1);

   		$url = 'https://venicedata.firebaseio.com/';
	  	$fb_reader = new fireBase($url);
    	$track = $fb_reader->get('/dashboard/venice_trains/tracks/'.$number.'/track');
    	echo '**'.$number.'**'."\n";
    	echo '/dashboard/venice_trains/tracks/'.$number.'/track'."\n";
    	echo 'NUMBER TRACK -> '.$track."\n";
  }


  function mapProvenienceToTrack($prov){
    
    $track = 0;
    //  clean up
    $prov =  strtoupper(str_replace(" ", "_", $prov));
    
    // symbol remapping 
      if ($prov == 'TREVISO') $prov = 'TREVISO_CENTRALE';
      if ($prov == 'CASTELFRANCO') $prov = 'CASTELFRANCO_VENETO';
      if ($prov == 'PORTOGRUARO') $prov = 'PORTOGRUARO-CAORLE';
      
      

   	$url = 'https://venicedata.firebaseio.com/';
	  $fb_reader = new fireBase($url);
    $track = $fb_reader->get('/dashboard/venice_trains/tracks/'.$prov.'/track');
    echo '**'.$prov.'**'."\n";
    echo '/dashboard/venice_trains/tracks/'.$prov.'/track'."\n";
    echo 'PROV-> TRACK '.$track."\n";

    return $track;
  }

  require_once './lib/firebaseLib.php';

  $url = 'https://venicedata.firebaseio.com/';
  $key = 'gG1wZ2oyUxca6Rro3XYsXaKH9ODG7nrKEUqVujWm';
  $fb = new fireBase($url, $key);

  $string = file_get_contents("data/venice_train_data.json");
  $json_a = json_decode($string, true);
  
  $newform = array();
  
  $total_passengers = 0;
  $occupation = 0;


  date_default_timezone_set('Europe/Rome');
  $date = date('m/d/Y h:i:s a', time());
  $day_number = date('N', $date);
  $hour_now = date('H', time());
  $minute_now = date('i', time());
  
  echo date('H', $date)."\n";
  echo "H ".$hour_now."\n";
  echo "M ".$minute_now."\n";;
  
  print_r($day_number);
  
  scrapeTrainsAllDay();
//  return;

  //return;
  foreach ($json_a as $key => $value){
    //print_r($value);
    $ora = $value['ora'];
    $min = $value['min'];
    
    
    
    
    //if (strlen($ora) == 1) $ora = "0".$ora;
    if (strlen($min) == 1) $min = "0".$min;
    
    $newform[$ora.$min] = array();
    

    $dday = $day_number - 1;
    $occupation = $value['dow_'.$dday];
 
    $occ =  ($value['capienza'] / 100) * $occupation;
    //$occ = 1;
    
    $total_passengers = $total_passengers + $occ; // + ($value['capienza'] / 100 * $occupation);
    $total_capacity = $total_capacity + $value['capienza'];
    $newform[$ora.$min]['arrived_so_far'] = intval($total_passengers);
    $newform[$ora.$min]['train'] = $value;
    $newform[$ora.$min]['train']['occupation'] = intval($occ);
   
    //$track=mapProvenienceToTrack($value['provenienza']);
    $track=mapNumberToTrack(($value['numero']));
    // if we could not find the track, let's use some heuristics...
    if ($track == null) {
      $track = mapProvenienceToTrack($value['provenienza']);
    }
    
    $newform[$ora.$min]['track'] = $track;
    
    echo 'GOT TRACK! '+$track + "\n";


    
		$dburl='/dashboard/venice_trains/trains/'.$ora.$min.'/';
		echo "Save train arrival estimation in $dburl\n";
		$fb->update($dburl, $newform[$ora.$min]); 
    

  }
  


?>