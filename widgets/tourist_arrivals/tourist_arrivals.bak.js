// var passengerRef = new Firebase('https://vpc.firebaseio.com').child('dashboard/flights/passenger_ref');

/*
var passengerRef = ckconfig.dat_fb.child('airport_data');
passengerRef.on('value', function(dataSnap) {
	var airport_arrivals = dataSnap.val();
	
	var venice_arrivals = airport_arrivals.IT_VCE.passenger_ref;
	var treviso_arrivals = airport_arrivals.IT_TSF.passenger_ref;
	var total = venice_arrivals + treviso_arrivals;
	
	// console.log("VCE ", venice_arrivals );
	// console.log("TSF ", treviso_arrivals );
	// console.log("TOTAL ", total );
	
	
	// var cruiseRef = new Firebase('https://vpc.firebaseio.com').child('dashboard/ships/tourists');
	var cruiseRef = ckconfig.dat_fb.child('ships/tourists');
	cruiseRef.on('value', function(dataSnap) {
		var air_arrivals = Math.floor(total);
		var cruise_arrivals = dataSnap.val();
		var max_occupancy = 23733;
		var estimated_hotels = Math.floor(max_occupancy * month_multiplier(new Date().getMonth() + 1) * day_multiplier(new Date().getDay()));

		var air_overnights = Math.floor((1262000/3450000) * air_arrivals);
		var train_overnights = Math.floor((1347000/5879000) * estimated_hotels);
		var auto_overnights = Math.floor((268000/5879000) * estimated_hotels);
		var coach_overnights = Math.floor((365000/5879000) * estimated_hotels);
		var bus_overnights = Math.floor((120000/5879000) * estimated_hotels);
		var cruise_overnights = Math.floor(((514000+329000)/239000) * cruise_arrivals);
		var boat_overnights = 0;

		var air_daytrips = 0;
		var train_daytrips = Math.floor(((450000+6670000)/1347000) * train_overnights);
		var auto_daytrips = Math.floor((751000/268000) * auto_overnights);
		var coach_daytrips = Math.floor(((547000+1787000)/365000) * coach_overnights);
		var bus_daytrips = Math.floor(((1110000+600000)/120000) * bus_overnights);
		var cruise_daytrips = 0;
		var boat_daytrips = Math.floor((466000+160000+2235000)/(450000+6670000+751000+547000+1787000+1110000+600000+466000+160000+2235000) * (train_daytrips + auto_daytrips + coach_daytrips + bus_daytrips + cruise_daytrips));

		var train_arrivals = Math.floor((509000/1347000) * train_overnights + train_overnights + train_daytrips);
		var auto_arrivals = Math.floor((95000/268000) * auto_overnights + auto_overnights + auto_daytrips);
		var coach_arrivals = Math.floor((131000/365000) * coach_overnights + coach_overnights + coach_daytrips);
		var bus_arrivals = Math.floor((44000/120000) * bus_overnights + bus_overnights + bus_daytrips);
		var boat_arrivals = boat_daytrips;

		var total_arrivals = air_arrivals + cruise_arrivals + train_arrivals + auto_arrivals + bus_arrivals + coach_arrivals + boat_arrivals;
		var total_overnights = air_overnights + cruise_overnights + train_overnights + auto_overnights + bus_overnights + coach_overnights + boat_overnights;
		var total_daytrips = air_daytrips + cruise_daytrips + train_daytrips + auto_daytrips + bus_daytrips + coach_daytrips + boat_daytrips;

		$('#air_arrivals').text(replaceNumberWithCommas(air_arrivals));
		$('#air_overnights').text(replaceNumberWithCommas(air_overnights));
		$('#air_daytrips').text(replaceNumberWithCommas(air_daytrips));

		$('#train_arrivals').text(replaceNumberWithCommas(train_arrivals));
		$('#train_overnights').text(replaceNumberWithCommas(train_overnights));
		$('#train_daytrips').text(replaceNumberWithCommas(train_daytrips));

		$('#car_arrivals').text(replaceNumberWithCommas(auto_arrivals));
		$('#car_overnights').text(replaceNumberWithCommas(auto_overnights));
		$('#car_daytrips').text(replaceNumberWithCommas(auto_daytrips));

		$('#coach_arrivals').text(replaceNumberWithCommas(coach_arrivals));
		$('#coach_overnights').text(replaceNumberWithCommas(coach_overnights));
		$('#coach_daytrips').text(replaceNumberWithCommas(coach_daytrips));

		$('#bus_arrivals').text(replaceNumberWithCommas(bus_arrivals));
		$('#bus_overnights').text(replaceNumberWithCommas(bus_overnights));
		$('#bus_daytrips').text(replaceNumberWithCommas(bus_daytrips));

		$('#cruise_arrivals').text(replaceNumberWithCommas(cruise_arrivals));
		$('#cruise_overnights').text(replaceNumberWithCommas(cruise_overnights));
		$('#cruise_daytrips').text(replaceNumberWithCommas(cruise_daytrips));

		$('#boat_arrivals').text(replaceNumberWithCommas(boat_arrivals));
		$('#boat_overnights').text(replaceNumberWithCommas(boat_overnights));
		$('#boat_daytrips').text(replaceNumberWithCommas(boat_daytrips));

		$('#arrivals_total').text(replaceNumberWithCommas(total_arrivals));
		$('#overnights_total').text(replaceNumberWithCommas(total_overnights));
		$('#daytrips_total').text(replaceNumberWithCommas(total_daytrips));

		$('#tourists_today').text(replaceNumberWithCommas(total_arrivals));
	});
});

function month_multiplier(month) {
	if (month == 1)
		return 0.54;
	if (month == 2)
		return 0.69;
	if (month == 3)
		return 0.87;
	if (month == 4)
		return 0.90;
	if (month == 5)
		return 0.87;
	if (month == 6)
		return 0.90;
	if (month == 7)
		return 0.85;
	if (month == 8)
		return 0.80;
	if (month == 9)
		return 0.80;
	if (month == 10)
		return 0.69;
	if (month == 11)
		return 0.59;
	if (month == 12)
		return 0.44;
	return 0.70;
}

function day_multiplier(day) {
	if (day == 0 || day == 5 || day == 6) // weekend
		return 1;
	else // weekday
		return 0.46;
}

function replaceNumberWithCommas(yourNumber) {
    //Seperates the components of the number
    var n= yourNumber.toString().split(".");
    //Comma-fies the first part
    n[0] = n[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //Combines the two sections
    return n.join(".");
}


*/

