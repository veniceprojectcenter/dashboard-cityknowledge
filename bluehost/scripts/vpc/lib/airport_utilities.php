<?php

require_once 'Snoopy.class.php';

// TO DO:
// Carrier Name -> Code Converter

function getAirplaneCapacity($carrier_code, $flight_number, $date){

        $url = "";
        $snoopy = new Snoopy;
    	$snoopy->agent = "(Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36)";
    	
    	
    	//scrape airplane information
    	//$req = "http://www.seatguru.com/ajax/findseatmap.php?from=&to=&flightno=1483&carrier=AZ&date=06%2F03%2F2015";
    	$req = "http://www.seatguru.com/ajax/findseatmap.php?from=&to=&flightno=".$flight_number."&carrier=".$carrier_code."&date=".$date;
    //	echo $req;
    //	echo "\n";


    	$snoopy->fetch($req);
    	//print $snoopy->results;
    
	    $DOM = new DOMDocument;
		$DOM->loadHTML($snoopy->results);
				
        $tags = $DOM->getElementsByTagName('table');
        foreach($tags as $tag)
        {
            $tr = $tag->getElementsByTagName('tr');
            foreach($tr as $data)
            {
                $td = $data->getElementsByTagName('td');
                foreach($td as $inner_data)
                {
                    $a = $inner_data->getElementsByTagName('a');
                    foreach($a as $links)
                    {
                        
                        if ($links->hasAttribute( 'href' ))
                        {
                            $url = $links->getAttribute( 'href' ); 
                        }
                        
                    }
                }
            }
        }
        
        // scrape airline information
        $plane_req = "http://www.seatguru.com".$url;
        $snoopy->fetch($plane_req);
        
        $DOM = new DOMDocument;
		$DOM->loadHTML($snoopy->results);
    	//print $snoopy->results;
    	
    	$rows = $DOM->getElementsByTagName("tr");
        $airplane_capacity = 0;
        
	    for ($i = 0; $i < $rows->length; $i++) {
	        $cols = $rows->item($i)->getElementsbyTagName("td");
	        for ($j = 0; $j < $cols->length; $j++) {
	            $val =$cols->item($j)->nodeValue;
	            $cont=$cols->item($j)->textContent;
	            
	            if (strpos($cont,'standard seats') !== false) {
	            	//echo $val;
	            	$tokens = explode(" ", $val);
	            	foreach ($tokens as $key => $value) {
	            	    if (is_numeric($value)){
	            	        //echo "VALUE ".$value;
	            	        $airplane_capacity = $airplane_capacity + $value;
	            	    }
	            	}


				}
	            
	            //echo 'VAL'.$val;
	            //echo 'CONT '.$cont;
	        }
	    }
	    
	    //echo "AIRPLANE CAPACITY: ".$airplane_capacity;
	    return $airplane_capacity;


}

getAirplaneCapacity("Germanwings", "815", "6%2F3%2F2015");

?>