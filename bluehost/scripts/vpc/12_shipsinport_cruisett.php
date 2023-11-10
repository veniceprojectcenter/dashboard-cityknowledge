<?php

  /*
  
   CRON: Weekly
   
  */
  
	error_reporting(E_ERROR);
	ini_set('display_errors', E_ERROR);
	ini_set('max_execution_time', 600); //300 seconds = 5 minutes
	set_time_limit(600);
 
	require_once './lib/firebaseLib.php';
	date_default_timezone_set('CET');
	
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
     $ships_db_grabbed=false;
     $PROCESSED_PORTS=array();
     $firstrun=true;
     foreach($WIDGETS_IN_USE AS $ID=>$WIDGET_CONFIG){  
         if(isset($WIDGET_CONFIG["widgetsInUse"]))
         foreach($WIDGET_CONFIG["widgetsInUse"] AS $ID1=>$WIDGET_CONFIG2){ 
              
              echo "<br>W***DASHBOARD:".$ID; 
              
              echo "<br>Widget Config:<br>";
              //print_r($WIDGET_CONFIG2);
             
            //Check widget name
            if($firstrun){//Venice always...
                 $firstrun=false;    
                 //Defaults
                 $WIDGET_CONFIG2["settings"]["cruisett_port"]["value"]="733-Venice";
                 $WIDGET_CONFIG2["settings"]["cruisett_state"]["value"]="Italy";
            }
            else if(strcmp($WIDGET_CONFIG2["id"],"vessels_inport")){
                continue;
            }
            
            echo "<br>Widget in use:".$WIDGET_CONFIG2["id"]."#<br>"; 
            
            //print_r($WIDGET_CONFIG2);
            
          
        	//INput data
        	$cruisett_port              = $WIDGET_CONFIG2["settings"]["cruisett_port"]["value"];
            $cruisett_state             = $WIDGET_CONFIG2["settings"]["cruisett_state"]["value"];  
            
            $port_arr =explode("-",$port);
            $port_code=$port_arr[0];
            $port_name=$port_arr[1];
            
            //Do not reprocess port
            if($PROCESSED_PORTS[$cruisett_port]==true){
                echo "<br><br><br><br>!!!!!!!!!!!!Do not reprocess port:$cruisett_port $cruisett_state <br><br><br>";
                continue;
            }else{
                $PROCESSED_PORTS[$cruisett_port]=true;
                echo "<br><br><br><br>Start port processing:$cruisett_port $cruisett_state<br><br><br>";
            }
 
        
        	
        	echo "<br>************************************************************************";
        	echo "<br>*************** IMPORT SHIPS IN PORT FROM CRUISETT ***********";
        	echo "<br>************************************************************************";
        	
        	$default_ship_capacity="-1";
        	
         	$current_month     = date('M');
         	$current_month_num = date('m'); 
        	$current_year      = date('Y');
        	$port_state        =$cruisett_state;// "Italy";
        	$port              =$cruisett_port; // "733-Venice";//CruiseTT code
        
         
            if($ships_db_grabbed){
                $ships_db_grabbed=true; 
            	echo "<br><br><b>****Grab Ships database</b><br><br>";
            	$ships_data    =grabShipsDataFromCruisett($fb,$default_ship_capacity);
            	print_r($ships_data);
            }
            
        	echo "<br><br><b>****Load ships in port: $port Month: $current_month ($current_month_num) Year: $current_year </b><br><br>" ;
        	$ship_arrivals1 =grabShipsInPortsFromCruisett($port_state,$port,$current_year, $current_month,$current_month_num);
        
         	$current_month     = date('M', strtotime('+1 month'));
         	$current_month_num = date('m', strtotime('+1 month'));
        	echo "<br><br><b>****Load ships in port: $port Month: $current_month ($current_month_num) Year: $current_year </b><br><br>";
        	$ship_arrivals2 =grabShipsInPortsFromCruisett($port_state,$port,$current_year, $current_month,$current_month_num);
        	
        	//Merge arrays
        	foreach($ship_arrivals2[$port] AS $DAY=>$VAL)
        	    $ship_arrivals1[$port][$DAY] = $VAL;
        	
        	//Get cruisett ships database for crew data
        	$DBSHIPS_CTT_JSON=$fb->get('/dashboard/ships/cruisett_vessels'); 
        	$DBSHIPS_CTT     = json_decode($DBSHIPS_CTT_JSON,true);
         
         
        	//Prepare this and next week array
        	echo "<br><br><b>****STATISTICS CALC</b><br><br>";
            $TODAY_SHIPS_WIKI_CREWS          =array();
            $TODAY_SHIPS_WIKI_PASS           =array();
        	$OVERNIGHT_SHIPS_CAPACITYS  =array();
        	$OVERNIGHT_SHIPS_CAPACITYS_CREW  =array();
        	$OVERNIGHT_SHIPS_CAPACITYS_PASS  =array();
        	$WEEK_OF_YEAR_OVERNIGHTS    =array();
        	$WEEK_OF_YEAR_CAPACITY      =array();
        	$WEEK_SHIPS_COUNT           =array();
        	$OVERNIGHT_SHIPS            =array();
        	echo "<br>++++GET DAILY VALS SUM<br>";
        	for($d=0;$d<30;$d++){
        	    
        	    $t_date                        = date('Ymd', strtotime('+'.$d.' day'));
        	    $t_date_week_of_year           = date('W', strtotime('+'.$d.' day'));
        	    
        	    $t_date_tomorrow  = date('Ymd', strtotime('+'.($d+1).' day'));
        	    
        	    $t_date_DAYOFWEEK = date('w', strtotime('+'.$d.' day'));
        	    
        	    $TODAYDAY_VALS=@$ship_arrivals1[$port][$t_date];
        	    $TOMORROW_VALS=@$ship_arrivals1[$port][$t_date_tomorrow];
        	    echo "<br><br><b>DAY: d:".$t_date. " Week: ".$t_date_week_of_year."</b>";
        	    echo "<br>Today ships: d:".$t_date." port_load:".$TODAYDAY_VALS["port_load"]." count:".$TODAYDAY_VALS["count"]." ships:".$TODAYDAY_VALS["ships"]."<br>";
        	    echo "<br>Tomorrow ships: d:".$t_date_tomorrow." port_load:".$TOMORROW_VALS["port_load"]." count:".$TOMORROW_VALS["count"]." ships:".$TOMORROW_VALS["ships"]."<br>";
        
                if(!is_numeric($OVERNIGHT_SHIPS[$t_date]))
                  $OVERNIGHT_SHIPS[$t_date]=0;
                if(!is_numeric($TODAY_SHIPS_WIKI_CREWS[$t_date]))
                  $TODAY_SHIPS_WIKI_CREWS[$t_date]=0;
                if(!is_numeric($TODAY_SHIPS_WIKI_PASS[$t_date]))
                  $TODAY_SHIPS_WIKI_PASS[$t_date]=0;          
                if(!is_numeric($OVERNIGHT_SHIPS_CAPACITYS[$t_date]))
                  $OVERNIGHT_SHIPS_CAPACITYS[$t_date]=0;
                if(!is_numeric($OVERNIGHT_SHIPS_CAPACITYS_CREW[$t_date]))
                  $OVERNIGHT_SHIPS_CAPACITYS_CREW[$t_date]=0;
                if(!is_numeric($OVERNIGHT_SHIPS_CAPACITYS_PASS[$t_date]))
                  $OVERNIGHT_SHIPS_CAPACITYS_PASS[$t_date]=0;          
                if(!is_numeric($WEEK_OF_YEAR_CAPACITY[$t_date_week_of_year]))
                  $WEEK_OF_YEAR_CAPACITY[$t_date_week_of_year]=0;
                if(!is_numeric($WEEK_OF_YEAR_OVERNIGHTS[$t_date_week_of_year]))
                  $WEEK_OF_YEAR_OVERNIGHTS[$t_date_week_of_year]=0;        
                if(!is_numeric($WEEK_SHIPS_COUNT[$t_date_week_of_year]))
                  $WEEK_SHIPS_COUNT[$t_date_week_of_year]=0;  
                  
        	    if(is_numeric($TODAYDAY_VALS["port_load"])){
        	        
        	        //Full day capacity
        	        $WEEK_OF_YEAR_CAPACITY[$t_date_week_of_year]+=$TODAYDAY_VALS["port_load"];//Weeks total port load
        	        $WEEK_SHIPS_COUNT[$t_date_week_of_year]     +=$TODAYDAY_VALS["count"];//Weeks total ships
        	        
        	        $shipsarr_today   =explode(",",$TODAYDAY_VALS["ships"]);
        	        $shipsarr_tomorrow=explode(",",$TOMORROW_VALS["ships"]);
        	        echo "<br>Today ships array<br>";
        	        print_r($shipsarr_today);
        	        echo "<br>Tomorrow ships array<br>";
        	        print_r($shipsarr_tomorrow);
        	        
        	        //Crew totals from wikipedia grabbed data...
        	       
        	        foreach($shipsarr_today AS $IND1=>$SHIP1){
        	       
        	            $DBSHIP_DATA_CTT      =$DBSHIPS_CTT[strtolower(@trim($SHIP1))];
        	            $DB_SHIP_CAPACITY_TOT=@$DBSHIP_DATA_CTT["ship_capacity"];
        	            $DB_SHIP_CREW_TOT    =@$DBSHIP_DATA_CTT["ship_crew"];
        	            $DB_SHIP_PASS_TOT    =@$DBSHIP_DATA_CTT["ship_passengers"];
        	            echo "<br> Today ship:".@$SHIP1." Ship capacity ctt:".$DB_SHIP_CAPACITY_TOT ." CrewFromWiki:$DB_SHIP_CREW_TOT PassFromWiki:$DB_SHIP_PASS_TOT";
        	            
        	            $TODAY_SHIPS_WIKI_CREWS[$t_date]+=@$DB_SHIP_CREW_TOT;
        	            $TODAY_SHIPS_WIKI_PASS[$t_date] +=@$DB_SHIP_PASS_TOT;
        	            
        
        	        }
        	        
        	        //Overnight day capacity
        	        if(count ($shipsarr_today)>0)
        	        foreach($shipsarr_today AS $IND1=>$SHIP1){
        	          $SHIP1=trim($SHIP1);
        	          
        	          $DBSHIP_DATA_CTT      =$DBSHIPS_CTT[strtolower($SHIP1)];
        	          $DB_SHIP_CAPACITY_TOT=@$DBSHIP_DATA_CTT["ship_capacity"];
        	          $DB_SHIP_CREW_TOT    =@$DBSHIP_DATA_CTT["ship_crew"];
        	          $DB_SHIP_PASS_TOT    =@$DBSHIP_DATA_CTT["ship_passengers"];
        	          if(count($shipsarr_tomorrow)>0) 
        	          foreach($shipsarr_tomorrow AS $IND2=>$SHIP2){
        	              $SHIP2=trim($SHIP2);
        	              //echo " <br>Check $SHIP1 ? $SHIP2 =".strcmp($SHIP1, $SHIP2) ;
        	             
        	             if (strcmp($SHIP1, $SHIP2) ==0 && strlen($SHIP1)>2 && strlen($SHIP2)>2) {//Todays ship leavs tomorrow 
        	               
        	               echo "<br> Overnight ship:".$SHIP1." Ship load:".$DB_SHIP_CAPACITY_TOT;
        	               
        	               
        	               $OVERNIGHT_SHIPS[$t_date]++;
        	               $OVERNIGHT_SHIPS_CAPACITYS[$t_date]      +=$DB_SHIP_CAPACITY_TOT;
        	               $OVERNIGHT_SHIPS_CAPACITYS_CREW[$t_date] +=@$DB_SHIP_CREW_TOT;
        	               $OVERNIGHT_SHIPS_CAPACITYS_PASS[$t_date] +=@$DB_SHIP_PASS_TOT;
        	            
        	               $WEEK_OF_YEAR_OVERNIGHTS[$t_date_week_of_year] +=$DB_SHIP_CAPACITY_TOT;//Weeks overnight port load
        	             }
        	          }
        	        }  
        	        
        	        
        	    }//Today overnights
         
        	    
        	}
        	
        	//Set next week expected totals
        	echo "<br>++++GET TOTALS<br>";
        	$EVERYDAY_TOTALS=array();
        	for($d=0;$d<30;$d++){
        	    $t_date                        = date('Ymd', strtotime('+'.$d.' day'));
        	    $t_date_week_of_year           = date('W', strtotime('+'.$d.' day')); 
        	    $t_date_week_of_year++;
        	    $TODAYDAY_VALS=@$ship_arrivals1[$port][$t_date];
        	    
        	    echo "<br><br>EVERYDAY TOTALS: d:".$t_date. " Week: ".$t_date_week_of_year."</b>";
        	    echo "<br> Today overnight ships:".$OVERNIGHT_SHIPS[$t_date]. " Capacity:".$OVERNIGHT_SHIPS_CAPACITYS[$t_date]." Pass/Crew: ". 
        	          $OVERNIGHT_SHIPS_CAPACITYS_PASS[$t_date] ."/".$OVERNIGHT_SHIPS_CAPACITYS_CREW[$t_date].
        	          " Today total capacity:".$TODAYDAY_VALS["port_load"];
        	    echo "<br> Today WikiCrewTotals:".$TODAY_SHIPS_WIKI_CREWS[$t_date]." Today WikiPassTotals:".$TODAY_SHIPS_WIKI_PASS[$t_date] ;
        	            
        	    echo "<br> Next Week Ships:".$WEEK_SHIPS_COUNT[$t_date_week_of_year]."  Next Week Totals:".$WEEK_OF_YEAR_CAPACITY[$t_date_week_of_year]." Next Week Overnights:".$WEEK_OF_YEAR_OVERNIGHTS[$t_date_week_of_year];
          
                //Merge to db data
                $ship_arrivals1[$port][$t_date]["passengers"]          =$TODAY_SHIPS_WIKI_PASS[$t_date];
                $ship_arrivals1[$port][$t_date]["crews"]               =$TODAY_SHIPS_WIKI_CREWS[$t_date];
                $ship_arrivals1[$port][$t_date]["overnight_ships"]      =$OVERNIGHT_SHIPS[$t_date];
                $ship_arrivals1[$port][$t_date]["overnight_load"]      =$OVERNIGHT_SHIPS_CAPACITYS[$t_date];
                $ship_arrivals1[$port][$t_date]["overnight_load_crews"] =$OVERNIGHT_SHIPS_CAPACITYS_CREW[$t_date];
                $ship_arrivals1[$port][$t_date]["overnight_load_pass"]  =$OVERNIGHT_SHIPS_CAPACITYS_PASS[$t_date];
                $ship_arrivals1[$port][$t_date]["next_week_totals"]    =$WEEK_OF_YEAR_CAPACITY[$t_date_week_of_year];
                $ship_arrivals1[$port][$t_date]["next_week_overnights"]=$WEEK_OF_YEAR_OVERNIGHTS[$t_date_week_of_year];
                $ship_arrivals1[$port][$t_date]["next_week_ships"]     =$WEEK_SHIPS_COUNT[$t_date_week_of_year];
         
        	}
        	
        	
        	
        	//UPDATE SHIP ARRIVALS 
        	$fb->update('/dashboard/ships/cruisett_arrivals', $ship_arrivals1);
	
	
         
             
        }//Widgets
         
     }//Dashes
 
	/*
	 ********* 
	 FUNCTIONS
	 *********
	*/	
		
	function grabShipsInPortsFromCruisett($port_state,$port,$current_year, $current_month,$current_month_num) {

        $ship_arrivals=array();
        $ship_arrivals[$port]=array();
		$url = "http://ports.cruisett.com/schedule/".$port_state."/".$port."/".$current_month."_".$current_year."/";
		
		echo "<br>Url:".$url ;
		
		$html_contents = @file_get_contents($url);
		$DOM = new DOMDocument;
		$DOM->loadHTML($html_contents);

		$items = $DOM->getElementsByTagName('table');
		
		//print_r($items);
			
		$rows = $DOM->getElementsByTagName("tr");
        for ($i = 0; $i < $rows->length; $i++) {
            $cols = $rows->item($i)->getElementsbyTagName("td");
            for ($j = 0; $j < $cols->length; $j++) {
                
                
                $val  = @trim($cols->item($j)->nodeValue);
                $cont = $cols->item($j)->textContent;
                //echo   "<br>VAL:$val"; 
                
                if (preg_match("/\d{2}\-\w+-\d{2}/", $val)){//01-May-15
                  
                  $date_split =  explode("-",$val);
                  $val = @trim($current_year). @trim($current_month_num) . @trim($date_split[0]);
                  
                  echo "<br>DAY:".$val ;
                  
                  $port_load =$cols->item($j+1)->nodeValue;
                  if(is_numeric($port_load )){
                      $ships      = $cols->item($j+2)->nodeValue;
                      $ship_links = $cols->item($j+2)->getElementsByTagName("a");
                      
                      foreach ($ship_links as $link) {
                        $href = $link->getAttribute('href');
                        //echo "<br>LINKS:".$href ;
                      }
                        
                      $ships_count=count(@explode( ',', $ships ));
                      
                      $ship_arrivals[ $port][$val]=array();
                      $ship_arrivals[ $port][$val]["port_load"]=$port_load;
                      $ship_arrivals[ $port][$val]["ships"]    =$ships;
                      $ship_arrivals[ $port][$val]["count"]    =$ships_count;
                      
                      echo "<br>FOUND $val :";
                       
                      print_r($ship_arrivals[ $port][$val]);
                  }else{
                      $ship_arrivals[ $port][$val]=array();
                      $ship_arrivals[ $port][$val]["port_load"]=0;
                      $ship_arrivals[ $port][$val]["ships"]    =0;
                      $ship_arrivals[ $port][$val]["count"]    =0;   
                  }
                }  
                    
            }
            echo "\n";
        }
    		
		
		 
		return $ship_arrivals;
	}
	
	
	
	
	
	function grabShipsDataFromCruisett($fb,$default_ship_capacity,$DB_SHIPS){
	  
	    $debug=false;
	  
	    //Get current sihps array
	    $DB_SHIPS      = $fb->get('/dashboard/ships/cruisett_vessels/');
	    $DB_SHIPS_JSON = json_decode($DB_SHIPS,true); 
    	//print_r($DB_SHIPS_JSON);
	
	
        $ships_data=array(); 
		$url = "http://ships.cruisett.com/";
		
		echo "<br>Vessel url:".$url ;
		
		$html_contents = @file_get_contents($url);
		$DOM = new DOMDocument;
		$DOM->loadHTML($html_contents);

		$items = $DOM->getElementsByTagName('table');
		 
			
		$rows = $DOM->getElementsByTagName("tr");
        for ($i = 0; $i < $rows->length; $i++) {
            $cols = $rows->item($i)->getElementsbyTagName("td");
            echo "<br>**NEW SHIP";
            
            $SHIP_DATA=array();
            $SHIP_DATA['ship_img'] ="";
            $SHIP_DATA['ship_link']="";
            $SHIP_DATA['ship_capacity']="";
            $SHIP_DATA['ship_name']="";
            
            for ($j = 0; $j < $cols->length; $j++) { 
              
                $val  = @trim($cols->item($j)->nodeValue);
                $cont = $cols->item($j)->textContent;
                //echo   "<br>VAL($i,$j):$val";  
                
                $SHIP_DATA['ship_name']=strtolower(@trim($val));
                
                $IMG= $cols->item($j)->getElementsByTagName('img');
                if($IMG->length>0){
                      $ship_img_src= (@trim($IMG->item(0)->getAttribute('src'))); 
                      echo "<br>IMAGE:$ship_img_src";
                      $SHIP_DATA['ship_img']=$ship_img_src;
                }

                $HREF= $cols->item($j)->getElementsByTagName('a');
                if($IMG->length>0){
                      $ship_href=(@trim($HREF->item(0)->getAttribute('href'))); 
                      echo "<br>LINK:$ship_href";
                      $SHIP_DATA['ship_link']=$ship_href;
                }
                
                if(strlen($SHIP_DATA['ship_link'])>3){
                  
                      //Check vessel in database
                      if(isset($DB_SHIPS_JSON[$SHIP_DATA['ship_name']]) 
                         && @$DB_SHIPS_JSON[$SHIP_DATA['ship_name']]["ship_capacity"] > 1
                         ){
                         echo "<br>Vessel is present in database with capacity:".@$DB_SHIPS_JSON[$SHIP_DATA['ship_name']]["ship_capacity"];
                         $ships_data[$SHIP_DATA['ship_name']]= $DB_SHIPS_JSON[$SHIP_DATA['ship_name']]; 
                      }else{
                        
                  
                       //Grab ship schedule
                       $ship_capacity=grabShipsCapacityFromCruisett($SHIP_DATA['ship_link']);
 
                       if($ship_capacity<2)  { 
                         $ship_capacity=$default_ship_capacity;
                        }
                         
                         $SHIP_DATA['ship_capacity'] =$ship_capacity;  
                         echo "<br>CAPACITY:". $SHIP_DATA['ship_capacity'];
                           
                         $ships_data[$SHIP_DATA['ship_name']]= $SHIP_DATA;   
                  	    
                  	    //Update database
                  	    $dburl='/dashboard/ships/cruisett_vessels/'. urlencode($SHIP_DATA['ship_name'])."/";
                  	    echo "<br>Save ship in $dburl";
                  	    $fb->update($dburl, $SHIP_DATA); 
                  	    
                  	    flush();
                  	    ob_flush() ;
                      }
                  
                }//ship link
                
               if($debug && $j==3)
                  break;
                 
            }//j
            
            if($debug && $i==2)
               break;
               
            echo "\n";
        }//i
    		
		
		 
		return $ships_data;
	}
	
	
	function grabShipsCapacityFromCruisett($ship_link){
	  
        $ships_capacity=-1; 
		
		echo "<br>Grab ships capacity..." ;
		
		$html_contents = @file_get_contents($ship_link);
		$DOM2 = new DOMDocument;
		$DOM2->loadHTML($html_contents);

		$tables= $DOM2->getElementsByTagName('table');
		$table = $tables->item(1);
		
		//print_r($items);
			
		$rows = $table->getElementsByTagName("tr");
        for ($i = 1; $i < $rows->length; $i++) {
            $cols = $rows->item($i)->getElementsbyTagName("td");
           // echo "<br>__row $i cols:".$cols->length;
            
            $PORT_LOAD ="";
            $HAS_OTHERS=true;
            
            for ($j = 0; $j < $cols->length; $j++) {
                
                $val  = @trim($cols->item($j)->nodeValue);
                $cont = $cols->item($j)->textContent;
                //echo   "<br>VAL($i,$j):$val";  
                
                if( $j ==3){
                  $PORT_LOAD=$val; 
                }
                if( $j ==4){
                  
                  if(strlen($val)<2){
                   $HAS_OTHERS=false;
                  }
                  
                }                
            }//cols
            
            if(!$HAS_OTHERS && is_numeric($PORT_LOAD)){
              echo "<br> Has others? ".$HAS_OTHERS." Port Load:$PORT_LOAD"; 
              $ships_capacity= $PORT_LOAD;
              break;
            }
            
            
          
       }//for tr
	
	  return $ships_capacity;
	}
	

 	
?>
