<?php

    require_once './lib/firebaseLib.php';
    date_default_timezone_set('CET');    
     
   	$url = 'https://venicedata.firebaseio.com/';
	$fb_reader = new fireBase($url);
	
	// setup date
	$now = getdate();
	print_r($now);
    $day = $now['mday'];
    if (strlen($day) == 1)
        $day = '0'.$day;
    $mon = $now['mon'];
    if (strlen($mon) == 1)
        $mon = '0'.$mon;   
    
    $data = $now['year'].$mon.$day;
    
    $nowtime = date('H:i');
    if ($nowtime[0] == '0') $nowtime = str_replace(':', '',substr($nowtime,1));
    else $nowtime = str_replace(':', '',$nowtime);
    
    
    // hour multiplicator scaler
    $multFactor = $now['hours'] / 24;

    
    
    //datasources
    
    //****** venice_tourists_config
    $config = json_decode($fb_reader->get('/dashboard/venice_tourists_config'),true);    
    
    //**** AIR?PORT DATA
    $airports = array();
    $airports['vce'] = array();
    $airports['tsf'] = array();
    
    $airports['vce']['arrivals'] = $fb_reader->get('/dashboard/airport_data/IT_VCE/passenger_ref');
    $airports['tsf']['arrivals'] = $fb_reader->get('/dashboard/airport_data/IT_TSF/passenger_ref');

    
    
    //**** cruiseTT 
    $city_key_cruisett     ='733-Venice';
    echo '/dashboard/ships/cruisett_arrivals/'.$city_key_cruisett.'/'.$data.'/';
    $cuiseTT = json_decode($fb_reader->get('/dashboard/ships/cruisett_arrivals/'.$city_key_cruisett.'/'.$data.'/'),true);    

     if(@$cuiseTT["port_load"]>0 && @$cuiseTT["passengers"]<=0 ){ 
       //4%
       $cuiseTT["crews"] = $cuiseTT["port_load"]/100 * 4;  
       $cuiseTT["passengers"] = $cuiseTT["crews"]; 
     }
     if( @$cuiseTT["overnight_ships"] > 0 && @$cuiseTT["overnight_load_pass"]<=0){
        if(@$cuiseTT["overnight_load"]>0){
            $cuiseTT["overnight_load_crews"] = $cuiseTT["overnight_load"]/100 * 4;
            $cuiseTT["overnight_load_pass"] = $cuiseTT["overnight_load"]-$cuiseTT["overnight_load_crews"];
        }
     }
     if( @$cuiseTT["crews"] < @$cuiseTT["overnight_load_crews"]){
        //Inconsistent data 
        $cuiseTT["crews"]=$cuiseTT["overnight_load_crews"]; 
     }
    $cuiseTT["total_daytrips"]     =  $cuiseTT["crews"]+ $cuiseTT["port_load"];
    $cuiseTT["total_overnyghts"]   =  $cuiseTT["overnight_load_crews"]+ $cuiseTT["overnight_load"];
    
    print_r($cuiseTT);
    
    //****** TRAINS 
    $trainz = $fb_reader->get('/dashboard/venice_trains/trains');
   // print_r($trains);
    
    $train_arrivals = 0;
    $trains =  json_decode($trainz, true);
    
    foreach ($trains as $index => $train){
        if ($index < $nowtime){
            $train_arrivals = $train['arrived_so_far'];
        }
    }
    
    /*
							$scope.tourists = Math.round(value.arrived_so_far * PERCENT_TOURISTS);
							$scope.daytrippers = Math.round(value.arrived_so_far * PERCENT_DAYTRIPPERS);
							$scope.overnighters = Math.round(value.arrived_so_far * PERCENT_OVERNIGHTERS);
							$scope.commuters = Math.round(value.arrived_so_far * PERCENT_COMMUTERS);    
    */
    
    // train parameters
    $PERCENT_DAYTRIPPERS = 0.49623167;
    $PERCENT_OVERNIGHTERS = 0.05181931;
    $PERCENT_TOURISTS = $PERCENT_DAYTRIPPERS + $PERCENT_OVERNIGHTERS;
    




    // HOTELS
    $hotels = json_decode($fb_reader->get('/hotels/'.$now['year'].'/'.$mon.'/'.$day),true);    
    $avg_beds_for_room = 3;
    $free_zero_today = $hotels['0']['booking']['libere']*$avg_beds_for_room;
    $free_one_today = $hotels['1']['booking']['libere']*$avg_beds_for_room;
    $free_two_today = $hotels['2']['booking']['libere']*$avg_beds_for_room;
    $free_three_today = $hotels['3']['booking']['libere']*$avg_beds_for_room;
    $free_four_today = $hotels['4']['booking']['libere']*$avg_beds_for_room;
    $free_five_today = $hotels['5']['booking']['libere']*$avg_beds_for_room;
    
    $free_hostels_today = $hotels['hostels']['posti_liberi'];
    
    /*
    			var location="Venezia, VE"; 
			var fb_url="airbnb/"+location+"/stats/last_update/";    
			
			ckconfig.dat_fb.child(fb_url).on('value', function(myVal){
				var val = myVal.val();
				val.rooms_price_per_night_avg = Math.round(val.rooms_price_per_night_avg);
				
				var others = val.city_total_rooms_est - val.neighborhood_rooms_total;
				val.totalRooms = Math.round(val.city_total_rooms_est - others);
				val.bookedRooms = Math.round((val.city_total_rooms_est - val.neighborhood_rooms_total) * 0.8 - others + val.neighborhood_rooms_total_diff);
    */
    
    $place = "Venezia, VE"; 
    $airbnb = json_decode($fb_reader->get('/dashboard/airbnb/'.urlencode($place).'/stats/last_update/'),true);   
    echo 'CIOA';
    //print_r($airbnb);
    //exit;
    $airbnb_others = $airbnb['city_total_rooms_est'] - $airbnb['neighborhood_rooms_total'];
    $airbnb_bookedRooms = intval(($airbnb['city_total_rooms_est'] - $airbnb['neighborhood_rooms_total']) * 0.8 - $airbnb_others + $airbnb['neighborhood_rooms_total_diff']);
    $airbnb_overnights = intval($airbnb_bookedRooms * 2.4); // 2.4 letti per camera
    
    echo 'AIRBNB booked '.$airbnb_bookedRooms;
    
    //exit;

    $overnights = 33000 - ($free_zero_today + $free_one_today + $free_two_today + $free_three_today + $free_four_today + $free_five_today + $free_hostels_today);
    //scale down hour mult
    $overnights_all_day = $overnights + $airbnb_overnights;
    
    $overnights = $multFactor * ($overnights + $airbnb_overnights);
