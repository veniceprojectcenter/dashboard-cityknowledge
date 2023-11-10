// $(function() {
//   $('.tooltip').tooltipster();
// });

$root_scope=angular.element(document.querySelector('[ng-app=placeDash]')).scope();

//Single instance controller
if (!(typeof $root_scope.HospitalityController == 'function') ){  

  $root_scope.HospitalityOccupation = function($scope){ 
  
  
  
    $scope.initController = function($widget)
    {
        //$scope.city_key_cruisett     =$widget.settings.cruisett_port.value;
        // console.log("ENTERED CONTROLLER INIT ");

          // get todays and tomorrow's date
        var todayDate = new Date(new Date().getTime());
        // console.log(todayDate);
		var todayDay = todayDate.getDate();
		var todayMonth = todayDate.getMonth() + 1;
		var todayYear = todayDate.getFullYear();
		
        var tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
		var tomorrowDay = tomorrowDate.getDate();
		var tomorrowMonth = tomorrowDate.getMonth() + 1;
		var tomorrowYear = tomorrowDate.getFullYear();

		// console.log(todayDay+" "+tomorrowDay);
		
		if (todayDay < 10) todayDay = '0'+todayDay;
		if (todayMonth < 10) todayMonth = '0'+todayMonth;

		if (tomorrowDay < 10) tomorrowDay = '0'+tomorrowDay;
		if (tomorrowMonth < 10) tomorrowMonth = '0'+tomorrowMonth;

        ckconfig.dat_fb.parent().child('hotels/'+todayYear+'/'+todayMonth+'/'+todayDay).once('value', function(myVal){
          
        // console.log('hotels/'+todayYear+'/'+todayMonth+'/'+todayDay + '    '+myVal.val());

        //console.log(myVal.val())
        var avg_beds_for_room = 3;
        	
       // $scope.today = myVal.val();
        $scope.free_zero_today = myVal.child('0/booking/libere').val()*avg_beds_for_room;
        $scope.free_one_today = myVal.child('1/booking/libere').val()*avg_beds_for_room;
        $scope.free_two_today = myVal.child('2/booking/libere').val()*avg_beds_for_room;
        $scope.free_three_today = myVal.child('3/booking/libere').val()*avg_beds_for_room;
        $scope.free_four_today = myVal.child('4/booking/libere').val()*avg_beds_for_room;
        $scope.free_five_today = myVal.child('5/booking/libere').val()*avg_beds_for_room;
        
        $scope.free_hostels_today = myVal.child('hostels/posti_liberi').val();
        
        $scope.occupied_beds_today = 33000 - ($scope.free_zero_today+$scope.free_one_today+$scope.free_two_today+$scope.free_three_today+$scope.free_four_today+$scope.free_five_today+$scope.free_hostels_today);
        $scope.occupied_beds_today_percentage = $scope.occupied_beds_today* 100 /33000;
        
        // console.log("Tutisti TOTALI", $scope.occupied_beds_today, $scope.tourists.tot_ove);
        $scope.tourists.new_tot_ove = $scope.occupied_beds_today;
        });   
        
        
        
        
        ckconfig.dat_fb.parent().child('hotels/'+tomorrowYear+'/'+tomorrowMonth+'/'+tomorrowDay).once('value', function(myVal){
          
        // console.log("ENTERED CONTROLLER INIT - TOMORROW");

        // console.log(myVal.val())
        var avg_beds_for_room = 2;
        	
       // $scope.tomorrow = myVal.val();
        $scope.free_zero_tomorrow = myVal.child('0/booking/libere').val()*avg_beds_for_room;
        $scope.free_one_tomorrow = myVal.child('1/booking/libere').val()*avg_beds_for_room;
        $scope.free_two_tomorrow = myVal.child('2/booking/libere').val()*avg_beds_for_room;
        $scope.free_three_tomorrow = myVal.child('3/booking/libere').val()*avg_beds_for_room;
        $scope.free_four_tomorrow = myVal.child('4/booking/libere').val()*avg_beds_for_room;
        $scope.free_five_tomorrow = myVal.child('5/booking/libere').val()*avg_beds_for_room;
        
        $scope.free_hostels_tomorrow = myVal.child('hostels/posti_liberi').val();

        });    
        
    };  
    
  };
  
};
/*

$.hospitality_occupation = function($scope) {
  $scope.hospitality_occupation = {
	    free_0_today : 5,
	    free_0_tomorrow: 5,
	    free_1_today : 0,
	    free_2_tomorrow: 0,
	    free_3_today : 0,
	    free_3_tomorrow: 0,
	    free_4_today : 0,
	    free_4_tomorrow: 0,
	    free_5_today : 0,
	    free_5_tomorrow: 0,
	   	free_h_today : 0,
	    free_h_tomorrow: 0,
	    
	    air_day: 0,
	    cruise_tot: 0,
	    cruise_ove: 0,
	    cruise_day: 0,
  };

  
  setTimeout(function() {
  	
  	
	var passengerRef = ckconfig.dat_fb.child('hotels');
	passengerRef.on('value', function(dataSnap) {
		var hospitality = dataSnap.val();
		
  	    $scope.hospitality_occupation.free_0_today = 99;

  	

	}
	
	);
	
  },  5000);		    
};

$.hospitality_occupation_extensions(
  angular.element(
    document.querySelector('[ng-app=placeDash]')
  ).scope()
);
/*/
