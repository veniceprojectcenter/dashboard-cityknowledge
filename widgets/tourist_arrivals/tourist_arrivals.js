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
  	
  	//get todays date
  	
	var passengerRef = ckconfig.dat_fb.child('tourist_arrivals/data/now');
	passengerRef.on('value', function(dataSnap) {
		var tourist_arrivals = dataSnap.val();
		console.log('CIAO!');
		console.log(tourist_arrivals);
		
		// console.log("VCE ", venice_arrivals );
		// console.log("TSF ", treviso_arrivals );
		// console.log("TOTAL ", total );  	
		
		$scope.tourists.air_tot = parseInt(tourist_arrivals.air.tot);
        $scope.tourists.air_ove = parseInt(tourist_arrivals.air.ove);
        $scope.tourists.air_day = parseInt(tourist_arrivals.air.day); 
		
		$scope.tourists.train_tot = parseInt(tourist_arrivals.train.tot);
        $scope.tourists.train_ove = parseInt(tourist_arrivals.train.ove);
        $scope.tourists.train_day = parseInt(tourist_arrivals.train.day); 
        
		$scope.tourists.auto_tot = parseInt(tourist_arrivals.auto.tot);
        $scope.tourists.auto_ove = parseInt(tourist_arrivals.auto.ove);
        $scope.tourists.auto_day = parseInt(tourist_arrivals.auto.day); 
            
		$scope.tourists.coach_tot = parseInt(tourist_arrivals.coach.tot);
        $scope.tourists.coach_ove = parseInt(tourist_arrivals.coach.ove);
        $scope.tourists.coach_day = parseInt(tourist_arrivals.coach.day); 
            
            
		$scope.tourists.bus_tot = parseInt(tourist_arrivals.bus.tot);
        $scope.tourists.bus_ove = parseInt(tourist_arrivals.bus.ove);
        $scope.tourists.bus_day = parseInt(tourist_arrivals.bus.day); 
            
            
		$scope.tourists.cruise_tot = parseInt(tourist_arrivals.cruise.tot);
        $scope.tourists.cruise_ove = parseInt(tourist_arrivals.cruise.ove);
        $scope.tourists.cruise_day = parseInt(tourist_arrivals.cruise.day); 
        
        
		$scope.tourists.boat_tot = parseInt(tourist_arrivals.boat.tot);
        $scope.tourists.boat_ove = parseInt(tourist_arrivals.boat.ove);
        $scope.tourists.boat_day = parseInt(tourist_arrivals.boat.day); 
            
		$scope.tourists.tot_tot = parseInt(tourist_arrivals.total.tot);
        $scope.tourists.tot_ove = parseInt(tourist_arrivals.total.ove);
        $scope.tourists.tot_day = parseInt(tourist_arrivals.total.day); 
  	

	});
  },  5000);		    
};

$.tourists_extensions(
  angular.element(
    document.querySelector('[ng-app=placeDash]')
  ).scope()
);

