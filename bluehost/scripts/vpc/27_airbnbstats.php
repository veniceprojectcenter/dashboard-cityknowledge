<?php
        
          /*
           CRON: 
              Daily 
           
           Notes:
           http://insideairbnb.com/venice/
         
           
          */
            
            $debug=true;
            
        
            error_reporting(E_ERROR);
            ini_set('display_errors', E_ERROR);
         
            require_once './lib/firebaseLib.php'; 
            date_default_timezone_set('UTC');
            set_time_limit(999999999999999);
         
         
            $url = 'https://venicedata.firebaseio.com/';
            $key = 'gG1wZ2oyUxca6Rro3XYsXaKH9ODG7nrKEUqVujWm';
            $fb = new fireBase($url, $key);
                 
               
        	//INput data 
        	$datetime = new DateTime();
         	$current_month     = $datetime->format('m'); 
        	$current_day       = $datetime->format('d');  
        	$current_year      = $datetime->format('Y'); 
        	$current_hour      = $datetime->format('H');
        	 
        	
        	$current_date_fb   = $datetime->format('d/m/Y H:00');  //DD/MM/YYYY HH:MM
        	 
        	$datetime->modify('+1 day');
         	$tomorrow_month     = $datetime->format('m'); 
        	$tomorrow_day       = $datetime->format('d');  
        	$tomorrow_year      = $datetime->format('Y'); 
        	$tomorrow_hour      = $datetime->format('H'); 	
          
        	
         
            $today      =$current_year.$current_month.$current_day.$current_hour;
            $today_short=$current_year.$current_month.$current_day;
            
        	echo "<br>************************************************************************";
        	echo "<br>*************** GRAB AIRBNB  STATS  ***********";
        	echo "<br>***************      $current_date_fb       ***********";
        	echo "<br>************************************************************************"; 
        	
        	
        	$CITY_STATS=array();
        	
        	$UPDATE_ALL_DAYS_DIFF=90; //Every 3 months
        	
         
        	echo "<br><b>GRAB AIRBNB</b></br>";
        	
        	$location="Venezia%2C+VE";
        	$checkin =$current_day."-".$current_month."-".$current_year;
        	$checkout=$tomorrow_day."-".$tomorrow_month."-".$tomorrow_year;
        	$guests  ="";
        	
        	$s_tag ="1hJKB75U";
        	$ss_id ="zxt7wvv1";
        	
        
            echo "<br><br> Read airbnb rooms from firebase <br>\n"; 
        	$DB_ROOMS_F       = $fb->get('/dashboard/airbnb/'.$location.'/rooms/');
        	$DB_ROOMS_FB      = json_decode($DB_ROOMS_F,true);	
        	//print_r($DB_ROOMS_FB);
         
          	/* 
        	  MULTI LISTING UPDATES 
        	 
        	*/ 
        	$total_limit=0;//How many updates for old data... find owner id... (no more neccessary)
        	if(true){ 
            	$MULTI_LISTING_STATS=array();
            	$PERC_STATS=array();
            	echo "<br>Total rooms in db:".count($DB_ROOMS_FB);
            	$total_multilisting_records_limit=11; //Hom many user records in db per folder
            	
            	$total=0; $counter=0;//Counters
            	 
            	foreach($DB_ROOMS_FB AS $ROOK_KEY=>$ROOM_VAL){ $total++;
            	      
            	     $OWNER        =urlencode($DB_ROOMS_FB[$ROOK_KEY]["room_owner_id"]);
            	     
            	     echo "\n\n<br><br>$counter) Checking room $ROOK_KEY with owner $OWNER";
            	     if($OWNER=="-3"){
            	          echo "\n\n<br><br>          Skipping record...";
            	          continue;
            	     }
            	     $OWNER_NAME   =urlencode($DB_ROOMS_FB[$ROOK_KEY]["room_owner"]);
            	     $OWNER_HOST_ID=urlencode($DB_ROOMS_FB[$ROOK_KEY]["host_id"]);
            	     $PUB_ADDRESS=urlencode($DB_ROOMS_FB[$ROOK_KEY]["public_address"]); ;
            	     $is_mestre=false;  $is_venice=false;  $is_islands=false;
            	     $room_area=updateRoomAreaFromPubAddress($PUB_ADDRESS,$is_venice,$is_mestre,$is_venice);
            	     //print_r($ROOM_VAL);
            	     $MULTI_LISTING_STATS[$OWNER]["room_area"]= $room_area;
            	     $MULTI_LISTING_STATS[$OWNER]["room_owner_id"]=$OWNER;
            	     $MULTI_LISTING_STATS[$OWNER]["room_owner"]=urldecode($OWNER_NAME);
            	     $MULTI_LISTING_STATS[$OWNER]["host_id"].=$OWNER_HOST_ID.",";
            	    
            	     if(!isset($MULTI_LISTING_STATS[$OWNER])){
            	        $MULTI_LISTING_STATS[$OWNER]["rooms_num"]=0;
            	    }
            	    if($DB_ROOMS_FB[$ROOK_KEY]["beds"]<1){
            	        $DB_ROOMS_FB[$ROOK_KEY]["beds"]=1;
            	    }
            	     $MULTI_LISTING_STATS[$OWNER]["total_beds"]+=$DB_ROOMS_FB[$ROOK_KEY]["beds"];
            	    
            	     $MULTI_LISTING_STATS[$OWNER]["rooms_num"]++;//List property counter
            	     
            	     //echo "\n<br>           ROOMS_NUM:". $MULTI_LISTING_STATS[$OWNER]["rooms_num"];
            	      
                     //Some updates on current db records if there is no owner
                     if(!is_numeric($OWNER) || $OWNER=="-1"|| $OWNER=="-2"){
                     
                    	  if($total<$total_limit){//Daily limit
                    	      $total++;
                    	      
            	             //Owner ID  
            	             $url="https://www.airbnb.com/rooms/".$ROOM_VAL["host_id"]."?checkin=06-10-2016&checkout=07-10-2016&locale=en";
                	         $airbnb_room_html=getByCurl($url,false);
                             preg_match('/'.preg_quote('profile_path').'(.*?)'.preg_quote('profile_pic_path').'/is', $airbnb_room_html, $match);
                             $ROOM_VAL["room_owner_id"] = getFirstNumberInString(@$match[1]);
                             
                             if(!is_numeric($ROOM_VAL["room_owner_id"]) ){
                         	 	 $ROOM_VAL["room_owner_id"]="-3";
                         	 	 echo "<br>Room canceled from airbnb." ;
                             }else{
                                  echo "<br>New owner id:".$ROOM_VAL["room_owner_id"];
                             }    
                                  
                     	 	 $UPDATE_ROOM=array();
                             $UPDATE_ROOM[$ROOK_KEY]= $ROOM_VAL;
                             echo "<br>Update room in db...";
                             updateRoomsDatabase($fb,$location,$UPDATE_ROOM);
                    	  }
                     }
                     
                      
            	}
            	
            	
              	//Remove -3 records
            	unset($MULTI_LISTING_STATS["-3"]);
     
                //Reorder records
            	echo "\n\n<br><br> REORDER STATS:<br>"; 
            	$rooms_num =array();
                foreach ($MULTI_LISTING_STATS as $key => $row) { 
                    $rooms_num[$key] = $row['total_beds'];
                } 
                array_multisort($rooms_num, SORT_DESC,   $MULTI_LISTING_STATS);
    
                //Calc percentual stats
            	$counter=0;
                
                $PERC_STATS["roomsnum_1to1"]=0;
                $PERC_STATS["roomsnum_2to2"]=0;
                $PERC_STATS["roomsnum_3to5"]=0;
                $PERC_STATS["roomsnum_6to10"]=0;
                $PERC_STATS["roomsnum_11to1000"]=0;
                
                 $PERC_STATS["roomsnum_mestre"] =0;
                 $PERC_STATS["roomsnum_venice"] =0;
                 $PERC_STATS["roomsnum_islands"]=0;
                 
                 $PERC_STATS["roomsnum_mestre_morethan_2"]=0;
                 $PERC_STATS["roomsnum_venice_morethan_2"]=0;
                 $PERC_STATS["roomsnum_islands_morethan_2"]=0;
                 
                 $PERC_STATS["roomsnum_mestre_equal_2"]=0;
                 $PERC_STATS["roomsnum_venice_equal_2"]=0;
                 $PERC_STATS["roomsnum_islands_equal_2"]=0;
                 
                 $TOP_10_VE=array();
                 $TOP_10_ISOLE=array();
                 $TOP_10_MESTRE=array();
                 
                 $TOP_10_VE_USERS=array();
                 $TOP_10_ISOLE_USERS=array();
                 $TOP_10_MESTRE_USERS=array();                 
                
              	foreach($MULTI_LISTING_STATS AS $ROOM_OWNER=>$OWNER_STATS){//Print results
              	     $counter++;
              	     
              	     echo "<br>Checking multilisting... $counter/".count($MULTI_LISTING_STATS);
              	     
              	     //Richiesta di cambio calcolo di fabio
              	     $OWNER_STATS["rooms_num_saved"]=$OWNER_STATS["rooms_num"]; 
              	     $OWNER_STATS["rooms_num"]=$OWNER_STATS["total_beds"]; 
              	     
              	      
              	     if($OWNER_STATS["room_area"]=="venice"){
              	         
              	          //TOP 10
              	          if(count($TOP_10_VE)<11){//VENICE TOP
                  	         if(!isset($TOP_10_VE[$OWNER_STATS["rooms_num"]])){ $TOP_10_VE[$OWNER_STATS["rooms_num"]]=0; }
                  	         $TOP_10_VE[$OWNER_STATS["rooms_num"]]++;
                  	         
                  	         if(count($TOP_10_VE)==1)
                  	          $PERC_STATS["top10_ve_max"]=$OWNER_STATS["rooms_num"];
                  	         
                  	         
                  	          if(count($TOP_10_VE_USERS)<11)
                  	            $TOP_10_VE_USERS[getIndexString(count($TOP_10_VE_USERS))] =$OWNER_STATS;
              	          }
              	          if($OWNER_STATS["rooms_num"]==2)
                  	          $PERC_STATS["roomsnum_venice_equal_2"]++;
                  	 
                  	     $PERC_STATS["roomsnum_venice"]+=$OWNER_STATS["rooms_num"];         
              	         
              	         if($OWNER_STATS["rooms_num"]>2)
              	          $PERC_STATS["roomsnum_venice_morethan_2"]+=$OWNER_STATS["rooms_num"];
              	          
              	         if(false){
                  	         if($OWNER_STATS["rooms_num"]>2)
                  	          $PERC_STATS["roomsnum_venice_morethan_2"]++;
              	         }

              	     }
              	     else  if($OWNER_STATS["room_area"]=="islands"){//ISLANDS TOP
              	         
              	          //TOP 10
              	          if(count($TOP_10_ISOLE)<11){
                  	         if(!isset($TOP_10_ISOLE[$OWNER_STATS["rooms_num"]])){ $TOP_10_ISOLE[$OWNER_STATS["rooms_num"]]=0; }
                  	         $TOP_10_ISOLE[$OWNER_STATS["rooms_num"]]++;
                  	         
                  	        if(count($TOP_10_ISOLE)==1)
                  	          $PERC_STATS["top10_isole_max"]=$OWNER_STATS["rooms_num"];
                  	         
                  	         if(count($TOP_10_ISOLE_USERS)<11)
                  	         $TOP_10_ISOLE_USERS[getIndexString(count($TOP_10_ISOLE_USERS))] =$OWNER_STATS;
              	          }
              	           
                  	     $PERC_STATS["roomsnum_islands"]+=$OWNER_STATS["rooms_num"];         
              	         
              	         if($OWNER_STATS["rooms_num"]>2)
              	          $PERC_STATS["roomsnum_islands_morethan_2"]+=$OWNER_STATS["rooms_num"];
              	          
              	         if(false){
                  	         if($OWNER_STATS["rooms_num"]>2)
                  	          $PERC_STATS["roomsnum_islands_morethan_2"]++;
              	         }

              	     }else{
              	         
              	          //TOP 10
              	          if(count($TOP_10_MESTRE)<11){
                  	         if(!isset($TOP_10_MESTRE[$OWNER_STATS["total_beds"]])){ $TOP_10_MESTRE[$OWNER_STATS["total_beds"]]=0; }
                  	         $TOP_10_MESTRE[$OWNER_STATS["total_beds"]]++;
                  	         
                  	        if(count($TOP_10_MESTRE)==1)
                  	          $PERC_STATS["top10_mestre_max"]=$OWNER_STATS["total_beds"];
                  	         
                  	          if(count($TOP_10_MESTRE_USERS)<11)
                  	        $TOP_10_MESTRE_USERS[getIndexString(count($TOP_10_MESTRE_USERS))] =$OWNER_STATS;
              	     
              	          }
              	          
                          	 
                  	     $PERC_STATS["roomsnum_mestre"]+=$OWNER_STATS["total_beds"];         
              	         
              	         if($OWNER_STATS["total_beds"]>2)
              	          $PERC_STATS["roomsnum_mestre_morethan_2"]+=$OWNER_STATS["total_beds"];
              	          
              	         if(false){
                  	         if($OWNER_STATS["rooms_num"]>2)
                  	          $PERC_STATS["roomsnum_mestre_morethan_2"]++;
              	         }

              	     }
              	     
              	     
              	     if($OWNER_STATS["rooms_num"]==1){
              	         $PERC_STATS["roomsnum_1to1"]++;
              	        if($PERC_STATS["roomsnum_1to1"]<$total_multilisting_records_limit){
            	         //updateMultilistingStats($fb,$location,$today_short,$ROOM_OWNER,$OWNER_STATS,"roomsnum_1to1");
            	        }          	         
              	     }
            	     if($OWNER_STATS["rooms_num"]==2){
              	         $PERC_STATS["roomsnum_2to2"]++;
              	        if($PERC_STATS["roomsnum_2to2"]<$total_multilisting_records_limit){
            	         //updateMultilistingStats($fb,$location,$today_short,$ROOM_OWNER,$OWNER_STATS,"roomsnum_2to2");
            	        }          	         
              	     }
            	     if($OWNER_STATS["rooms_num"]>2 && $OWNER_STATS["rooms_num"]<6){
              	         $PERC_STATS["roomsnum_3to5"]++;
              	        if($PERC_STATS["roomsnum_3to5"]<$total_multilisting_records_limit){
            	         //updateMultilistingStats($fb,$location,$today_short,$ROOM_OWNER,$OWNER_STATS,"roomsnum_3to5");
            	        }          	         
              	     }
            	     if($OWNER_STATS["rooms_num"]>5 && $OWNER_STATS["rooms_num"]<11){
              	         $PERC_STATS["roomsnum_6to10"]++;
              	        if($PERC_STATS["roomsnum_6to10"]<$total_multilisting_records_limit){
            	         //updateMultilistingStats($fb,$location,$today_short,$ROOM_OWNER,$OWNER_STATS,"roomsnum_6to10");
            	        }          	         
              	     } 
            	     if($OWNER_STATS["rooms_num"]>10){
              	         $PERC_STATS["roomsnum_11to1000"]++;
               	        if($PERC_STATS["roomsnum_11to1000"]<$total_multilisting_records_limit){
            	         //updateMultilistingStats($fb,$location,$today_short,$ROOM_OWNER,$OWNER_STATS,"roomsnum_11to1000");
            	        }
              	     }           	     
              	  
              	     //updateMultilistingUser($fb,$location,$today_short,$ROOM_OWNER,$OWNER_STATS);
              	     
              	     $OWNER_STATS["rooms_num"]=$OWNER_STATS["rooms_num_saved"];
              	     
                     echo "\n\n<br><br>  $counter) OWNER:$ROOM_OWNER STATS:<br>";
            	     print_r($OWNER_STATS);
            	}//FOR Multilist owner recs 
            	
            	echo "\n\n<br><br>  UPDATE VENICE TOP 10:<br>"; 
            	print_r($TOP_10_VE_USERS);
            	updateMultilistingStats($fb,$location,$today_short,"",$TOP_10_VE_USERS,"top10_ve");
            	echo "\n\n<br><br>  UPDATE ISOLE TOP 10:<br>";
            	print_r($TOP_10_ISOLE_USERS);
            	updateMultilistingStats($fb,$location,$today_short,"",$TOP_10_ISOLE_USERS,"top10_isole");
            	echo "\n\n<br><br>  UPDATE MESTRE TOP 10:<br>";
            	print_r($TOP_10_MESTRE_USERS);
            	updateMultilistingStats($fb,$location,$today_short,"",$TOP_10_MESTRE_USERS,"top10_mestre");
            	 
            	//GET AVERAGES OF TOP 10
            	//VENEZIA
            	$top10_roomsperowner_avg=0; 
            	foreach($TOP_10_VE AS $K=>$V){
            	    $top10_roomsperowner_avg+=$K;
            	}
            	$PERC_STATS["top10_roomsperowner_avg_venice"]=$top10_roomsperowner_avg/count($TOP_10_VE);
            	if($PERC_STATS["top10_roomsperowner_avg_venice"]<2)$PERC_STATS["top10_roomsperowner_avg_venice"]=0;
            	
                //ISOLE
            	$top10_roomsperowner_avg=0; 
            	foreach($TOP_10_ISOLE AS $K=>$V){
            	    $top10_roomsperowner_avg+=$K;
            	}
            	$PERC_STATS["top10_roomsperowner_avg_islands"]=$top10_roomsperowner_avg/count($TOP_10_ISOLE);
            	if($PERC_STATS["top10_roomsperowner_avg_islands"]<2)$PERC_STATS["top10_roomsperowner_avg_islands"]=0;
            	
                //MESTRE
            	$top10_roomsperowner_avg=0; 
            	foreach($TOP_10_MESTRE AS $K=>$V){
            	    $top10_roomsperowner_avg+=$K;
            	}
            	$PERC_STATS["top10_roomsperowner_avg_mestre"]=$top10_roomsperowner_avg/count($TOP_10_MESTRE); 
            	if($PERC_STATS["top10_roomsperowner_avg_mestre"]<2)$PERC_STATS["top10_roomsperowner_avg_mestre"]=0;
             
            	
            	$PERC_STATS["top10_roomsperowner"]=$TOP_10; 
            	$PERC_STATS["total_rooms"]=$counter;
            	$PERC_STATS["total_owners"]=count($MULTI_LISTING_STATS);
            	
            	$PERC_STATS["roomsnum_1to1_perc"]=($PERC_STATS["roomsnum_1to1"]*100)/$counter;
            	$PERC_STATS["roomsnum_2to2_perc"]=($PERC_STATS["roomsnum_2to2"]*100)/$counter;
            	$PERC_STATS["roomsnum_3to5_perc"]=($PERC_STATS["roomsnum_3to5"]*100)/$counter;
            	$PERC_STATS["roomsnum_6to10_perc"]=($PERC_STATS["roomsnum_6to10"]*100)/$counter;
            	$PERC_STATS["roomsnum_11to1000_perc"]=($PERC_STATS["roomsnum_11to1000"]*100)/$counter;
            	
            	//Update overall stats
            	updateMultilistingPercentualStats( $fb,$location,$today_short ,$PERC_STATS);
            	
        	}//DO MULTILISTING STATS	
        	 
          
          
    
	echo "\n  "; 
	echo "\n<br> ********************************* PROCEDURE FINISHED *************************************";
	echo "\n "; 
 
 
    /*
    
    
    
     HELPER FUNCTIONS
    
    
    */
    
    function updateRoomAreaFromPubAddress($PUB_ADDRESS,&$is_venice,&$is_mestre,&$is_venice){
                     //VENICE
            	     if( strContains($PUB_ADDRESS,'Cannaregio') ||  strContains($PUB_ADDRESS,'Castello') || 
            	         strContains($PUB_ADDRESS,'San+Polo') ||  strContains($PUB_ADDRESS,'Santa+Croce') || 
            	         strContains($PUB_ADDRESS,'San+Marco') ||  strContains($PUB_ADDRESS,'Dorsoduro') || 
            	         strContains($PUB_ADDRESS,'Accademia') ||  strContains($PUB_ADDRESS,'San')
            	         || $PUB_ADDRESS=="Venezia" || $PUB_ADDRESS=="Venezia+" || $PUB_ADDRESS=="Venice"
            	         ){ 
            	             $is_venice=true; 
            	             return "venice";
            	     }
            	     //ISLANDS
            	     else if( strContains($PUB_ADDRESS,'Giudecca') ||  strContains($PUB_ADDRESS,'Lido') || 
            	         strContains($PUB_ADDRESS,'Murano') ||  strContains($PUB_ADDRESS,'Burano')  
            	         ){ 
            	             $is_islands=true; 
            	             return "islands";
            	     }
            	     //MESTRE
            	     else{
            	         $is_mestre=true;
            	         return "mestre";
            	         
            	     }            	     
        }
         
      function updateMultilistingUser( $fb,$location,$today_short,$OWNER,$STATS){
         echo "\n<br>  Update multilisting stats  database... START**"; 
          
         //print_r($STATS);
            
         //Update stats
         echo '<br>\n Update airbnb multilisting stats...:'.'/dashboard/airbnb/'.$location.'/stats_multilisting/';
         
         $fb->update('/dashboard/airbnb/'.$location.'/stats_multilisting/users/'.$OWNER."/", ($STATS));
        
         echo "\n<br>  Update multilisting stats  database... STOP**"; 
         
     }
     
 
       function updateMultilistingPercentualStats( $fb,$location,$today_short ,$STATS){
         echo "\n<br>  Update multilisting percentual stats  database... START**"; 
          
         //print_r($STATS);
            
         //Update stats
         echo '<br>\n Update airbnb multilisting percentual stats...:'.'/dashboard/airbnb/'.$location.'/stats_multilisting/';
         $fb->update('/dashboard/airbnb/'.$location.'/stats_multilisting/last/stats/', ($STATS));
        
         $fb->update('/dashboard/airbnb/'.$location.'/stats_multilisting/days/'.$today_short.'/stats/' ,( $STATS)); 
 
         echo "\n<br>  Update multilisting percentual stats  database... STOP**"; 
         
     }
     
      function updateMultilistingStats( $fb,$location,$today_short,$OWNER,$STATS,$FOLDER){
         echo "\n<br>  Update multilisting stats  database... START**"; 
          
         //print_r($STATS);
            
         //Update stats
        
         if(strlen($OWNER)>0){
              echo '<br>\n /dashboard/airbnb/'.$location.'/stats_multilisting/last/'.$FOLDER."/".$OWNER."/";
         
          $fb->update('/dashboard/airbnb/'.$location.'/stats_multilisting/last/'.$FOLDER."/".$OWNER."/", ($STATS));
          $fb->update('/dashboard/airbnb/'.$location.'/stats_multilisting/days/'.$today_short.'/'.$FOLDER."/".$OWNER."/",( $STATS)); 
 
         }else{
             echo '<br>\n /dashboard/airbnb/'.$location.'/stats_multilisting/last/'.$FOLDER."/";
           
          $fb->update('/dashboard/airbnb/'.$location.'/stats_multilisting/last/'.$FOLDER."/", ($STATS));
          $fb->update('/dashboard/airbnb/'.$location.'/stats_multilisting/days/'.$today_short.'/'.$FOLDER."/",($STATS)); 
 
         }
         
 
         echo "\n<br>  Update multilisting stats  database... STOP**"; 
         
      }
     
        function updateCityStats($fb,$location,$today_short,$CITY_STATS){
         echo "\n  Update city stats  database... START**"; 
          
         print_r($CITY_STATS);
            
         //Update stats
         echo '<br>\n Update airbnb city stats...:'.'/dashboard/airbnb/'.$location.'/stats/';
         $fb->update('/dashboard/airbnb/'.$location.'/stats/last_update/', ($CITY_STATS));
         $fb->update('/dashboard/airbnb/'.$location.'/stats/'.$today_short.'/',( $CITY_STATS)); 
 
         echo "\n  Update city stats  database... STOP**"; 
         
     }
     










   function getIndexString($numenr){
       $str="1";
       
       for($i=0;$i<$numenr;$i++)
       $str.="1";
       
       return $str;
   }

     
     
     
     function  updateRoomsDatabase($fb,$CITY,$ROOMS){
            echo "\n<br>  Update rooms database... START**"; 
            
        	foreach($ROOMS AS $HOST_ID => $THEROOM){
        	    
        	     
        	    //Remove blank data fields
        	    foreach($THEROOM AS $IND => $VAL){
        	         if(strlen($VAL)<1){
        	            unset ($THEROOM[$IND]);
        	         }
        	    }
        	    
        	    echo "\n<br> UPDATE ROOM IN FIREBASE:".'/dashboard/airbnb/'.$CITY.'/rooms/'.$HOST_ID.'/'." <br>";
        	    print_r($THEROOM);
        	    $fb->update('/dashboard/airbnb/'.$CITY.'/rooms/'.$HOST_ID.'/', $THEROOM); 
        	    
        	}
        	
        	
            echo "<br><br>Update rooms database..STOP **.";
        
    } 
	 
	 
	 //Walk node
    function showDOMNode($domNode,$global_array) {
        foreach ($domNode->childNodes as $node)
        {
            echo '\n'.$node->nodeName.':'.$node->nodeValue;
            if($node->hasChildNodes()) {
                showDOMNode($node,$global_array);
            }
        }    
    }
    
    //String helpers
    function startsWith($haystack, $needle) {
    // search backwards starting from haystack length characters from the end
    return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== FALSE;
    }
    function endsWith($haystack, $needle) {
        // search forward starting from end minus needle length characters
        return $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos($haystack, $needle, $temp) !== FALSE);
    }
    
    function getFirstNumberInString($str){
        $matches=array();
        preg_match_all('!\d+!', $str, $matches);
        //print_r($matches);
        return @$matches[0][0];
    }
    function numberBefore($haystack, $needle){
        $pos=strpos($haystack,$needle);
        if ($pos !== false) {
            return substr($haystack,$pos-1,1);
        }
        return false;
    }    
    function strContains($haystack, $needle){
        if (strpos($haystack,$needle) !== false) {
            return true;
        }
        return false;
    }
            
	    
    //curl request returns json output via json_decode php function
    function getByCurl($url,$json=false){
        echo "\nUrl:$url";
        
    	$ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_USERAGENT, "Testing");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        
        $result = curl_exec($ch);
        
        if (!$result) {
          echo('<br>cURL Error: '.curl_error($ch));
        }
         
    	curl_close($ch);
        //echo $result;
    	 
    	if($json)
         return json_decode($result, true);
    	 
    	return $result;
    }
    
    // Takes in a time in DD/MM/YYYY HH:MM format
	function phpDateTime($date_time) {
		$date_time = str_replace('/', '-', $date_time);
		return strtotime($date_time);
	}
 
 

?>
