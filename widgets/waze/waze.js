
//'use strict';
$root_scope=angular.element(document.querySelector('[ng-app=placeDash]')).scope();

//Single instance controller
if (!(typeof $root_scope.WazeController == 'function') ){  

        $root_scope.WazeController = function($scope){ 
            
            // simulate firebase get
            
            

             //Local scope functions
            $scope.initController = function($widget)
              {
                 $scope.latitude = 35.68421;
                 $scope.longitude = -105.93121;
                 $scope.url = "https://embed.waze.com/iframe?zoom=12&lat="+$scope.latitude+"&lon="+$scope.longitude;
                 $scope.widget=$widget;

            };
              
              
             //Refresh
             /*
             setInterval(function() {
                

                
              },  ( $scope.refresh_time ));
              */
        }
      
}