$.tourists_extensions = function($scope) {
  $scope.tourists = {
    air_tot: 0,
    air_ove: 0,
    air_day: 0,
    cruise_tot: 0,
    cruise_ove: 0,
    cruise_day: 0,
  };
  var vcfg = {};
  var air = {};
  
  setTimeout(function() {
  	
  	
	var passengerRef = ckconfig.dat_fb.child('airport_data');
	passengerRef.on('value', function(dataSnap) {
		var airport_arrivals = dataSnap.val();
		
		var venice_arrivals = airport_arrivals.IT_VCE.passenger_ref;
		var treviso_arrivals = airport_arrivals.IT_TSF.passenger_ref;
		var total = venice_arrivals + treviso_arrivals;
		
		// console.log("VCE ", venice_arrivals );
		// console.log("TSF ", treviso_arrivals );
		// console.log("TOTAL ", total );  	
  	
  	
      ckconfig.dat_fb.child('venice_tourists_config').on('value', function(myVal){
          vcfg = myVal.val();  
          //console.log("cfg", vcfg);
          //console.log("Scope.vs:",$scope.vs.arrivals_pass,$scope.vs.arrivals_crew, $scope.vs);
          
          if(true){//CruiseTT data
          
	   
				 
				     //CruiseTT Totals calc 
				      $scope.city_key_cruisett     ='733-Venice'; 
				
				      var now = new Date();   
				      $scope.today_key_date = now.getFullYear()  +
				          (" 00" + (now.getUTCMonth() + 1)).slice(-2) +
				          (" 00" + (now.getUTCDate()  )).slice(-2)  
				          ;
				      
				      if(false)
				       $scope.today_key_date="20150710";
				      
				      var fb_url='ships/cruisett_arrivals/'+ $scope.city_key_cruisett+'/'+ $scope.today_key_date+'/';   
				      //console.log('XXXXX:'+fb_url);
				      ckconfig.dat_fb.child(fb_url).on('value', function(myValctt){
				                 $scope.ctt_values = myValctt.val();
				                 
				                 $scope.ctt_values.port_load=parseInt($scope.ctt_values.port_load);
				                 $scope.ctt_values.passengers=parseInt($scope.ctt_values.passengers);
				                 $scope.ctt_values.overnight_ships=parseInt($scope.ctt_values.overnight_ships);
				                 $scope.ctt_values.overnight_load_pass=parseInt($scope.ctt_values.overnight_load_pass);
				                 $scope.ctt_values.overnight_load=parseInt($scope.ctt_values.overnight_load);
				                 
				                 //gET CREWS AND PASSENGERS
				                 //If not present use port_load
				                 //console.log('CruiseTT values before:',$scope.ctt_values);
				                 if($scope.ctt_values.port_load>0 && $scope.ctt_values.passengers<=0 ){
				                     
				                         
				                   //4%
				                   $scope.ctt_values.crews               =parseInt($scope.ctt_values.port_load/100 * 4);
				                   $scope.ctt_values.passengers          =$scope.ctt_values.port_load-$scope.ctt_values.crews;
				                     
				                 }
				                 
				                 if($scope.ctt_values.overnight_ships>0 && $scope.ctt_values.overnight_load_pass<=0 ){
				                     //Use capacity if there is
				                     if($scope.ctt_values.overnight_load>0){
				                         
				                         //4%
				                         $scope.ctt_values.overnight_load_crews=parseInt($scope.ctt_values.overnight_load/100 * 4);
				                         
				                         $scope.ctt_values.overnight_load_pass =$scope.ctt_values.overnight_load-$scope.ctt_values.overnight_load_crews;
				                         
				                     }else{
				                        //Invent some data??? 
				                     }
				                     
				                 }
				                 
				                 //Inconsistent data
				                 if($scope.ctt_values.crews<$scope.ctt_values.overnight_load_crews   ){
				                     $scope.ctt_values.crews=$scope.ctt_values.overnight_load_crews ;
				                 }
				                  
						          // TOT AS INTEGER
						            
						          
						         
						          $scope.tourists.cruise_ove = parseInt(($scope.ctt_values.overnight_load_pass+$scope.ctt_values.overnight_load_crews));
						          $scope.tourists.cruise_day = parseInt(($scope.ctt_values.port_load+$scope.ctt_values.crews) );
				              $scope.tourists.cruise_tot  =$scope.tourists.cruise_ove + $scope.tourists.cruise_day;
				                //console.log('XXX: CruiseTT values after:',$scope.ctt_values);
				              
				      }); 
				      
				      
				      

         
	          
          }else{//Venice tourists data
	          $scope.tourists.cruise_tot = $scope.vs.arrivals_pass + $scope.vs.arrivals_crew;
	          // console.log("cruise_ove", vcfg.cruise_ove_weight, $scope.tourists.cruise_tot);
	          // $scope.tourists.cruise_ove = Math.floor(vcfg.cruise_ove_weight * $scope.tourists.cruise_tot);
	          $scope.tourists.cruise_ove = $scope.vs.overnights_pass + $scope.vs.overnights_crew;
	          $scope.tourists.cruise_day = $scope.tourists.cruise_tot;//-$scope.tourists.cruise_ove ;
	          // TOT AS INTEGER
	          $scope.tourists.cruise_tot = parseInt($scope.tourists.cruise_tot);
	          $scope.tourists.cruise_ove = parseInt($scope.tourists.cruise_ove);
	          $scope.tourists.cruise_day = parseInt($scope.tourists.cruise_day);
          
          }
          
          ckconfig.dat_fb.child('flights').on('value', function(myVal3){
            air = myVal3.val();
            $scope.tourists.air_tot = Math.floor((venice_arrivals + treviso_arrivals)*.64);
            $scope.tourists.air_ove = Math.floor(.64 * (venice_arrivals + treviso_arrivals));
            $scope.tourists.air_day = 0;
            
            var max_occupancy    = vcfg.hotel_max_occupancy;
            var estimated_hotels = Math.floor(
                                    max_occupancy *
                                    vcfg.month_weight[(new Date().getMonth() + 1)] *
                                    vcfg.day_weight[(new Date().getDay())]
                                   );
            $scope.tourists.train_ove = Math.floor(vcfg.train_ove_weight * estimated_hotels);
            $scope.tourists.auto_ove  = Math.floor(vcfg.auto_ove_weight  * estimated_hotels);
            $scope.tourists.coach_ove = Math.floor(vcfg.coach_ove_weight * estimated_hotels);
            $scope.tourists.bus_ove   = Math.floor(vcfg.bus_ove_weight   * estimated_hotels);
            $scope.tourists.boat_ove  = 0;
            
            

            
            $scope.tourists.train_day = Math.floor(vcfg.train_day_weight * $scope.tourists.train_ove * 1.15);
            $scope.tourists.auto_day  = Math.floor(vcfg.auto_day_weight  * $scope.tourists.auto_ove );
            $scope.tourists.coach_day = Math.floor(vcfg.coach_day_weight * $scope.tourists.coach_ove);
            $scope.tourists.bus_day   = Math.floor(vcfg.bus_day_weight   * $scope.tourists.bus_ove   * 1.15);
            $scope.tourists.boat_day  = Math.floor(vcfg.boat_day_weight  * (
                                        $scope.tourists.train_day +
                                        $scope.tourists.auto_day  +
                                        $scope.tourists.coach_day +
                                        $scope.tourists.bus_day
            ));
            
        
            
            console.log ('BOAT DAY WEIGHT  '+vcfg.boat_day_weight);
            console.log ('BOAT TRAIN  '+$scope.tourists.train_day);
            console.log ('BOAT AUTO '+$scope.tourists.auto_day);
            console.log ('BOAT COACH '+$scope.tourists.coach_day);
            console.log ('BOAT BUS '+ $scope.tourists.bus_day);

            
            $scope.tourists.train_tot = Math.floor((1.0 + vcfg.train_tot_weight) * $scope.tourists.train_ove +
                                        $scope.tourists.train_day);
            $scope.tourists.auto_tot  = Math.floor((1.0 + vcfg.auto_tot_weight ) * $scope.tourists.auto_ove  +
                                        $scope.tourists.auto_day );
            $scope.tourists.coach_tot = Math.floor((1.0 + vcfg.coach_tot_weight) * $scope.tourists.coach_ove +
                                        $scope.tourists.coach_day);
            $scope.tourists.bus_tot   = Math.floor((1.0 + vcfg.bus_tot_weight  ) * $scope.tourists.bus_ove   +
                                        $scope.tourists.bus_day  );
            $scope.tourists.boat_tot  = $scope.tourists.boat_day;
            
            $scope.tourists.tot_tot = $scope.tourists.air_tot   + $scope.tourists.cruise_tot +
                                      $scope.tourists.train_tot + $scope.tourists.auto_tot   +
                                      $scope.tourists.coach_tot + $scope.tourists.bus_tot    +
                                      $scope.tourists.boat_tot;
            $scope.tourists.tot_ove = $scope.tourists.air_ove   + $scope.tourists.cruise_ove +
                                      $scope.tourists.train_ove + $scope.tourists.auto_ove   +
                                      $scope.tourists.coach_ove + $scope.tourists.bus_ove    +
                                      $scope.tourists.boat_ove;
            $scope.tourists.tot_day = $scope.tourists.air_day   + $scope.tourists.cruise_day +
                                      $scope.tourists.train_day + $scope.tourists.auto_day   +
                                      $scope.tourists.coach_day + $scope.tourists.bus_day    +
                                      $scope.tourists.boat_day;
            
            $scope.tourists.orig_tot_ove = $scope.tourists.tot_ove -
                                           $scope.tourists.air_ove -
                                           $scope.tourists.cruise_ove;
            console.log("UNRECOGNIZED VAR: "+$scope.tourists.new_tot_ove)
            $scope.tourists.tot_ove = parseInt($scope.tourists.new_tot_ove * 0.7);
            var perc = ($scope.tourists.tot_ove -
                        $scope.tourists.air_ove -
                        $scope.tourists.cruise_ove) / $scope.tourists.orig_tot_ove;
                        
            console.log("PERC " +perc);
            // $scope.tourists.air_ove    = parseInt(perc * $scope.tourists.air_ove   );
            // $scope.tourists.cruise_ove = parseInt(perc * $scope.tourists.cruise_ove);
            $scope.tourists.train_ove  = parseInt(perc * $scope.tourists.train_ove );
            $scope.tourists.auto_ove   = parseInt(perc * $scope.tourists.auto_ove  );
            $scope.tourists.coach_ove  = parseInt(perc * $scope.tourists.coach_ove );
            $scope.tourists.bus_ove    = parseInt(perc * $scope.tourists.bus_ove   );
            $scope.tourists.boat_ove   = parseInt(perc * $scope.tourists.boat_ove  );
            
            // linearly scale with currenthour / 24
            
			var currentdate = new Date();
            var currentHour = currentdate.getHours();
            var mult_factor = currentHour / 24;
            console.log ('CURRENT AUTO OVE WEIGHT  '+vcfg.auto_ove_weight);
            console.log ('CURRENTestimated hotels '+estimated_hotels);

           
            
            
            
            //scale down data
            $scope.tourists.train_tot = parseInt($scope.tourists.train_tot * mult_factor);
            $scope.tourists.train_ove = parseInt($scope.tourists.train_ove * mult_factor);
            $scope.tourists.train_day = parseInt($scope.tourists.train_day * mult_factor);
            
            $scope.tourists.auto_tot = parseInt($scope.tourists.auto_tot * mult_factor);
            $scope.tourists.auto_ove = parseInt($scope.tourists.auto_ove * mult_factor);
            $scope.tourists.auto_day = parseInt($scope.tourists.auto_day * mult_factor);
            
            $scope.tourists.coach_tot = parseInt($scope.tourists.coach_tot * mult_factor);
            $scope.tourists.coach_ove = parseInt($scope.tourists.coach_ove * mult_factor);
            $scope.tourists.coach_day = parseInt($scope.tourists.coach_day * mult_factor);
            
            $scope.tourists.bus_tot = parseInt($scope.tourists.bus_tot * mult_factor);
            $scope.tourists.bus_ove = parseInt($scope.tourists.bus_ove * mult_factor);
            $scope.tourists.bus_day = parseInt($scope.tourists.bus_day * mult_factor);
            
            $scope.tourists.cruise_tot = parseInt($scope.tourists.cruise_tot * mult_factor);
            $scope.tourists.cruise_ove = parseInt($scope.tourists.cruise_ove * mult_factor);
            $scope.tourists.cruise_day = parseInt($scope.tourists.cruise_day * mult_factor);
            
            $scope.tourists.boat_tot = parseInt($scope.tourists.boat_tot * mult_factor);
            $scope.tourists.boat_ove = parseInt($scope.tourists.boat_ove * mult_factor);
            $scope.tourists.boat_day = parseInt($scope.tourists.boat_day * mult_factor);
            
            $scope.tourists.tot_tot = parseInt($scope.tourists.tot_tot * mult_factor);
            $scope.tourists.tot_ove = parseInt($scope.tourists.tot_ove * mult_factor);
            $scope.tourists.tot_day = parseInt($scope.tourists.tot_day * mult_factor);
            
            
            
          })
     
      });
	});
  },  5000);		    
};

