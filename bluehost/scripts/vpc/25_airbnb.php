<?php
        
          /*
           CRON: 
              Daily 
           
           https://insideairbnb.com/venice/
         
           
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
        	echo "<br>*************** GRAB AIRBNB    ***********";
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
          
        	$DB_STATS_F       = $fb->get('/dashboard/airbnb/'.$location.'/stats_multilisting/last/stats/');
        	$PERC_STATS      = json_decode($DB_STATS_F,true);	
        	//print_r($PERC_STATS);
 
 
        	
        	/*
        	   
        	   GET NEIGHBORHOOD STATS (GENERIC)
        	
        	*/
        	$neighborhoods=array("","Castello","Cannaregio","San+Marco","Giudecca","Dorsoduro%2FAccademia","Murano","Lido","San+Polo","Santa+Croce");
            $neighborhoods_avgprice=array();
            $neighborhoods_availab=array();        	
            if(true){	  
                $neighborhoods_availab["from"]=$checkin;
                $neighborhoods_availab["to"]  =$checkout;
                $neighborhoods_availab["location"]=$location;
                
                foreach($neighborhoods AS $IND=>$VAL){
                   
             
                    $neightborhood = $VAL;
             
                   	$today_search_list_url       ="https://www.airbnb.it/search/search_results?locale=en&neighborhoods%5B%5D=".$neightborhood."&&source=page&location=".$location."&checkin=".$checkin."&checkout=".$checkout."&guests=".$guests."&s_tag=".$s_tag."&ss_id=".$ss_id;
                   	 if($IND==0){//Whole venice data
                      $neightborhood = "Venice";
                      $today_search_list_url       ="https://www.airbnb.it/search/search_results?locale=en&source=page&location=".$location."&checkin=".$checkin."&checkout=".$checkout."&guests=".$guests."&s_tag=".$s_tag."&ss_id=".$ss_id;
                     } 
                     
                    $today_airbnb_list_html_curl=getByCurl($today_search_list_url,false);
                    $today_airbnb_list_html     =json_decode($today_airbnb_list_html_curl, true);
                    
                    $availab       =$today_airbnb_list_html["logging_info"]["search"]["result"]["totalHits"];
                    $average_price =$today_airbnb_list_html["logging_info"]["search"]["result"]["resultSetSummary"]["averagePrice"];
                    
                    if($average_price>200)
                       $average_price=200;
                     
                     $neightborhood=str_replace("+","",$neightborhood);//remove white space
                     $neightborhood=str_replace("%2F","",$neightborhood);//remove comma
                               
                     $neighborhoods_availab[$neightborhood]=$availab;
                     
                     $neighborhoods_avgprice[$neightborhood]=$average_price;
                    
                     echo "\n\n<br><br> Get search results from $checkin to $checkout in $neightborhood ::: $availab\n";
                    
                }//Neightborhood
            }//DO NEIGHTBORHOOD STATS
            $CITY_STATS["neighborhoods_availab" ]       = $neighborhoods_availab;
            $CITY_STATS["neighborhoods_avgprice" ]      = $neighborhoods_avgprice;
             
             	/*
        	   
        	   GET NEIGHBORHOOD STATS ***  WHOLE APPARTMENTS
        	
        	*/
            $neighborhoods_whole_apartments=array();       	
            if(true){	  
                foreach($neighborhoods AS $IND=>$VAL){ 
                    $neightborhood = $VAL; 
                   	$today_search_list_url       ="https://www.airbnb.it/search/search_results?room_types%5B%5D=Entire+home%2Fapt&locale=en&neighborhoods%5B%5D=".$neightborhood."&&source=page&location=".$location."&checkin=".$checkin."&checkout=".$checkout."&guests=".$guests."&s_tag=".$s_tag."&ss_id=".$ss_id;
                   	 if($IND==0){//Whole venice data
                      $neightborhood = "Venice";
                      $today_search_list_url       ="https://www.airbnb.it/search/search_results?room_types%5B%5D=Entire+home%2Fapt&locale=en&source=page&location=".$location."&checkin=".$checkin."&checkout=".$checkout."&guests=".$guests."&s_tag=".$s_tag."&ss_id=".$ss_id;
                     } 
                     
                    $today_airbnb_list_html_curl=getByCurl($today_search_list_url,false);
                    $today_airbnb_list_html     =json_decode($today_airbnb_list_html_curl, true);
                     
                     $neightborhood=str_replace("+","",$neightborhood);//remove white space
                     $neightborhood=str_replace("%2F","",$neightborhood);//remove comma
                               
                     $neighborhoods_whole_apartments[$neightborhood]=$today_airbnb_list_html["logging_info"]["search"]["result"]["totalHits"];;
                      
                    
                     echo "\n\n<br><br> Neightborhood whole apartments::: ".$neighborhoods_whole_apartments[$neightborhood]."\n";
                    
                }//Neightborhood
            }//DO NEIGHTBORHOOD STATS
            $CITY_STATS["neighborhoods_whole_apartments" ]       = $neighborhoods_whole_apartments; 
             
                   
            /*
               GRAB LISTINGS
            */
            $MAX_LISTING_PAGES_PER_DAY=7;                      
            if(true){ 
                echo "\n\n Get search results in $location :::\n";
                
                //Search without dates fot all records
               	$search_list_url ="https://www.airbnb.it/search/search_results?locale=en&page=1&source=page&location=".$location ."&s_tag=".$s_tag."&ss_id=".$ss_id;
            	$airbnb_list_html_curl=getByCurl($search_list_url,false);
            	$airbnb_list_html =json_decode($airbnb_list_html_curl, true);
            	 
                //print_r($airbnb_list_html);
                $TOTAL_HINTS=$airbnb_list_html["logging_info"]["search"]["result"]["totalHits"];
                
            	$MAX_PAGES_ALL=$airbnb_list_html["logging_info"]["search"]["result"]["totalHits"];
                if($debug) echo "\n Total Hints::".$MAX_PAGES_ALL." MAX_PAGES_ALL/18:".($MAX_PAGES_ALL/18) ;  
                $MAX_PAGES_ALL= (int)($MAX_PAGES_ALL/18);//18 per pagina
                               
            	$PROPERTIES_ARRAY[]=array();
            	$global_array      =array();
            	$counterx=0;
            	for($page=1;$page<$MAX_PAGES_ALL;$page++){$counterx++;
            	
            	     $page_query=$page;
            	    if($page>1)
            	       $page_query=rand(1, $MAX_PAGES_ALL);
            	    
                   	$search_list_url ="https://www.airbnb.it/search/search_results?locale=en&page=".$page_query."&source=page&location=".$location ."&s_tag=".$s_tag."&ss_id=".$ss_id;
                	$airbnb_list_html=getByCurl($search_list_url,true); 
                	
                	 
                    //GET FIRST STATISTICAL DATA only for first page    	
                    if($counterx==1){  	 	 
                         //Update date
                         $CITY_STATS["update_date"]           = $today_short;
                     	 $CITY_STATS["city_total_rooms_est"]  = $TOTAL_HINTS;  
                     	 
                     	 $TOTAL2=0;
                     	 $TOTAL3=0;
                     	 $CITY_STATS["neighborhood_rooms"]=array();
                     	 foreach($airbnb_list_html["logging_info"]["search"]["result"]["facets"]["neighborhood"] AS $KEY2=>$VAL2){
                     	    echo "\n<br>neighborhood_rooms:".$KEY2.":".$VAL2;
                     	    
         
                           $KEY2=str_replace(" ","",$KEY2);//remove white space
                           $KEY2=str_replace("/","",$KEY2);//remove comma
                     	   $CITY_STATS["neighborhood_rooms"][urlencode($KEY2)]  = $VAL2;
                     	   $CITY_STATS["neighborhoods_diff" ] [urlencode($KEY2)]=$VAL2-$CITY_STATS["neighborhoods_availab" ] [urlencode($KEY2)];
                     	   $TOTAL2+=$VAL2;
                     	   $TOTAL3+=$CITY_STATS["neighborhoods_diff" ][urlencode($KEY2)];
                     	 }
                     	  $CITY_STATS["neighborhood_rooms_total"]           =$TOTAL2;
                     	  $CITY_STATS["neighborhood_rooms_total_diff"]      =$TOTAL3;
                     	  
                     	  //First stats update
                     	  updateCityStats($fb,$location,$today_short,$CITY_STATS);
                 	  
                	}//Stats only first page PAGE==1
                	
                	
                	
                	//GET LISTING DATA 
                	$index=-1;
                	foreach($airbnb_list_html["results_json"]["search_results"] AS $KEY=>$VAL0){$index++;
                	    
                	    //$KEY is the array progressive number 0,1,2
                	    $LISTING =$VAL0["listing"]; 
                	    
                	    echo "\n<br><br>****NEW LISTING:::".$LISTING["id"];  
                	    $LISTING_ID=$LISTING["id"];//Hosting id
                	    
                         //Add property to grab?
                	     if(      (!isset($PROPERTIES_ARRAY[$LISTING_ID]) && $LISTING_ID>0) 
                	           ||  !isset($PROPERTIES_ARRAY[$LISTING_ID]["person_capacity"])
                	           ||   $PROPERTIES_ARRAY[$LISTING_ID]["room_owner_id"]=="-3"){
                	         
                	  
                	        $PROPERTIES_ARRAY[$LISTING_ID]=array();
                	        $PROPERTIES_ARRAY[$LISTING_ID]["host_id"]               =$LISTING_ID;
                	        $PROPERTIES_ARRAY[$LISTING_ID]["update_date"]       =$current_date_fb;
                	        
                	        $PROPERTIES_ARRAY[$LISTING_ID]["avgPrice"]  =$airbnb_list_html["logging_info"]["search"]["result"]["avgPrice"][$index];
                	        $PROPERTIES_ARRAY[$LISTING_ID]["serviceFee"]=$airbnb_list_html["logging_info"]["search"]["result"]["serviceFee"][$index];
                	        $PROPERTIES_ARRAY[$LISTING_ID]["stayPrice"] =$airbnb_list_html["logging_info"]["search"]["result"]["stayPrice"][$index];
                	        
                	        
                	        $PROPERTIES_ARRAY[$LISTING_ID]["totalPrice"]=$airbnb_list_html["logging_info"]["search"]["result"]["totalPrice"][$index];
                	        if($PROPERTIES_ARRAY[$LISTING_ID]["totalPrice"]<2){
                	          $PROPERTIES_ARRAY[$LISTING_ID]["totalPrice"]=$airbnb_list_html["logging_info"]["search"]["result"]["pricingResponses"][$index]["totalPrice"];
                	        }
                	        
                	        
                	        $PROPERTIES_ARRAY[$LISTING_ID]["lat"]             =$LISTING["lat"];
                	        $PROPERTIES_ARRAY[$LISTING_ID]["long"]            =$LISTING["lng"];
                	        
                        	$PROPERTIES_ARRAY[$LISTING_ID]["person_capacity"]              =$LISTING["person_capacity"];   
                	        $PROPERTIES_ARRAY[$LISTING_ID]["room_accomodates"      ]       =$LISTING["person_capacity"]; 
                	        $PROPERTIES_ARRAY[$LISTING_ID]["room_guests"      ]            =$LISTING["person_capacity"]; 
                	        
                	        $PROPERTIES_ARRAY[$LISTING_ID]["beds"      ]      =$LISTING["beds"]; 
                	        $PROPERTIES_ARRAY[$LISTING_ID]["bedrooms"      ]  =$LISTING["bedrooms"]; 
                	        $PROPERTIES_ARRAY[$LISTING_ID]["property_type"      ]   =$LISTING["property_type"];  

                	        $PROPERTIES_ARRAY[$LISTING_ID]["public_address"      ] =$LISTING["public_address"];  
                	        $PROPERTIES_ARRAY[$LISTING_ID]["star_rating"      ]          =$LISTING["star_rating"];  
                	        $PROPERTIES_ARRAY[$LISTING_ID]["property_picture_url"      ] =$LISTING["picture_url"]; 
                	        
                	        $PROPERTIES_ARRAY[$LISTING_ID]["room_owner"      ]  =$LISTING["primary_host"]["first_name"];  
                	        $PROPERTIES_ARRAY[$LISTING_ID]["room_owner_id"    ] =$LISTING["primary_host"]["id"];  
                	        $PROPERTIES_ARRAY[$LISTING_ID]["room_owner_img"]    =$LISTING["primary_host"]["thumbnail_url"];
                	        
                	        $PROPERTIES_ARRAY[$LISTING_ID]["room_title"      ]  =$LISTING["name"]; 
                	        $PROPERTIES_ARRAY[$LISTING_ID]["room_type"      ]   =$LISTING["room_type"];                  	        

                	        $PROPERTIES_ARRAY[$LISTING_ID]["room_reviews"      ]           =$LISTING["reviews_count"]; 
                	        $PROPERTIES_ARRAY[$LISTING_ID]["days_available_in_year"      ] =365- rand(120, 200); 
                	       
                        	   
                            echo "<br>PRINT PROPERTY::".$PROPERTIES_ARRAY[$LISTING_ID]["host_id"]."<br>";
                            print_r($PROPERTIES_ARRAY[$LISTING_ID]);
                        
                            //Update Room
                            $UPDATE_ROOM=array();
                            $UPDATE_ROOM[$LISTING_ID]= $PROPERTIES_ARRAY[$LISTING_ID];
                            updateRoomsDatabase($fb,$location,$UPDATE_ROOM);
                          
                           
                	     }                	    
                	}
                    	
                  //TEST        	
                 if($counterx>=$MAX_LISTING_PAGES_PER_DAY)break;
                
                  
                
                
            	}//MAIN FOR airbnb city query result page
           }//DO LISTENINGS DATA
                 
                 
          /*
    	  
    	 
    	   STATISTICS OVER ALL DATA
                     
                        
    	 */
          if(true){ 	 
            	 echo "\n\n Statistics:::\n";
             
             	 $CITY_STATS["rooms_total_availability_year"] =0;
             	 $CITY_STATS["rooms_total_reviews"]           =0;
             	 $CITY_STATS["rooms_price_per_night_avg"]     =0; 
             	 $CITY_STATS["total_listings_today_checked"]  =0;
             	 $CITY_STATS["total_beds"]                    =0;
             	 $CITY_STATS["whole_apartments"]              =0;
             	 $CITY_STATS["whole_apartments_venice"]              =0;
             	 $CITY_STATS["whole_apartments_islands"]             =0;
             	 $CITY_STATS["whole_apartments_mestre"]              =0;
             	 

            	   
            	 $TOTAL_ROOM_TYPES=array(); 
            	 $TOTAL_PROP_TYPES=array(); 
            	 $TOTAL_PUB_ADDRESS=array(); 
            	 
            	 $TOTAL_ROOM_OWNERS=array();
            	 
                 $DB_ROOMS_F       = $fb->get('/dashboard/airbnb/'.$location.'/rooms/');
        	     $DB_ROOMS_FB      = json_decode($DB_ROOMS_F,true);
        	     echo "<br>Total db records:".count($DB_ROOMS_FB);
                 foreach($DB_ROOMS_FB AS $KEY=>$VAL){ 
                     
            	    if(is_numeric($VAL["host_id"]) && $VAL["host_id"]>0){  
            	      
            	     $CITY_STATS["total_listings_today_checked"]++;
            	     
            	     //Zone classification
            	     $PUB_ADDRESS=trim(urlencode($VAL["public_address"]));
            	     if(strlen($PUB_ADDRESS)>0){
                	     if(!isset($TOTAL_PUB_ADDRESS[$PUB_ADDRESS])){
                	         //echo "<br>new_public_address:".$VAL["public_address"];
                	         $TOTAL_PUB_ADDRESS[$PUB_ADDRESS]=0; 
                	     }
                	     $TOTAL_PUB_ADDRESS[$PUB_ADDRESS]++;
            	     } 
            	     $is_mestre=false;  $is_venice=false;  $is_islands=false;
            	     updateRoomAreaFromPubAddress($PUB_ADDRESS,$is_venice,$is_mestre,$is_venice);
            	      
            	     //Room types
            	     $ROOM_TYPE=urlencode($VAL["room_type"]);
            	     if(strlen(@$ROOM_TYPE)>1){
                	      if(!is_numeric($TOTAL_ROOM_TYPES[$ROOM_TYPE])){
                	          $TOTAL_ROOM_TYPES[$ROOM_TYPE]=0;
                	      }   
                	      $TOTAL_ROOM_TYPES[$ROOM_TYPE]++;
                	     
                	     if($is_venice){$CITY_STATS["whole_apartments_venice"]++;}
                	     else if($is_islands){$CITY_STATS["whole_apartments_islands"]++;}
                	     else{$CITY_STATS["whole_apartments_mestre"]++;}
            	     }
            	     
            	     //Property types
            	     $PROP_TYPE=urlencode($VAL["property_type"]);
            	     if(strlen(@$PROP_TYPE)>1){
                	      if(!is_numeric($TOTAL_PROP_TYPES[$PROP_TYPE])){
                	          $TOTAL_PROP_TYPES[$PROP_TYPE]=0;
                	      }   
                	      $TOTAL_PROP_TYPES[$PROP_TYPE]++;
                	       
            	     } 
            	     
            	     //Whole apartments
            	     if($ROOM_TYPE==["Entire+home%2Fapt"] || $PROP_TYPE==["Apartment"]){
            	         $CITY_STATS["whole_apartments"]++;
            	     }
            	     
            	     //Availability  
            	     if(!is_numeric($VAL["days_available_in_year"])){
            	         $VAL["days_available_in_year"]=200;
            	     }
                     $CITY_STATS["rooms_total_availability_year"]+=$VAL["days_available_in_year"];
                     
                     //Beds   
            	     if(!is_numeric($VAL["total_beds"])){
            	         $VAL["total_beds"]=1;
            	     }
                     $CITY_STATS["total_beds"]+=$VAL["total_beds"];
                     
            	     //Owner rooms
            	     $ROOM_OWNER=urlencode($VAL["room_owner_id"]);
            	     if(strlen(@$ROOM_OWNER)>1){
                	      if(!is_numeric($TOTAL_ROOM_OWNERS[$ROOM_OWNER])){
                	           $TOTAL_ROOM_OWNERS[$ROOM_OWNER]=0;
                	      }
                	     $TOTAL_ROOM_OWNERS[$ROOM_OWNER]++;
            	     }
            	     
            	     //Reviews 
                     $CITY_STATS["rooms_total_reviews"]+=$VAL["room_reviews"];
            	     
            	     //Price per night
            	     if(!is_numeric($VAL["avgPrice"])){
            	         $VAL["avgPrice"]=50;
            	     }
            	     $CITY_STATS["rooms_price_per_night_total"]+=$VAL["avgPrice"];
            	     
            	     
            	    }
                 }//FOR EACH DB PROPERTY
                 
                  
                 //SAVE
                 echo "<br>\nCITY STATS ARRAY<br>\n<br>"; 
                 $CITY_STATS["room_types_totals"]                 =$TOTAL_ROOM_TYPES;
                 $CITY_STATS["property_types_totals"]             =$TOTAL_PROP_TYPES; 
                 
                 $CITY_STATS["rooms_per_pub_adress"]              =$TOTAL_PUB_ADDRESS; 
                 
                 
                 $CITY_STATS["rooms_total_rooms" ]          =$CITY_STATS["total_listings_today_checked"];
                 
                 
                 $CITY_STATS["rooms_avg_availability_year"]=$CITY_STATS["rooms_total_availability_year"]/$CITY_STATS["total_listings_today_checked"];
                 
                 $CITY_STATS["rooms_price_per_night_avg"]  =$CITY_STATS["rooms_price_per_night_total"]/$CITY_STATS["total_listings_today_checked"];
                
                 $CITY_STATS["whole_apartments"]=$CITY_STATS["whole_apartments_venice"] +$CITY_STATS["whole_apartments_islands"] + $CITY_STATS["whole_apartments_mestre"]  ;
                
                $neighborhood_rooms=$CITY_STATS["neighborhood_rooms"];
                $neighborhoods_diff=$CITY_STATS["neighborhoods_diff"];
                
                
                //WIDGET DATA
                $WIDG=array(); 
                
                $WIDG["TOT_LISTINGS"]=  $CITY_STATS["city_total_rooms_est"];
                $WIDG["TOT_AVAILAB"]  = $neighborhoods_availab["Venice"];
                $WIDG["TOT_WHOLEAPP"]  = $neighborhoods_whole_apartments["Venice"];
                
                //VENICE 

                
                $WIDG["TOT_WHOLEAPP_VE"] =$neighborhoods_whole_apartments["Cannaregio"]+$neighborhoods_whole_apartments["Castello"]+$neighborhoods_whole_apartments["DorsoduroAccademia"]
                +$neighborhoods_whole_apartments["SanMarco"]+$neighborhoods_whole_apartments["SanPolo"]+$neighborhoods_whole_apartments["SantaCroce"];
                
                
            	$WIDG["AVG_PRICE_VE"]=($neighborhoods_avgprice["Cannaregio"]+$neighborhoods_avgprice["Castello"]
            	                      +$neighborhoods_avgprice["DorsoduroAccademia"]+$neighborhoods_avgprice["SanMarco"]
            	                      +$neighborhoods_avgprice["SanPolo"]+$neighborhoods_avgprice["SantaCroce"])/6;
            	$WIDG["AVG_PRICE_VE"]   =$CITY_STATS["rooms_price_per_night_avg"];//!!!!NEED MORE RECS TO USE UPPER VAULE

                $WIDG["TOT_LISTINGS_VE"]=$neighborhood_rooms["Cannaregio"]+$neighborhood_rooms["Castello"]+$neighborhood_rooms["DorsoduroAccademia"]
                +$neighborhood_rooms["SanMarco"]+$neighborhood_rooms["SanPolo"]+$neighborhood_rooms["SantaCroce"];
                
                $WIDG["TOT_BEDS_VE"]=$WIDG["TOT_LISTINGS_VE"]*1.8;////!!!!NEED MORE RECS TO USE UPPER VAULE
                
                $WIDG["TOT_AVAILAB_VE"]= $neighborhoods_availab["Cannaregio"]+$neighborhoods_availab["Castello"]+$neighborhoods_availab["DorsoduroAccademia"]
                                          +$neighborhoods_availab["SanMarco"]+$neighborhoods_availab["SanPolo"]+$neighborhoods_availab["SantaCroce"];
                
                $WIDG["TOT_BOOKED_VE"]=$neighborhoods_diff["Cannaregio"]+$neighborhoods_diff["Castello"]+$neighborhoods_diff["DorsoduroAccademia"]
                +$neighborhoods_diff["SanMarco"]+$neighborhoods_diff["SanPolo"]+$neighborhoods_diff["SantaCroce"];
                 
                
                $WIDG["TOT_BOOKED_VE_PERC"]=$WIDG["TOT_BOOKED_VE"]/$WIDG["TOT_LISTINGS_VE"]*100;
                
                $WIDG["TOT_MULTILISTS_MORETHAN2_VENICE_PERC"]=$PERC_STATS["roomsnum_venice_morethan_2"]/$PERC_STATS["roomsnum_venice"]*100;
                $WIDG["TOT_MULTILISTS_TOP10_ROOMSPEROWNER_AVG_VENICE"]= $PERC_STATS["top10_roomsperowner_avg_venice" ];
                
	 
	             //ISLANDS

	             
	             $WIDG["TOT_WHOLEAPP_ISLANDS"]=$neighborhoods_whole_apartments["Giudecca"]+$neighborhoods_whole_apartments["Lido"]
                +$neighborhoods_whole_apartments["Murano"] ;
	             
	             $WIDG["AVG_PRICE_ISLANDS"]=($neighborhoods_avgprice["Giudecca"]+$neighborhoods_avgprice["Lido"]
                +$neighborhoods_avgprice["Murano"])/3 ;
                
                $WIDG["TOT_LISTINGS_ISLANDS"]=$neighborhood_rooms["Giudecca"]+$neighborhood_rooms["Lido"]
                +$neighborhood_rooms["Murano"] ;
                
                $WIDG["TOT_BEDS_ISLANDS"]=$WIDG["TOT_LISTINGS_ISLANDS"]*1.3;////!!!!NEED MORE RECS TO USE UPPER VAULE
                
                $WIDG["TOT_AVAILAB_ISLANDS"]=$neighborhoods_availab["Giudecca"]+$neighborhoods_availab["Lido"]
                +$neighborhoods_availab["Murano"] ;
                
                $WIDG["TOT_BOOKED_ISLANDS"]=$neighborhoods_diff["Giudecca"]+$neighborhoods_diff["Lido"]
                +$neighborhoods_diff["Murano"] ;
                
                $WIDG["TOT_BOOKED_ISLANDS_PERC"]=$WIDG["TOT_BOOKED_ISLANDS"]/$WIDG["TOT_LISTINGS_ISLANDS"]*100;
	 
	            $WIDG["TOT_MULTILISTS_MORETHAN2_ISLANDS_PERC"]=  $PERC_STATS["roomsnum_islands_morethan_2"]/$PERC_STATS["roomsnum_islands"]*100;
	            $WIDG["TOT_MULTILISTS_TOP10_ROOMSPEROWNER_AVG_ISLANDS"]= $PERC_STATS["top10_roomsperowner_avg_islands" ];
	            
	            //OTHERS (mestre?)

	            
	            $WIDG["TOT_WHOLEAPP_MESTRE"]=$WIDG["TOT_WHOLEAPP"]-$WIDG["TOT_WHOLEAPP_VE"]-$WIDG["TOT_WHOLEAPP_ISLANDS"];
	            $WIDG["TOT_LISTINGS_MESTRE"]=$WIDG["TOT_LISTINGS"]-$WIDG["TOT_LISTINGS_VE"]-$WIDG["TOT_LISTINGS_ISLANDS"];
	            
	            $WIDG["TOT_BEDS_MESTRE"]=$WIDG["TOT_LISTINGS_MESTRE"]*1.3;////!!!!NEED MORE RECS TO USE UPPER VAULE
	            
                $WIDG["TOT_AVAILAB_MESTRE"] =$WIDG["TOT_AVAILAB"] -$WIDG["TOT_AVAILAB_VE"]-$WIDG["TOT_AVAILAB_ISLANDS"];
                $WIDG["TOT_BOOKED_MESTRE"]  =$WIDG["TOT_LISTINGS_MESTRE"]-$WIDG["TOT_AVAILAB_MESTRE"];
                $WIDG["TOT_BOOKED_MESTRE_PERC"]=$WIDG["TOT_BOOKED_MESTRE"]/$WIDG["TOT_LISTINGS_MESTRE"]*100;
                $WIDG["AVG_PRICE_MESTRE"]= $WIDG["AVG_PRICE_VE"]*0.6;
                
                $WIDG["TOT_MULTILISTS_MORETHAN2_MESTRE_PERC"]=$PERC_STATS["roomsnum_mestre_morethan_2"]/$PERC_STATS["roomsnum_mestre"]*100;;
	            $WIDG["TOT_MULTILISTS_TOP10_ROOMSPEROWNER_AVG_MESTRE"]= $PERC_STATS["top10_roomsperowner_avg_mestre" ];
	 
	 
	             //UPDATE STATS
	            $CITY_STATS["widget_data" ]          =$WIDG;
	             
                //Final update to stats
                updateCityStats($fb,$location,$today_short,$CITY_STATS); 
                
          }//DO CITY STATS   
          
          
          
    
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
         echo '<br>\n Update airbnb multilisting stats...:'.'/dashboard/airbnb/'.$location.'/stats_multilisting/';
         
         $fb->update('/dashboard/airbnb/'.$location.'/stats_multilisting/last/'.$FOLDER."/".$OWNER."/", ($STATS));
         $fb->update('/dashboard/airbnb/'.$location.'/stats_multilisting/days/'.$today_short.'/'.$FOLDER."/".$OWNER."/",( $STATS)); 
 
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

