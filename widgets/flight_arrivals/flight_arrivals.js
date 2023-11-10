// $(function() {
//   $('.tooltip').tooltipster();
// });

$root_scope=angular.element(document.querySelector('[ng-app=placeDash]')).scope();

//Single instance controller
if (!(typeof $root_scope.VesselsInPortController == 'function') ){  

  $root_scope.FlightArrivals = function($scope){ 
  
  
  
    $scope.initController = function($widget)
    {
        //$scope.city_key_cruisett     =$widget.settings.cruisett_port.value;
        // console.log("ENTERED CONTROLLER INIT ");

        ckconfig.dat_fb.child('airport_data').once('value', function(myVal){
          $scope.airports = myVal.val();
        });        
        
    };  
    
  };
  
};