$.tourists_extensions(
  angular.element(
    document.querySelector('[ng-app=placeDash]')
  ).scope()
);

// // var passengerRef = new Firebase('https://vpc.firebaseio.com').child('dashboard/flights/passenger_ref');
// var passengerRef = ckconfig.dat_fb.child('flights/passenger_ref');
// passengerRef.on('value', function(dataSnap) {
// 	var venice_airport_arrivals = dataSnap.val();
// 	// var cruiseRef = new Firebase('https://vpc.firebaseio.com').child('dashboard/ships/tourists');
// 	var cruiseRef = ckconfig.dat_fb.child('ships/tourists');
// 	cruiseRef.on('value', function(dataSnap) {
// 		var air_arrivals = Math.floor(venice_airport_arrivals + venice_airport_arrivals * 0.389);
// 		var cruise_arrivals = dataSnap.val();
// 		var max_occupancy = 23733;
// 		var estimated_hotels = Math.floor(max_occupancy * month_multiplier(new Date().getMonth() + 1) * day_multiplier(new Date().getDay()));
// 
// 		var air_overnights = Math.floor((1262000/3450000) * air_arrivals);
// 		var train_overnights = Math.floor((1347000/5879000) * estimated_hotels);
// 		var auto_overnights = Math.floor((268000/5879000) * estimated_hotels);
// 		var coach_overnights = Math.floor((365000/5879000) * estimated_hotels);
// 		var bus_overnights = Math.floor((120000/5879000) * estimated_hotels);
// 		var cruise_overnights = Math.floor(((514000+329000)/239000) * cruise_arrivals);
// 		var boat_overnights = 0;
// 
// 		var air_daytrips = 0;
// 		var train_daytrips = Math.floor(((450000+6670000)/1347000) * train_overnights);
// 		var auto_daytrips = Math.floor((751000/268000) * auto_overnights);
// 		var coach_daytrips = Math.floor(((547000+1787000)/365000) * coach_overnights);
// 		var bus_daytrips = Math.floor(((1110000+600000)/120000) * bus_overnights);
// 		var cruise_daytrips = 0;
// 		var boat_daytrips = Math.floor((466000+160000+2235000)/(450000+6670000+751000+547000+1787000+1110000+600000+466000+160000+2235000) * (train_daytrips + auto_daytrips + coach_daytrips + bus_daytrips + cruise_daytrips));
// 
// 		var train_arrivals = Math.floor((509000/1347000) * train_overnights + train_overnights + train_daytrips);
// 		var auto_arrivals = Math.floor((95000/268000) * auto_overnights + auto_overnights + auto_daytrips);
// 		var coach_arrivals = Math.floor((131000/365000) * coach_overnights + coach_overnights + coach_daytrips);
// 		var bus_arrivals = Math.floor((44000/120000) * bus_overnights + bus_overnights + bus_daytrips);
// 		var boat_arrivals = boat_daytrips;
// 
// 		var total_arrivals = air_arrivals + cruise_arrivals + train_arrivals + auto_arrivals + bus_arrivals + coach_arrivals + boat_arrivals;
// 		var total_overnights = air_overnights + cruise_overnights + train_overnights + auto_overnights + bus_overnights + coach_overnights + boat_overnights;
// 		var total_daytrips = air_daytrips + cruise_daytrips + train_daytrips + auto_daytrips + bus_daytrips + coach_daytrips + boat_daytrips;
// 
// 		$('#air_arrivals').text(replaceNumberWithCommas(air_arrivals));
// 		$('#air_overnights').text(replaceNumberWithCommas(air_overnights));
// 		$('#air_daytrips').text(replaceNumberWithCommas(air_daytrips));
// 
// 		$('#train_arrivals').text(replaceNumberWithCommas(train_arrivals));
// 		$('#train_overnights').text(replaceNumberWithCommas(train_overnights));
// 		$('#train_daytrips').text(replaceNumberWithCommas(train_daytrips));
// 
// 		$('#car_arrivals').text(replaceNumberWithCommas(auto_arrivals));
// 		$('#car_overnights').text(replaceNumberWithCommas(auto_overnights));
// 		$('#car_daytrips').text(replaceNumberWithCommas(auto_daytrips));
// 
// 		$('#coach_arrivals').text(replaceNumberWithCommas(coach_arrivals));
// 		$('#coach_overnights').text(replaceNumberWithCommas(coach_overnights));
// 		$('#coach_daytrips').text(replaceNumberWithCommas(coach_daytrips));
// 
// 		$('#bus_arrivals').text(replaceNumberWithCommas(bus_arrivals));
// 		$('#bus_overnights').text(replaceNumberWithCommas(bus_overnights));
// 		$('#bus_daytrips').text(replaceNumberWithCommas(bus_daytrips));
// 
// 		$('#cruise_arrivals').text(replaceNumberWithCommas(cruise_arrivals));
// 		$('#cruise_overnights').text(replaceNumberWithCommas(cruise_overnights));
// 		$('#cruise_daytrips').text(replaceNumberWithCommas(cruise_daytrips));
// 
// 		$('#boat_arrivals').text(replaceNumberWithCommas(boat_arrivals));
// 		$('#boat_overnights').text(replaceNumberWithCommas(boat_overnights));
// 		$('#boat_daytrips').text(replaceNumberWithCommas(boat_daytrips));
// 
// 		$('#arrivals_total').text(replaceNumberWithCommas(total_arrivals));
// 		$('#overnights_total').text(replaceNumberWithCommas(total_overnights));
// 		$('#daytrips_total').text(replaceNumberWithCommas(total_daytrips));
// 
// 		$('#tourists_today').text(replaceNumberWithCommas(total_arrivals));
// 	});
// });
// 
// function month_multiplier(month) {
// 	if (month == 1)
// 		return 0.54;
// 	if (month == 2)
// 		return 0.69;
// 	if (month == 3)
// 		return 0.87;
// 	if (month == 4)
// 		return 0.90;
// 	if (month == 5)
// 		return 0.87;
// 	if (month == 6)
// 		return 0.90;
// 	if (month == 7)
// 		return 0.85;
// 	if (month == 8)
// 		return 0.80;
// 	if (month == 9)
// 		return 0.80;
// 	if (month == 10)
// 		return 0.69;
// 	if (month == 11)
// 		return 0.59;
// 	if (month == 12)
// 		return 0.44;
// 	return 0.70;
// }
// 
// function day_multiplier(day) {
// 	if (day == 0 || day == 5 || day == 6) // weekend
// 		return 1;
// 	else // weekday
// 		return 0.46;
// }
// 
// function replaceNumberWithCommas(yourNumber) {
//     //Seperates the components of the number
//     var n= yourNumber.toString().split(".");
//     //Comma-fies the first part
//     n[0] = n[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//     //Combines the two sections
//     return n.join(".");
// }
// 