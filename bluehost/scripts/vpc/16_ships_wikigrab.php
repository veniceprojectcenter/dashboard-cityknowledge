<?php

  /*
   CRON: Daily
   
  */

    error_reporting(E_ERROR);
    ini_set('display_errors', E_ERROR);
 
    require_once './lib/firebaseLib.php'; 
    date_default_timezone_set('UTC');
 
    $url = 'https://venicedata.firebaseio.com/';
    $key = 'gG1wZ2oyUxca6Rro3XYsXaKH9ODG7nrKEUqVujWm';
    $fb = new fireBase($url, $key);
       
	//INput data 
 	$current_month     = date('m'); 
	$current_day       = date('d'); 
	$current_year      = date('Y');
	$current_hour      = date('H');//utc
	
 
    $today    =$current_year.$current_month.$current_day.$current_hour;
    
	echo "<br>************************************************************************";
	echo "<br>*************** GRAB SHIP DATA FROM WIKIPEDIA ***********";
	echo "<br>***************                 $today       ***********";
	echo "<br>************************************************************************"; 
	

    //Get current sihps array
	$DB_SHIPS      = $fb->get('/dashboard/ships/cruisett_vessels/');
	$DB_SHIPS_JSON = json_decode($DB_SHIPS,true); 
	
	$ii=0;
	echo "<br><b>GRAB Cruisett ships</b></br>";
	foreach($DB_SHIPS_JSON AS $SHIP_DBNAME=>$SHIP_DBDATA){$ii++;
	    echo "<br>SHIP_DB_DATA:<br>"; print_r($SHIP_DBDATA);
	    $ship_name        =@$SHIP_DBDATA["ship_name"];
	    $ship_pass        =@$SHIP_DBDATA["ship_passengers"];
	    $ship_crew        =@$SHIP_DBDATA["ship_crew"]; 
	    $ship_capacity    =@$SHIP_DBDATA["ship_capacity"]; 
	    $ship_imo         =@$SHIP_DBDATA["ship_imo"]; 
	    if(is_numeric($ship_imo) && $ship_imo>10){
	       echo "<br>Ship already grabbed! IMO: $ship_imo";      
	    }else{
	        grabShipDataFromWiki($fb,$ship_name,$ship_pass,$ship_crew,$ship_capacity,$ship_imo,true);
	     
	    }

	    
	}

    echo "<br><b>GRAB Marinetraffic ships</b></br>";
	$ii=0; 
	$DB_SHIPS      = $fb->get('/dashboard/ships/marinetraffic_vessels/');
	$DB_SHIPS_JSON = json_decode($DB_SHIPS,true);	
	foreach($DB_SHIPS_JSON AS $SHIP_DBNAME=>$SHIP_DBDATA){$ii++;
	    echo "<br>SHIP_DB_DATA:<br>"; print_r($SHIP_DBDATA);
	    $ship_name        =@$SHIP_DBDATA["ship_name"];
	    $ship_pass        =@$SHIP_DBDATA["ship_passengers"];
	    $ship_crew        =@$SHIP_DBDATA["ship_crew"]; 
	    $ship_capacity    =@$SHIP_DBDATA["ship_capacity"]; 
	    $ship_imo         =@$SHIP_DBDATA["ship_imo"]; 
	    if( is_numeric($ship_crew) && $ship_crew>10){
	       echo "<br>Ship already grabbed! IMO: $ship_imo";      
	    }else{
	        grabShipDataFromWiki($fb,$ship_name." ".$ship_imo,$ship_pass,$ship_crew,$ship_capacity,$ship_imo,false);
	     
	    }
	    
	    // if($ii==50)
	   //  break;
	    
	}
	
	
	function grabShipDataFromWiki($fb,$ship_name,$ship_pass,$ship_crew,$ship_capacity,$ship_imo){
        	    
        	//Grab wiki page
            $term    = urlencode( $ship_name." imo crew capacity" );
          
            $search_url       = "https://en.wikipedia.org/w/api.php?action=query&srlimit=3&list=search&srwhat=text&srprop=snippet&continue=&redirects&format=json&srsearch=".$term;
        	$wiki_search      = getByCurl($search_url,true); 
        	 
        	
        	echo "<br><b>PAGES</b>";
        //	echo "#"-print_r($wiki_search); echo "#<br>";
        	foreach($wiki_search["query"]["search"] AS $IND=>$OBJ){ 
        	    $title=$OBJ["title"];
        	    $url='https://en.wikipedia.org/wiki/'. $title;
        	    $url2='https://en.wikipedia.org/wiki/'. wikiTtitleEncode($title);
        	    echo "<br><br>Page found:$IND  title:$title" ;
        	    echo '<br><a href="'.$url.'" >'.$title.'</a>';
        	    
        	    $html_res=getByCurl($url2,false);
        	    
                //Wiki url
                $ship_new_data=ARRAY();
                $ship_new_data["wiki_url"] = $url2;
                
                
        	    echo "<br><br>RESULT:<br>";
        	   // echo $html_res;echo "<br>";
        	    
        	    if (strpos($html_res,'The document has moved') !== false) {
                        echo "<br>Follow page redirection...<br>";
                	    $regexp = "<a\s[^>]*href=(\"??)([^\" >]*?)\\1[^>]*>(.*)<\/a>";
                        if(preg_match_all("/$regexp/siU", $html_res, $matches)) {
                            $first_link=@$matches[2][0];
                            echo "<br>Link:".$first_link."<br>";
                            $html_res=getByCurl($first_link,false);
                        }
               } 
               
                echo "<br>Start page grabbing...<br>"; 
                //echo $html_res;echo "<br>";
                
               
                
                //Find imo
                if(!(is_numeric($ship_imo) && $ship_imo>3)){
                    echo "<br>Look for IMO:";
                    $pos = strpos($html_res, "IMO number"); 
                    if (!($pos === false)) {  
                        $substr=substr($html_res,$pos,-1); 
                        $number=get_first_number($substr); 
                         if(is_numeric($number))
                           $ship_new_data["ship_imo"]       =$number;
                        echo $number."#<br>";   
                    }  
                  
                }
                
                //Find passengers
                 if(!(is_numeric($ship_pass) && $ship_pass>3)){   
                    echo "<br>Look for PASSENGERS:";
                    
                    /*
                    $pos = strpos($html_res, "Capacity:"); 
                    if (!($pos === false)) {  
                        $substr=substr($html_res,$pos,-1); 
                        $number=get_first_float($substr); //Ex:1,950
                        $number=str_replace(",","",$number);
                         if(is_numeric($number))
                           $ship_new_data["ship_passengers"]       =$number;
                        echo $number."#<br>";   
                    }  
                    */
                    
                   $pos = strpos($html_res, "passengers"); 
                    if (!($pos === false)) {  
                        $substr=substr($html_res,$pos-6,-1); 
                        $number=get_first_float($substr); //Ex:1,950
                        $number=str_replace(",","",$number);
                         if(is_numeric($number))
                           $ship_new_data["ship_passengers"]       =$number;
                        echo $number."#<br>";   
                    }  
                 }

                //Find crew
                 if(!(is_numeric($ship_crew) && $ship_crew>3)){
                  echo "<br>Look for CREW:";    
                    $pos = strpos($html_res, "Crew:"); 
                    if (!($pos === false)) {  
                        $substr=substr($html_res,$pos,-1); 
                        $number=get_first_number($substr); 
                         if(is_numeric($number))
                           $ship_new_data["ship_crew"]       =$number;
                          echo $number."#<br>";   
                    }  
                 }
                 

                 
          	    //Update database
          	    $dburl="xxxx";
          	    if($is_cruise_or_marinetraffic){
          	       $dburl='/dashboard/ships/cruisett_vessels/'. urlencode($ship_name)."/";
          	       echo "<br>Save ship in $dburl";
          	       $fb->update($dburl, $ship_new_data); 
          	       
          	    } 
          	    
      	       if(is_numeric($ship_new_data["ship_imo"]) && $ship_new_data["ship_imo"]>5){
      	        $dburl='/dashboard/ships/marinetraffic_vessels/'. $ship_new_data["ship_imo"]."/";  
      	        echo "<br>Save ship in $dburl";
      	        $fb->update($dburl, $ship_new_data); 
      	       } 
 
        	}//foreach
	    
	}
 
    function get_first_float ($str) {
        preg_match_all('/\d+(\,\d+)?/', $str, $matches);
        return @$matches[0][0];
    }


   function get_first_number ($str) {
        preg_match_all('/\d+/', $str, $matches);
        return @$matches[0][0];
    }


	function wikiTtitleEncode($txt){
	    $txt=str_replace(" ","_",$txt);
	    return $txt;
	}
	    
    //curl request returns json output via json_decode php function
    function getByCurl($url,$json=false){
        echo "<br>Url:$url";
        
    	$ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_USERAGENT, "Testing for http://stackoverflow.com/questions/8956331/how-to-get-results-from-the-wikipedia-api-with-php");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
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
    
    
	echo "<br><br>"; 
	echo "<br><br>********************************* PROCEDURE FINISHED *************************************";
	echo "<br><br>"; 
 
 

?>