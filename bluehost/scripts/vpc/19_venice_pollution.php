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
	
 
    $today    =$current_year.$current_month.$current_day;
    
	echo "<br>************************************************************************";
	echo "<br>*************** GRAB VENICE POLLUTION  ***********";
	echo "<br>***************                 $today       ***********";
	echo "<br>************************************************************************"; 
	

    //Get current sihps array
	$POLLUTION_VALUES      = array();
	
	$POLLUTION_VALUES["conc_o3_max8h"]  ="0";
	$POLLUTION_VALUES["conc_pm10_max"]  ="0";
	
	//Fetch values from arpa
	$search_url     ="https://www.arpa.veneto.it/arpavinforma/bollettini/aria/aria_dati_validati.php?provincia=Venezia";
    $arpa_domdoc    = getByCurl($search_url,false,true); 
 
    $rows = $arpa_domdoc->getElementsByTagName("tr");
    for ($i = 0; $i < $rows->length; $i++) { 
        
      $rval       = @trim($rows->item($i)->nodeValue);
      $rcont      = $rows->item($i)->textContent;
      if (strpos($rcont,'Fisola') !== false && $i==6) {
    
          $cols = $rows->item($i)->getElementsbyTagName("td");
          
          /*
          
            row(6,1):VE - Sacca Fisola VAL:VE - Sacca Fisola
            row(6,2):BU VAL:BU
            row(6,3):58 VAL:58
            row(6,4):1 VAL:1
            row(6,5):- VAL:-
            row(6,6):44 VAL:44  //MAX PM10
            row(6,7):25 VAL:25
            row(6,8):195 VAL:195
            row(6,9):13 VAL:13
            row(6,10):182 VAL:182  //max giorn. media mob. 8h
            row(6,11):9 VAL:9
            row(6,12):3 VAL:3
            row(6,13):- VAL:-
            row(6,14): VAL:
            row(6,15): VAL:
          */
             $POLLUTION_VALUES["conc_pm10_max"]  = @trim($cols->item(6)->nodeValue); 
             $POLLUTION_VALUES["conc_o3_max8h"]  = @trim($cols->item(10)->nodeValue); 
          
      }
    }
        

	echo "<br><br><b>RESULT POLLUTION_VALUES::</b><br>";
	print_r($POLLUTION_VALUES);
	    
	    
    $firebase_url='dashboard/venice_pollution/todays/' .$today.'/';
    echo "<br><br><b>Save to path firebase:::$firebase_url</b><br>";
    $fb->set($firebase_url, $POLLUTION_VALUES);  


	echo "<br><br>"; 
	echo "<br><br>********************************* PROCEDURE FINISHED *************************************";
	echo "<br><br>"; 
 
 
 
  //HELPER FUNCTIONS
   //curl request returns json output via json_decode php function
    function getByCurl($url,$json=false,$domdoc=false){
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
    	 
    	if($json){
         return json_decode($result, true);
    	}
         
         if($domdoc){
            $dom = new DOMDocument();
            $dom->preserveWhiteSpace = false;
            $dom->substituteEntities = true;
            
            if(strlen($result)>10)
             $dom->loadHTML($result);
             
             return $dom;
       }
 
    	return $result;
    }

?>