//    echo 'OVERNIGHTS '.$overnights."\n";


    // AUTO, COACH and BUS
    // estimated hotels
    /*$estimated_hotels = $config['hotel_max_occupancy']*
        $config['month_weight'][$now['mon']]*
        $config['day_weight'][$now['wday']];*/
    // to be fixed with booking  airbnb
    //echo $estimated_hotels;
    $estimated_hotels = $overnights;



    $tourist_arrivals = array();
    
    $tourist_arrivals['air'] = array();
    $tourist_arrivals['train'] = array();
    $tourist_arrivals['auto'] = array();
    $tourist_arrivals['coach'] = array();
    $tourist_arrivals['bus'] = array();
    $tourist_arrivals['cruise'] = array();
    $tourist_arrivals['boat'] = array();
    $tourist_arrivals['total'] = array();
    $tourist_arrivals['all_day'] = array();
    $tourist_arrivals['all_day']['overnight'] = intval($overnights_all_day);
    
    
    
    
    
    $tourist_arrivals['air']['tot'] = intval(($airports['vce']['arrivals'] + $airports['tsf']['arrivals'])*.64);
    $tourist_arrivals['air']['ove'] = $tourist_arrivals['air']['tot'];
    $tourist_arrivals['air']['day'] = 0;
    
    
    echo 'AIR TOTAL '.$tourist_arrivals['air']['tot'];


    $tourist_arrivals['train']['tot'] = intval($train_arrivals*$PERCENT_TOURISTS);
    $tourist_arrivals['train']['ove'] = intval($train_arrivals*$PERCENT_OVERNIGHTERS);
    $tourist_arrivals['train']['day'] = intval($train_arrivals*$PERCENT_DAYTRIPPERS);    

    
    $tourist_arrivals['auto']['ove'] = intval($config['auto_ove_weight'] * $estimated_hotels);
    $tourist_arrivals['auto']['day'] = intval($config['auto_day_weight'] * $tourist_arrivals['auto']['ove']);   
    $tourist_arrivals['auto']['tot'] = $tourist_arrivals['auto']['ove']  + $tourist_arrivals['auto']['day'];
    
    echo 'AUTO WEIGHT '.$config['auto_day_weight'];
    print_r($tourist_arrivals['auto']);
    
    echo 'AUTO OVERNIGHTS CONFIG '.$config['auto_ove_weight']."\n";
    echo 'AUTO OVERNIGHTS EST HOTELS  '.$estimated_hotels."\n";
    //exit;
    
   
    $tourist_arrivals['coach']['ove'] = $config['coach_ove_weight'] * $estimated_hotels;
    $tourist_arrivals['coach']['day'] = $config['coach_day_weight'] * $tourist_arrivals['coach']['ove'];   
    $tourist_arrivals['coach']['tot'] = $tourist_arrivals['coach']['ove']  + $tourist_arrivals['coach']['day'];
 
    
    $tourist_arrivals['bus']['ove'] = intval($config['bus_ove_weight'] * $estimated_hotels);
    $tourist_arrivals['bus']['day'] = $config['bus_day_weight'] * $tourist_arrivals['bus']['ove'];   
    $tourist_arrivals['bus']['tot'] = $tourist_arrivals['bus']['ove']  + $tourist_arrivals['bus']['day'];
  
    
 
   
    $tourist_arrivals['cruise']['day'] = $cuiseTT["total_daytrips"];  
    $tourist_arrivals['cruise']['ove'] = $cuiseTT["total_overnyghts"] ;
    $tourist_arrivals['cruise']['tot'] = $cuiseTT["total_overnyghts"]+$cuiseTT["total_daytrips"];
    //$tourist_arrivals['cruise']['ove'] = $tourist_arrivals['cruise']['tot']-$cuiseTT["total_daytrips"];
        
        
    $tourist_arrivals['boat']['ove'] = 0;
    
    //$tourist_arrivals['train']['day'] = intval($config['train_day_weight'] * $tourist_arrivals['train']['ove'] * 1.15);
    $tourist_arrivals['auto']['day'] = intval($config['auto_day_weight'] * $tourist_arrivals['auto']['ove']);
    $tourist_arrivals['coach']['day'] = intval($config['coach_day_weight'] * $tourist_arrivals['coach']['ove']);
    $tourist_arrivals['bus']['day'] = intval($config['bus_day_weight'] * $tourist_arrivals['bus']['ove'] * 1.15);
    
    $tourist_arrivals['boat']['day'] = $config['boat_day_weight'] * (
                                        $tourist_arrivals['train']['day'] +
                                        $tourist_arrivals['auto']['day'] + 
                                        $tourist_arrivals['coach']['day'] + 
                                        $tourist_arrivals['bus']['day']
                                        ); 
                                        
    echo ("\n".'VTESTBOAT CONF ' .$config['boat_day_weight']);
    echo ("\n".'VTESTBOAT TRAIN ' .$tourist_arrivals['train']['day']);
    echo ("\n".'VTESTBOAT AUTO ' .$tourist_arrivals['auto']['day'] );
    echo ("\n".'VTESTBOAT COACH ' .$tourist_arrivals['coach']['day']);
    echo ("\n".'VTESTBOAT BUS ' .$tourist_arrivals['bus']['day']);
    
                                        
    //$tourist_arrivals['train']['tot'] = intval((1 + $config['train_tot_weight']) * $tourist_arrivals['train']['ove'] + $tourist_arrivals['train']['day']);
    $tourist_arrivals['auto']['tot'] = intval((1 + $config['coach_tot_weight']) * $tourist_arrivals['auto']['ove'] + $tourist_arrivals['auto']['day']);
    $tourist_arrivals['coach']['tot'] = intval((1 + $config['coach_tot_weight']) * $tourist_arrivals['coach']['ove'] + $tourist_arrivals['coach']['day']);
    $tourist_arrivals['bus']['tot'] = intval((1 + $config['bus_tot_weight']) * $tourist_arrivals['bus']['ove'] + $tourist_arrivals['bus']['day']);
    $tourist_arrivals['boat']['tot'] = $tourist_arrivals['boat']['day'];
    
    $tourist_arrivals['total']['tot'] = $tourist_arrivals['air']['tot'] +
                                        $tourist_arrivals['cruise']['tot'] +
                                        $tourist_arrivals['train']['tot']+
                                        $tourist_arrivals['auto']['tot']+
                                        $tourist_arrivals['coach']['tot']+
                                        $tourist_arrivals['bus']['tot']+
                                        $tourist_arrivals['boat']['tot'];
                                        
                                        
    $tourist_arrivals['total']['ove'] =  $tourist_arrivals['air']['ove'] +
                                        $tourist_arrivals['cruise']['ove'] +
                                        $tourist_arrivals['train']['ove']+
                                        $tourist_arrivals['auto']['ove']+
                                        $tourist_arrivals['coach']['ove']+
                                        $tourist_arrivals['bus']['ove']+
                                        $tourist_arrivals['boat']['ove'];
                                        
    echo 'TOTAL OVE : '.   $tourist_arrivals['total']['ove'];                                   
                                        
                                        
    $tourist_arrivals['total']['day'] = $tourist_arrivals['air']['day'] +
                                        $tourist_arrivals['cruise']['day'] +
                                        $tourist_arrivals['train']['day']+
                                        $tourist_arrivals['auto']['day']+
                                        $tourist_arrivals['coach']['day']+
                                        $tourist_arrivals['bus']['day']+
                                        $tourist_arrivals['boat']['day']; 
                    
                    
                                        
    $orig_tot_ove = $tourist_arrivals['total']['ove'] - 
                    $tourist_arrivals['air']['ove'] - 
                    $tourist_arrivals['cruise']['ove'];
                    
    $tot_ove = intval($overnights * 0.7);
    $perc = ($tot_ove - 
            $tourist_arrivals['air']['ove'] - 
            $tourist_arrivals['cruise']['ove']) / $orig_tot_ove;
            
    echo "\n PERC ".$perc;

     /*         
    $tourist_arrivals['train']['ove'] =  intval($tourist_arrivals['train']['ove'] * $perc);
    $tourist_arrivals['auto']['ove'] =  intval($tourist_arrivals['auto']['ove'] * $perc);
    $tourist_arrivals['coach']['ove'] =  intval($tourist_arrivals['coach']['ove'] * $perc);
    $tourist_arrivals['bus']['ove'] =  intval($tourist_arrivals['bus']['ove'] * $perc);
    $tourist_arrivals['boat']['ove'] =  intval($tourist_arrivals['boat']['ove'] * $perc);
    */
    
    
    //$tourist_arrivals['train']['tot'] = intval($tourist_arrivals['train']['tot'] * $multFactor);
    //$tourist_arrivals['train']['ove'] = intval($tourist_arrivals['train']['ove'] * $multFactor);
    //$tourist_arrivals['train']['day'] = intval($tourist_arrivals['train']['day'] * $multFactor);

    $tourist_arrivals['auto']['tot'] = intval($tourist_arrivals['auto']['tot'] * $multFactor);
    $tourist_arrivals['auto']['ove'] = intval($tourist_arrivals['auto']['ove'] * $multFactor);
    $tourist_arrivals['auto']['day'] = intval($tourist_arrivals['auto']['day'] * $multFactor);

    $tourist_arrivals['coach']['tot'] = intval($tourist_arrivals['coach']['tot'] * $multFactor);
    $tourist_arrivals['coach']['ove'] = intval($tourist_arrivals['coach']['ove'] * $multFactor);
    $tourist_arrivals['coach']['day'] = intval($tourist_arrivals['coach']['day'] * $multFactor);

    $tourist_arrivals['bus']['tot'] = intval($tourist_arrivals['bus']['tot'] * $multFactor);
    $tourist_arrivals['bus']['ove'] = intval($tourist_arrivals['bus']['ove'] * $multFactor);
    $tourist_arrivals['bus']['day'] = intval($tourist_arrivals['bus']['day'] * $multFactor);
  
    $tourist_arrivals['cruise']['tot'] = intval($tourist_arrivals['cruise']['tot'] );//ISSO
    $tourist_arrivals['cruise']['ove'] = intval($tourist_arrivals['cruise']['ove'] );
    $tourist_arrivals['cruise']['day'] = intval($tourist_arrivals['cruise']['day'] );
    
    //$tourist_arrivals['boat']['tot'] = intval($tourist_arrivals['boat']['tot'] * $multFactor);
    $tourist_arrivals['boat']['ove'] = intval($tourist_arrivals['boat']['ove'] * $multFactor);
    $tourist_arrivals['boat']['day'] = intval($tourist_arrivals['boat']['day'] * $multFactor);    

    //$tourist_arrivals['total']['tot'] = intval($tourist_arrivals['total']['tot'] * $multFactor);
    //$tourist_arrivals['total']['ove'] = intval($tourist_arrivals['total']['ove'] * $multFactor);
    //$tourist_arrivals['total']['day'] = intval($tourist_arrivals['total']['day'] * $multFactor);  
    //$tourist_arrivals['total']['tot'] = intval($tourist_arrivals['total']['tot']);
    //$tourist_arrivals['total']['ove'] = intval($tourist_arrivals['total']['ove']);
    //$tourist_arrivals['total']['day'] = intval($tourist_arrivals['total']['day']);
    
    

                                        
                                        
    $tourist_arrivals['total']['ove'] =  $tourist_arrivals['air']['ove'] +
                                        $tourist_arrivals['cruise']['ove'] +
                                        $tourist_arrivals['train']['ove']+
                                        $tourist_arrivals['auto']['ove']+
                                        $tourist_arrivals['coach']['ove']+
                                        $tourist_arrivals['bus']['ove']+
                                        $tourist_arrivals['boat']['ove'];
                                        
    echo 'TOTAL OVE : '.   $tourist_arrivals['total']['ove'];                                   
                                        
                                        
    $tourist_arrivals['total']['day'] = $tourist_arrivals['air']['day'] +
                                        $tourist_arrivals['cruise']['day'] +
                                        $tourist_arrivals['train']['day']+
                                        $tourist_arrivals['auto']['day']+
                                        $tourist_arrivals['coach']['day']+
                                        $tourist_arrivals['bus']['day']+
                                        $tourist_arrivals['boat']['day']; 
                    
    $tourist_arrivals['total']['tot'] = $tourist_arrivals['total']['ove'] + $tourist_arrivals['total']['day'] ;
                    
    /* eND EXPERIMENTAL rEWRITE */                              
    
    
    print_r($tourist_arrivals);
    
   // echo $data;
    $url = 'https://venicedata.firebaseio.com/';
    $key = 'gG1wZ2oyUxca6Rro3XYsXaKH9ODG7nrKEUqVujWm';
    $fb_writer = new fireBase($url, $key);    
    $fb_writer->set('/dashboard/tourist_arrivals/data/'.$data,$tourist_arrivals);
    $fb_writer->set('/dashboard/tourist_arrivals/data/now',$tourist_arrivals);
    
	//	$fb->update($dburl, $newform[$ora.$min]); 


?>