function array_msort($array, $cols)
{
    $colarr = array();
    foreach ($cols as $col => $order) {
        $colarr[$col] = array();
        foreach ($array as $k => $row) { $colarr[$col]['_'.$k] = strtolower($row[$col]); }
    }
    $eval = 'array_multisort(';
    foreach ($cols as $col => $order) {
        $eval .= '$colarr[\''.$col.'\'],'.$order.',';
    }
    $eval = substr($eval,0,-1).');';
    eval($eval);
    $ret = array();
    foreach ($colarr as $col => $arr) {
        foreach ($arr as $k => $v) {
            $k = substr($k,1);
            if (!isset($ret[$k])) $ret[$k] = $array[$k];
            $ret[$k][$col] = $array[$k][$col];
        }
    }
    return $ret;

}
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 function grabAirbnbHostingPage(){
     
     
     
     
                 //For further processing
                 $KEY=$VAL;
        	     $VAL=$PROPERTIES_ARRAY[$VAL];
        	     
        	     
        	     /*
        	     
        	     
        	       ROOM PAGE GRABBING
        	     
        	     
        	     */
	     
	            if(!is_numeric($VAL["host_id"]) || !isset($VAL["host_id"])){
	                echo "\n<br>Room ".$VAL." in db firebase.. SKIP RECORD II";
	                continue;
	            }
	     
        	     if($debug)echo "\n host_id:".$VAL["host_id"]." avgPrice:".$VAL["avgPrice"]." totalPrice:".$VAL["totalPrice"]." serviceFee:".$VAL["serviceFee"]." stayPrice:".$VAL["stayPrice"]." totalPrice:".$VAL["totalPrice"]." lat:".$VAL["lat"]." long:".$VAL["long"];
        	     
        	     $url="https://www.airbnb.com/rooms/".$VAL["host_id"]."?checkin=".urlencode($checkin)."&checkout=".urlencode($checkout)."&locale=en";
        	     
        	     $airbnb_room_html=getByCurl($url,false);

         	 	 
        	     $dom = new DomDocument();
                 if(strlen($airbnb_room_html)>10)
                  $dom->loadHTML($airbnb_room_html);   
        	 	
        	 	 $xpath = new DOMXPath($dom);
        	 	 
        	 	 //Update date
        	 	  $PROPERTIES_ARRAY[$KEY]["update_date"]=$today_short;
        	 	  
        	 	 
        	 	 //Room name
        	 	 echo "<br>Search room name...";
        	 	 $room_name       = $xpath->query('//h1[@id="listing_name"]');
        	 	 
        	 	 if($room_name!=null)
        	 	 $PROPERTIES_ARRAY[$KEY]["room_title"] = @$room_name->item(0)->nodeValue;
        	 	 
                 echo "<br>Search room name:".$PROPERTIES_ARRAY[$KEY]["room_title"] ;
                 
                 //Owner name
                 echo "<br>Search owner...";
                 
                 //Owner image
         	 	 $room_owner      = @$xpath->query('//div[@data-hosting_id="'.$VAL["host_id"].'"]');
         	 	 if($room_owner!=null){
        	 	   $PROPERTIES_ARRAY[$KEY]["room_owner_img"] = @$room_owner->item(0)->attributes->getNamedItem('data-host_img')->nodeValue;
         	 	 }
        	 	 echo "<br>Search owner image:".$PROPERTIES_ARRAY[$KEY]["room_owner_img"];
        	 	  
         	 	 //Owner ID 
     	 	     //"profile_path":"/users/show/63136814","profile_pic_path":"https:/
                 preg_match('/'.preg_quote('profile_path').'(.*?)'.preg_quote('profile_pic_path').'/is', $airbnb_room_html, $match);
                 $PROPERTIES_ARRAY[$KEY]["room_owner_id"] = getFirstNumberInString(@$match[1]);
         	 	 echo "<br>Search owner id:".$PROPERTIES_ARRAY[$KEY]["room_owner_id"];
         	 	  
         	 	 
        	 	 //Owner name
        	 	 $room_owner      = $xpath->query('//img[@class="host-profile-image"]');
           	 	 if($room_owner!=null){
        	 	   $PROPERTIES_ARRAY[$KEY]["room_owner"]        = @$room_owner->item(0)->attributes->getNamedItem('title')->nodeValue;
        	 	   $PROPERTIES_ARRAY[$KEY]["room_owner_img_src"] = @$room_owner->item(0)->attributes->getNamedItem('src')->nodeValue;
               	 	 
                     echo "<br>Search owner name:".$PROPERTIES_ARRAY[$KEY]["room_owner"];
                     echo "<br>Search owner room_owner_img_src:".$PROPERTIES_ARRAY[$KEY]["room_owner_img_src"];
             	 	  
            		 
           	 	 }
           	 	 
           	   
         	 	 
        	 	 foreach ($xpath->query("//*[@data-reactid]") as $a) { //attributes  nodeValue  nodeName tagName textContent
        		   $value    = strtolower($a->nodeValue);
        		   $react_id = $a->attributes->getNamedItem('data-reactid')->nodeValue;
        		    
        		   if($debug)echo "\n NodeValue:".$value."#nodeName:".$nodeName."#tagName:".$tagName."#react_id:".$react_id ;   
        		       
        		     
        		  if( endsWith($react_id,'Accommodates=2.2')){
        		       $PROPERTIES_ARRAY[$KEY]["room_accomodates"]=$value;
        	 	  }
        		  
        		      		     
        		  if( strContains($react_id,'.0.1.1.0') && strContains($value,'guests')){
        		       $num_arr=explode ( " " , $value );
        		       $num=@$num_arr[0];
        		       $PROPERTIES_ARRAY[$KEY]["room_guests"]=$num;
        	 	  }
        		  if( strContains($react_id,'.0.1.1.0.$0')){  
        		      echo "\n<br>Room types:".$value;
        		       $PROPERTIES_ARRAY[$KEY]["room_type"]=$value;
        	 	  }                	 	  
        	 	  
        		  
        		   //var_dump($a);
        		   
        		   if( startsWith($value,"room type")){
        		       
        		        if($debug)echo "\n NodeValue:".$value."#nodeName:".$nodeName."#tagName:".$tagName."#textContent:".$textContent;   
        		        
            		   //Bedrooms
            		   if(   strContains($value, "bedrooms") 
            		      && !is_numeric($PROPERTIES_ARRAY[$KEY]["room_bedrooms"]) ){
            		           $PROPERTIES_ARRAY[$KEY]["room_bedrooms"]=numberBefore($value, "bedrooms");
            		    }
            		   //Bathrooms
            		   if(    strContains($value, "bathrooms") 
            		      && !is_numeric($PROPERTIES_ARRAY[$KEY]["room_bathrooms"]) ){
            		           $PROPERTIES_ARRAY[$KEY]["room_bathrooms"]=numberBefore($value, "bathrooms");
            		    }     
            		   //Beds
            		   if(  strContains($value, "beds") 
            		      && !is_numeric($PROPERTIES_ARRAY[$KEY]["room_beds"]) ){
            		           $PROPERTIES_ARRAY[$KEY]["room_beds"]=numberBefore($value, "beds");
            		    } 
            		             		    
            		             		    
        		   }
        		    
        	 	 } 
        	 	 
        	 	if($debug){
            	 	echo "\n  ROOM:";
            	 	print_r($PROPERTIES_ARRAY[$KEY]);
        	 	}
        	 	
          	     /*
            	 
            	 
            	 CALENDAR AVAILABILITY
            	 
            	 
            	 */
            	 echo "\n\n Room calendar:::\n";
            	 $ind=0; 
            	 $calendar_query_key="d306zoyjsyarp7ifhu67rjxn52tv0t20";
        	     $days_available_in_year=0; 
        	     
        	     for($month=1;$month<2;$month++){
        	             $url="https://www.airbnb.com/api/v2/calendar_months?key=".$calendar_query_key."&currency=EUR&locale=en&listing_id=".$VAL["host_id"]."&month=".$month."&year=".$current_year."&count=3&_format=with_conditions";
        	        
        	             $room_calendar=getByCurl($url,true);
        	            
        	             foreach($room_calendar ["calendar_months"]["0"]["days"] AS $DAY_IND=>$DAY_VAL){
            	             
            	             if($DAY_VAL["available"]==1){
            	                 $days_available_in_year++;
            	                 
            	                 //if($debug)echo "\n host_id:".$VAL["host_id"]." days_available_in_year: ".$days_available_in_year."  available_date: ".$DAY_VAL["date"];
            	                 
            	             }
        	             }
        	            
        	            $PROPERTIES_ARRAY[$KEY]["days_available_in_year"]=$days_available_in_year;
        	            
        	            if($debug)echo "\n host_id:".$VAL["host_id"]." days_available_in_year: ".$PROPERTIES_ARRAY[$KEY]["days_available_in_year"];
            	                 
            	             
                	       
        	      }//calendar month
        	                        
        	                        
        	                        
  	              /*
            	 
            	 
            	  ROOM REVIEWS
            	 
            	 
            	  */
               	  echo "\n\n Room reviews:::\n";
 
    	          $url="https://www.airbnb.com/api/v2/reviews?key=".$calendar_query_key."&currency=EUR&locale=en&listing_id=".$VAL["host_id"]."&role=guest&_format=for_p3&_limit=7&_offset=7&_order=language";
    	             
    	          $room_reviews=getByCurl($url,true);
    	              
    	            
    	          $PROPERTIES_ARRAY[$KEY]["room_reviews"]=$room_reviews["metadata"]["reviews_count"];
    	          
    	          if($debug)echo "\n host_id:".$VAL["host_id"]." room_reviews:".$PROPERTIES_ARRAY[$KEY]["room_reviews"];
     
                 
                  
     
                 
                 
                 
                 
                   
 }
 

?>
