<?php

  /*
  
   CRON: Every 12 hours
   
  */
  
  error_reporting(E_ERROR);
  ini_set('display_errors', E_ERROR);
 
  require_once './lib/firebaseLib.php'; 
  date_default_timezone_set('UTC');
 
  $url = 'https://venicedata.firebaseio.com/';
  $key = 'gG1wZ2oyUxca6Rro3XYsXaKH9ODG7nrKEUqVujWm';
  $fb = new fireBase($url, $key);
     
    function get_web_page_by_post($url,$post_data){
               
            //traverse array and prepare data for posting (key1=value1)
            $post_items=array();
            foreach ( $post_data as $key => $value) {
                $post_items[] = $key . '=' . $value;
            }
             
            //create the final string to be posted using implode()
            $post_string = implode ('&', $post_items);
             
            //create cURL connection
            $curl_connection =  curl_init($url);
             
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
            //print_r(curl_getinfo($curl_connection));
            //echo curl_errno($curl_connection) . '-' . 
            //curl_error($curl_connection);
             
            //close the connection
            curl_close($curl_connection);
            
            return $result;
    
    }

	function grabVeniceShips_Marinetraffic_VesselCalls  ($port_num,$port_name,$current_year,$current_month,$current_day ) {
            
              	$date_from=$current_year.'-'.$current_month.'-'.$current_day.'T00:00:00.000Z';
              	$date_to  =$current_year.'-'.$current_month.'-'.$current_day.'T23:59:00.000Z';
              	
            
                $fields = array( 
                    'offset' => '0', 
                );
                $diff   =60*60*6;
                $start_d=strtotime("$current_yearr-$current_month-$current_day 00:00")-$diff;
                $stop_d =strtotime("$current_yearr-$current_month-$current_day 23:59")-$diff;
            
              	echo "<br>Load marinetraffic venice ship arrivals events from: $date_from to: $date_to timstamp $start_d to $stop_d ";
            
                   
                $url ="https://www.marinetraffic.com/ais/index/port_moves/all/sort:TIMESTAMP_UTC/direction:asc/port:".$port_num."/portname:".$port_name."/time_interval:".$start_d."_".$stop_d."/per_page:50";
            	echo "<br>Url:".$url ;
                		
                $response = get_web_page_by_post($url,$fields);
                //echo "<pre>"; echo($response); echo "</pre>";		
                
                $dom = new DOMDocument();
                $dom->preserveWhiteSpace = false;
                $dom->substituteEntities = true;
                if(strlen($response)>10)
                 $dom->loadHTML($response);
                
                $PORT_CALLS = array(); 
            			
            		$rows = $dom->getElementsByTagName("tr");
                    for ($i = 2; $i < $rows->length; $i++) {
                        //echo   "<br>ROWz :$i"; 
                        
                        $SHIP_DATA=array();
                        $SHIP_DATA['ship_href']    ="";
                        $SHIP_DATA['ship_name']    ="";
                        $SHIP_DATA['ship_shipid']  =""; 
                        $SHIP_DATA['ship_imo']     =""; 
                        $SHIP_DATA['ship_mmsi']    ="";
                        $SHIP_DATA['ship_vessel']  ="";
                        $SHIP_DATA['ship_porcall_type'] ="";
                        $SHIP_DATA['arrival_scheduled']    ="";
                        $SHIP_DATA['arrival_effective']    ="";
                        $SHIP_DATA['ship_type']      ="";
                        $SHIP_DATA['ship_type_desc'] ="";
                        $SHIP_DATA['pos_lat']      ="";
                        $SHIP_DATA['pos_long']     ="";
                        
                        
                        $cols = $rows->item($i)->getElementsbyTagName("td");
                        for ($j = 0; $j < $cols->length; $j++) {
                            
                            $val  = $cols->item($j)->nodeValue;
                            $cont = $cols->item($j)->textContent;
                             
                            $val = @htmlentities($val, null, 'utf-8');
                            $val = @str_replace("&nbsp;", "", $val);
                            $val = @trim($val);
            
                            //Ship name
                            if($j==0){
                              
                              $ship_name= $val;//Name from html
                              $SHIP_DATA['ship_name'] = $ship_name;
                               
                              $ship_href = @trim(@$cols->item($j)->getElementsByTagName('a')->item(0)->getAttribute('href')); 
                              $SHIP_DATA['ship_href'] = "https://www.marinetraffic.com".$ship_href;
                               
                               //Split parts
                               ///HREF:eis/details/ships/shipid:1040406/imo:0/mmsi:912470806/vessel:ciccio
                              $out=null; 
                              @preg_match('~shipid:(.*?)/imo~', $ship_href, $out);
                              $SHIP_DATA['ship_shipid']=@$out[1];
                              @preg_match('~imo:(.*?)/mmsi~', $ship_href, $out);
                              $SHIP_DATA['ship_imo']=@$out[1];
                              @preg_match('~mmsi:(.*?)/vessel~', $ship_href, $out);
                              $SHIP_DATA['ship_mmsi']=@$out[1];
                              @preg_match('~vessel:(.*$)~', $ship_href, $out); 
                              $SHIP_DATA['ship_vessel']=@$out[1];
                              
                              $ship_img_alt= @trim(@$cols->item($j)->getElementsByTagName('img')->item(0)->getAttribute('title')); 
                              $SHIP_DATA['ship_type_desc']= @trim(@(@explode(":",$ship_img_alt)[1]));
            
                              $ship_img_src= @trim(@$cols->item($j)->getElementsByTagName('img')->item(0)->getAttribute('src')); 
                              $ship_img_src = @basename($ship_img_src, ".png"); 
                              $SHIP_DATA['ship_type']=@substr($ship_img_src,-1);
                               
                            }
                            
                            if($j==3){
                               $SHIP_DATA['ship_porcall_type']= $val; 
                            }                
                           
                           // echo "<br>COL $j VAL:$val## "; 
                     
                        }
                        
                        //Save data 
                        if(is_numeric($SHIP_DATA["ship_mmsi"])){
                          $PORT_CALLS[$SHIP_DATA["ship_mmsi"]]=$SHIP_DATA;
                        }
                        echo "<br>SHIP DATA::<br>"; 
                        print_r($SHIP_DATA); 
                        echo "\n";
                    } 
            		 
            		return $PORT_CALLS;
	}
	

	function grabVeniceShips_Marinetraffic_VesselETA($port_num,$port_name,$current_year,$current_month,$current_day ) {
            	  
            	  
              	$date_from=$current_year.'-'.$current_month.'-'.$current_day.'T00:00:00.000Z';
              	$date_to  =$current_year.'-'.$current_month.'-'.$current_day.'T23:59:00.000Z';
              	
              	echo "<br>Load marinetraffic venice ship ETAs events from: $date_from to: $date_to";
            
                $fields = array( 
                    'offset' => '0', 
                );
            
                $url ="https://www.marinetraffic.com/ais/index/eta/all/port:".$port_num."/portname:".$port_name."/per_page:50/page:1/sort:ARR_TIME/direction:asc";
            	echo "<br>Url:".$url ;
                		
                $response = get_web_page_by_post($url,array());
                //echo "<pre>"; echo($response); echo "</pre>";		
                
                $dom = new DOMDocument();
                $dom->preserveWhiteSpace = false;
                $dom->substituteEntities = true;
                if(strlen($response)>10)
                 $dom->loadHTML($response);
                
                $PORT_ETAS = array(); 
            			
            		$rows = $dom->getElementsByTagName("tr");
                    for ($i = 1; $i < $rows->length; $i++) {
                        //echo   "<br>ROWz :$i"; 
                        
                        $SHIP_DATA=array();
                        $SHIP_DATA['ship_href']    ="";
                        $SHIP_DATA['ship_name']    ="";
                        $SHIP_DATA['ship_shipid']  =""; 
                        $SHIP_DATA['ship_imo']     =""; 
                        $SHIP_DATA['ship_mmsi']    ="";
                        $SHIP_DATA['ship_vessel']  ="";
                        $SHIP_DATA['ship_porcall_type'] =""; 
                        $SHIP_DATA['arrival_scheduled']    ="";
                        $SHIP_DATA['arrival_effective']    ="";
                        $SHIP_DATA['ship_type']      ="";
                        $SHIP_DATA['ship_type_desc'] ="";
                        $SHIP_DATA['pos_lat']      ="";
                        $SHIP_DATA['pos_long']     ="";
                        
                        $cols = $rows->item($i)->getElementsbyTagName("td");
                        for ($j = 0; $j < $cols->length; $j++) {
                            
                            $val  = $cols->item($j)->nodeValue;
                            $cont = $cols->item($j)->textContent;
                             
                            $val = @htmlentities($val, null, 'utf-8');
                            $val = @str_replace("&nbsp;", "", $val);
                            $val = @trim($val);
                            
                            //echo "<br>COL $j VAL:$val## "; 
            
                            //Ship name
                            if(( $i==1 && $j==2) || ($i>1 && $j==1)){
                              
                              $ship_name= $val;//Name from html
                              $SHIP_DATA['ship_name'] = $ship_name;
                               
                              $ship_href = @trim(@$cols->item($j)->getElementsByTagName('a')->item(0)->getAttribute('href')); 
                              $SHIP_DATA['ship_href'] = $ship_href;
                               
                               //Split parts
                               ///HREF:eis/details/ships/shipid:1040406/imo:0/mmsi:912470806/vessel:ciccio
                              $out=null;
                              @preg_match('~shipid:(.*?)/imo~', $ship_href, $out);
                              $SHIP_DATA['ship_shipid']=@$out[1];
                              @preg_match('~imo:(.*?)/mmsi~', $ship_href, $out);
                              $SHIP_DATA['ship_imo']=@$out[1];
                              @preg_match('~mmsi:(.*?)/vessel~', $ship_href, $out);
                              $SHIP_DATA['ship_mmsi']=@$out[1];
                              @preg_match('~vessel:(.*$)~', $ship_href, $out); 
                              $SHIP_DATA['ship_vessel']=@$out[1];
            
                              $ship_img_src= @trim(@$cols->item($j)->getElementsByTagName('img')->item(0)->getAttribute('src')); 
                              $ship_img_src = @basename($ship_img_src, ".png"); 
                              $SHIP_DATA['ship_type']=@substr($ship_img_src,-1);
                              
                              
                            }
                            
                            if(( $i==1 && $j==3) || ($i>1 && $j==2)){//Scheduled arrival
                               $ship_arr_sched= @trim(@$cols->item($j)->getElementsByTagName('span')->item(0)->textContent); 
                               $SHIP_DATA['arrival_scheduled']= $ship_arr_sched;
                            }    
                            if(( $i==1 && $j==5) || ($i>1 && $j==4)){//Effective arrival   
                               $ship_arr_eff= @trim(@$cols->item($j)->getElementsByTagName('span')->item(0)->textContent); 
                               $SHIP_DATA['arrival_effective']= $ship_arr_eff;
                            }
                            if(( $i==1 && $j==6) || ($i>1 && $j==5)){//Current position 
                          
                              $ship_position_href = @trim(@$cols->item($j)->getElementsByTagName('a')->item(0)->getAttribute('href')); 
                              
                              //Split parts    
                              //https://www.marinetraffic.com/eis/home/zoom:15/mmsi:273455500/centerx:45.3449/centery:12.36131
                              $out=null;
                              @preg_match('~centerx:(.*?)/centery~', $ship_position_href, $out);
                              $SHIP_DATA['pos_long']=@$out[1]; 
                              @preg_match('~centery:(.*$)~', $ship_position_href, $out); 
                              $SHIP_DATA['pos_lat']=@$out[1];
             
                            } 
                           
                                
                        }
                        
                        //Save data 
                        if(is_numeric($SHIP_DATA["ship_mmsi"])){
                          $PORT_ETAS[$SHIP_DATA["ship_mmsi"]]=$SHIP_DATA;
                        }
                        echo "<br>SHIP DATA::<br>"; 
                        print_r($SHIP_DATA); 
                        echo "\n";
                    } 
            		 
            		return $PORT_ETAS;
	}	
	
 
	function grabVeniceShips_Marinetraffic_VesselDetails($PORT_CALLS,$PORT_ETA  ){
        	  
        	  foreach($PORT_CALLS AS $SHIP_ID=>$SHIP_DATA){
        	    
        	  echo "<br>GRAB SHIP DATA"; 
        	  $url="https://www.marinetraffic.com".$SHIP_DATA["ship_href"];
              echo "<br>HREF:".$url;
              
              $response = get_web_page_by_post($url,array());
              //echo "<pre>"; echo($response); echo "</pre>";		
              
              $dom = new DOMDocument();
              $dom->preserveWhiteSpace = false;
              $dom->substituteEntities = true;
              $dom->loadHTML($response);
              
              
              die();
              
        	  }
 
	}
	
	echo "<br>************************************************************************";
	echo "<br>*************** IMPORT SHIP ARRIVALS FROM MARINETRAFFIC ***********";
	echo "<br>************************************************************************";
	
	//INput data
	$port              = "530-VENEZIA";  
	$port_num          = "530"; 
	$port_name         = "VENEZIA"; 
	
 	$current_month     = date('m'); 
	$current_day       = date('d'); 
	$current_year      = date('Y');
	
	
    $current_day=str_pad($current_day, 2, '0', STR_PAD_LEFT); 
 
    $today    =$current_year.$current_month.$current_day;
       
   //Grab pages         
	$PORT_CALLS = grabVeniceShips_Marinetraffic_VesselCalls($port_num,$port_name,$current_year,$current_month,$current_day );
	$PORT_ETAS  = grabVeniceShips_Marinetraffic_VesselETA($port_num,$port_name,$current_year,$current_month,$current_day );
	
	//Grab ship data
  //grabVeniceShips_Marinetraffic_VesselDetails($PORT_CALLS,$PORT_ETA );
	
	echo "<br><br><br>ALL PORT CALLS<br>";
	print_r($PORT_CALLS);
	
	echo "<br><br><br>ALL PORT ETAs<br>";
	print_r($PORT_ETAS);
	
	
    //Update ships database
    updateShipsDatabase($fb,$PORT_CALLS);
    updateShipsDatabase($fb,$PORT_ETAS);
    
    function  updateShipsDatabase($fb,$PORT_SHIPS){
            echo "<br><br>Update ships database... START**"; 
            
        	foreach($PORT_SHIPS AS $IMO => $VESSEL){
        	    
        	   //Remove not ship data fields
        	   unset($VESSEL["ship_porcall_type"]);
        	   unset($VESSEL["arrival_scheduled"]);
        	   unset($VESSEL["arrival_effective"]);
        	   unset($VESSEL["arrival_scheduled"]);
        	    
        	    //Remove blank data fields
        	    foreach($VESSEL AS $IND => $VAL){
        	         if(strlen($VAL)<1){
        	          unset ($VESSEL[$IND]);
        	          }
        	    }
        	    
        	    echo "<br>UPDATE VESSEL:$IMO<br>"; 
        	    $fb->update('/dashboard/ships/marinetraffic_vessels/'.$IMO.'/', $VESSEL); 
        	    
        	}
        	
            echo "<br><br>Update ships database..STOP **.";
        
    }	
    
  //Calculate todays arrivals
    
 
  //STore in firebase    
  echo "<br><br>Store data in firebase...";
	
  $firebase_url='/dashboard/ships/marinetraffic_calls/'.$port.'/'.$today.'/'; 
  $fb->update($firebase_url, $PORT_CALLS); 
 
  $firebase_url='/dashboard/ships/marinetraffic_etas/'.$port.'/'.$today.'/';
  $fb->update($firebase_url, $PORT_ETAS);  
	 
 
?>