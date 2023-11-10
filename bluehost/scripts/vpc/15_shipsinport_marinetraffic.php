<?php

  /*
   CRON: Hourly
   
  */

    error_reporting(E_ERROR);
    ini_set('display_errors', E_ERROR);
	ini_set('max_execution_time', 600); //300 seconds = 5 minutes
	set_time_limit(600);
 
 
    require_once './lib/firebaseLib.php'; 
    date_default_timezone_set('UTC');
 
    echo "<br>Venicedata setup";
    $url = 'https://venicedata.firebaseio.com/';
    $key = 'gG1wZ2oyUxca6Rro3XYsXaKH9ODG7nrKEUqVujWm';
    $fb = new fireBase($url, $key);
    
    echo "<br>Venicedashboard setup";
    $url    = 'https://dashboard-main.firebaseio.com';
    $key    = '7XfSQShJ8tu1N7rY73HhJNJEUL116NtHDT2ujCLs';
    $fbdash = new fireBase($url, $key);
     
    //Get widget instances 
   	$DB_WIDGETS_JSON    = $fbdash->get('/dashboards/'); 
	$WIDGETS_IN_USE     = json_decode($DB_WIDGETS_JSON,true);
      
    
     
     //For each widget config instances port
     $PROCESSED_PORTS=array();
     foreach($WIDGETS_IN_USE AS $ID=>$WIDGET_CONFIG){     
         foreach($WIDGET_CONFIG["widgetsInUse"] AS $ID1=>$WIDGET_CONFIG2){ 
             
             
             
            //Check widget name
            if(strcmp($WIDGET_CONFIG2["id"],"vessels_inport")){
                continue;
            }
            
            echo "<br>Widget in use:".$WIDGET_CONFIG2["id"]."#<br>";
            echo "<br>Longitude:".$WIDGET_CONFIG2["settings"]["marinetraffic_long"]["value"]."#<br>";
            
            print_r($WIDGET_CONFIG2);
            
          
        	//INput data
        	$port              = $WIDGET_CONFIG2["settings"]["marinetraffic_port"]["value"];
            $pa_lat            = $WIDGET_CONFIG2["settings"]["marinetraffic_lat"]["value"]; 
            $pa_lon            = $WIDGET_CONFIG2["settings"]["marinetraffic_long"]["value"];
            
            $port_arr =explode("-",$port);
            $port_code=$port_arr[0];
            $port_name=$port_arr[1];
            
            //Do not reprocess port
            if($PROCESSED_PORTS[$port]==true){
                echo "<br><br><br><br>!!!!!!!!!!!!Do not reprocess port:$port <br><br><br>";
                continue;
            }else{
                $PROCESSED_PORTS[$port]=true;
                echo "<br><br><br><br>Start port processing:$port Lat/Long: $pa_lat/$pa_lon<br><br><br>";
            }
             
         	$current_month     = date('m'); 
        	$current_day       = date('d'); 
        	$current_year      = date('Y');
        	$current_hour      = date('H');//utc
        	
            $current_day=str_pad($current_day, 2, '0', STR_PAD_LEFT); 
         
            $today    =$current_year.$current_month.$current_day.$current_hour;
            
        	echo "<br>************************************************************************";
        	echo "<br>*************** IMPORT SHIPS IN PORT FROM MARINETRAFFIC ***********";
        	echo "<br>***************                 $today       ***********";
        	echo "<br>************************************************************************";    
               
           //Grab pages     
           $page_num=1;
           //$PORT_SHIPS=grabVeniceShips_Marinetraffic_ShipsInPort("530","VENEZIA",$page_num); //Only port
           
           $PORT_SHIPS=array();
           for($page_num=1 ; $page_num<3;$page_num++){
            $PORT_SHIPS_TEMP=grabVeniceShips_Marinetraffic_ShipsInPort($port_code,$port_name,$page_num,$pa_lat,$pa_lon);
              foreach($PORT_SHIPS_TEMP AS $IMO => $VESSEL){
                  echo "<br>Add vessel:".$VESSEL["ship_name"];
                     $PORT_SHIPS[$IMO]=$VESSEL;
              }
           }
         
        	   
        	echo "<br><br><br>PORT DATA:<br>";
        	print_r($PORT_SHIPS);
        	
        	echo "<br><br>"; 
        	echo "<br><br>Store data in firebase...<br><br>";
            $firebase_url='/dashboard/ships/marinetraffic_inport/'.$port.'/'.$today.'/';
            $fb->set($firebase_url, $PORT_SHIPS);  
            
        
            //Update ships database
            updateShipsDatabase($fb,$PORT_SHIPS);
            

          
            //**Compute SUMS
            echo "<br><br>Compute sums...<br><br>";
            $PORT_SHIPS_VALUES=array();
            $PORT_SHIPS_VALUES["total_ships"]=0;
            foreach($PORT_SHIPS AS $IMO => $VESSEL){
                  $PORT_SHIPS_VALUES["total_ships"]++;
            }
            
            $firebase_url='/dashboard/ships/marinetraffic_inport/'.$port.'/'.$today.'/0000_values';
            $fb->set($firebase_url, $PORT_SHIPS_VALUES);  
            
      }//For widget in use
    }//For dash
 
	echo "<br><br>"; 
	echo "<br><br>********************************* PROCEDURE FINISHED *************************************";
	echo "<br><br>"; 

     function  updateShipsDatabase($fb,$PORT_SHIPS){
            echo "<br><br>Update ships database... START**"; 
            
        	foreach($PORT_SHIPS AS $IMO => $VESSEL){
        	    
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
    
    
 

	function grabVeniceShips_Marinetraffic_ShipsInPort($port_id ,$port_name ,$page_num,$pa_lat=0,$pa_long=0) {
            	  
            	  
            	  
              	$date_from=$current_year.'-'.$current_month.'-'.$current_day.'T00:00:00.000Z';
              	$date_to  =$current_year.'-'.$current_month.'-'.$current_day.'T23:59:00.000Z';
              	
              	echo "<br>Load marinetraffic ships in port  $port ";
            
                $fields = array( 
                    'offset' => '0', 
                );
                
                $COL_START_INDEX_OFFSET=0;
                $url ="http://www.marinetraffic.com/ais/index/ships/range/port_id:".$port_id."/port_name:".$port_name."/per_page:50/page:".$page_num."/sort:SHIPNAME/direction:asc"; 
                if($pa_lat>0 && $pa_long>0 || $pa_lat<0 || $pa_long){//IN RANGE
                    $url="http://www.marinetraffic.com/ais/index/ships/nearme/nearlon:".$pa_long."/nearlat:".$pa_lat."/per_page:50/page:".$page_num."sort:DISTANCE/direction:asc";
                    $COL_START_INDEX_OFFSET=2;
                } 
                
            	echo "<br>Url:".$url ;
                		
                $response = get_web_page_by_post($url,array());
                //echo "RESP:<pre>"; echo($response); echo "</pre>";		
                
                $dom = new DOMDocument();
                $dom->preserveWhiteSpace = false;
                $dom->substituteEntities = true;
                if(strlen($response)>10)
                 $dom->loadHTML($response);
                
                $SHIPS_INPORT = array(); 
            			
            		$rows = $dom->getElementsByTagName("tr");
            		echo "<br>Records:".$rows->length;
                    for ($i = 1; $i < $rows->length; $i++) {
                        echo   "<br>ROWz :$i"; 
                        
                        $SHIP_DATA=array();
                        $SHIP_DATA['ship_href']    ="";
                        $SHIP_DATA['ship_flag']    ="";
                        $SHIP_DATA['ship_shipid']  =""; 
                        $SHIP_DATA['ship_imo']     =""; 
                        $SHIP_DATA['ship_mmsi']    ="";
                        $SHIP_DATA['ship_vessel']  ="";
                        $SHIP_DATA['ship_destination']        =""; 
                        $SHIP_DATA['ship_destination_eta']    =""; 
                        $SHIP_DATA['ship_type']      ="";
                        $SHIP_DATA['ship_type_desc'] ="";
                        $SHIP_DATA['ship_length']    ="";
                        $SHIP_DATA['ship_breadth']   ="";
                        $SHIP_DATA['pos_lat']        ="";
                        $SHIP_DATA['pos_long']       ="";
                        $SHIP_DATA['ship_img']       ="";
                        
                        $SHIP_DATA['last_ais_data']  = date('Y-m-d H:i:s');
                        
                        $cols = $rows->item($i)->getElementsbyTagName("td");
                        for ($j = 0; $j <  $cols->length  ; $j++) {
                            
                            $val  = $cols->item($j)->nodeValue;
                            $cont = $cols->item($j)->textContent;
                             
                            $val = @htmlentities($val, null, 'utf-8');
                            $val = @str_replace("&nbsp;", "", $val);
                            $val = @trim($val);
                            
                            echo "<br>COL $j VAL:$val## "; 
                            
                            if($val=="No data for specified filters"){
                                ///Xit all records
                                break;
                            }
             
                            if((   $j== ($COL_START_INDEX_OFFSET+0))  ){//Flag 
                            echo "<br>Flag".$j."<br>";
                              $ship_img_alt= @trim(@$cols->item($j)->getElementsByTagName('img')->item(0)->getAttribute('title')); 
                              $SHIP_DATA['ship_flag']= @trim($ship_img_alt);                              
                            }   
                            
                            //Ship name
                            if((  $j==($COL_START_INDEX_OFFSET+1))  ){
                              echo "<br>Ship Name".$j."<br>";
                              $ship_name= $val;//Name from html
                              $SHIP_DATA['ship_name'] = $ship_name;
                               
                              $ship_href = @trim(@$cols->item($j)->getElementsByTagName('a')->item(0)->getAttribute('href')); 
                              //echo "<br>HREF:$ship_href";
                              $SHIP_DATA['ship_href'] ="http://www.marinetraffic.com". $ship_href;
                               
                               //Split parts
                               ///HREF:en/ais/details/ships/shipid:1040406/imo:0/mmsi:912470806/vessel:ciccio
                               
                              $out=null;
                              @preg_match('~shipid:(.*?)/imo~', $ship_href, $out);
                              $SHIP_DATA['ship_shipid']=@$out[1];
                              @preg_match('~imo:(.*?)/mmsi~', $ship_href, $out);
                              $SHIP_DATA['ship_imo']=@$out[1];
                              @preg_match('~mmsi:(.*?)/vessel~', $ship_href, $out);
                              $SHIP_DATA['ship_mmsi']=@$out[1];
                              @preg_match('~vessel:(.*$)~', $ship_href, $out); 
                              $SHIP_DATA['ship_vessel']=@$out[1];
            
                            }
                            
                            if(  $j==($COL_START_INDEX_OFFSET+2) ){//Photo
                            echo "<br>Photo".$j."<br>";
                                $IMG= $cols->item($j)->getElementsByTagName('img');
                                if($IMG->length>0){
                                      $ship_img_src= @trim($IMG->item(0)->getAttribute('src')); 
                                      // echo "<br>IMAGE1:$ship_img_src";
                                      $SHIP_DATA['ship_img']=$ship_img_src;
                                  }
                            }
                            
                            if((   $j==($COL_START_INDEX_OFFSET+3))  ){//Type
                            echo "<br>Type".$j."<br>";
                              $ship_img_src= @trim(@$cols->item($j)->getElementsByTagName('img')->item(0)->getAttribute('src')); 
                             // echo "<br>IMAGE2:$ship_img_src";
                              $ship_img_src = @basename($ship_img_src, ".png"); 
                              $SHIP_DATA['ship_type']=@substr($ship_img_src,-1);
                              
                              $ship_img_alt= @trim(@$cols->item($j)->getElementsByTagName('img')->item(0)->getAttribute('title')); 
                              $SHIP_DATA['ship_type_desc']= @trim($ship_img_alt);                              
                            }    
                            if((  $j==($COL_START_INDEX_OFFSET+5)) ){//Dimensions   
                            echo "<br>Dimensions".$j."<br>";
                               $dimens=@explode("x",$val);
                               $SHIP_DATA['ship_length'] =  $dimens[0];
                               $SHIP_DATA['ship_breadth']=  $dimens[1];
                            }
                            
                            if((  $j==($COL_START_INDEX_OFFSET+8)) ){//Lat long   
                            echo "<br>LatLong".$j."<br>";
                              $ship_position_href = @trim(@$cols->item($j)->getElementsByTagName('a')->item(0)->getAttribute('href')); 
                              //echo "<br>HREF:$ship_position_href";
                              $out=null;
                              @preg_match('~centerx:(.*?)/centery~', $ship_position_href, $out);
                              $SHIP_DATA['pos_long']=@$out[1]; 
                              @preg_match('~centery:(.*$)~', $ship_position_href, $out); 
                              $SHIP_DATA['pos_lat']=@$out[1];                              
                            
                            }
                            
                            if((  $j==($COL_START_INDEX_OFFSET+9))  ){//Destination 
                                echo "<br>Destination".$j."<br>";
                                $dest=@explode("(ETA: ",$val);
                                
                                $SHIP_DATA['ship_destination']        =$dest[0]; 
                                $SHIP_DATA['ship_destination_eta']    =substr($dest[1] ,0, -1);
             
                            } 
                           
                                
                        }
                        
                        //Save data 
                        if(is_numeric($SHIP_DATA["ship_mmsi"])){
                          $SHIPS_INPORT[$SHIP_DATA["ship_mmsi"]]=$SHIP_DATA;
                        }
                        echo "<br>SHIP DATA::<br>"; 
                        print_r($SHIP_DATA); 
                        echo "\n";
                    } 
            		 
            		return $SHIPS_INPORT;
	}	
		 
	
    


?>