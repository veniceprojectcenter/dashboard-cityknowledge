 
$root_scope=angular.element(document.querySelector('[ng-app=placeDash]')).scope();

//Single instance controller
if (!(typeof $root_scope.RealestateController == 'function') ){  

  $root_scope.RealestateController = function($scope){ 
  
  
  
    $scope.initController = function($widget)
    { 
        
            console.log('"RealestateController.initController')
               
            var now = new Date();   
            
            $scope.immobiliare_todays={};
            $scope.today_key_date = now.getFullYear()  +
                (" 00" + (now.getUTCMonth() + 1)).slice(-2) +
                (" 00" + (now.getUTCDate()  )).slice(-2)  
                ;
                
            var fb_url='realestate/immobiliare_todays/'+ $scope.today_key_date+'/';    
            console.log(fb_url);
            ckconfig.dat_fb.child(fb_url).on('value', function(myVal){
                       
               $scope.immobiliare_todays= myVal.val();
 
               console.log('RealestateController values:',$scope.immobiliare_todays);
                
              $scope.totals_selled            =0;   
              $scope.totals_available         =0; 
              $scope.totals_average_meter_cost=0;
              
              if($scope.immobiliare_todays.total.selled)  
                  $scope.totals_selled =$scope.immobiliare_todays.total.selled;
                   
              if($scope.immobiliare_todays.total.available)  
                  $scope.totals_available =$scope.immobiliare_todays.total.available;
                    
              $scope.totals_average_meter_cost +=$scope.immobiliare_todays.Cannaregio.average_meter_cost
              $scope.totals_average_meter_cost +=$scope.immobiliare_todays.Castello.average_meter_cost
              $scope.totals_average_meter_cost +=$scope.immobiliare_todays.Dorsoduro.average_meter_cost
              $scope.totals_average_meter_cost +=$scope.immobiliare_todays.SanMarco.average_meter_cost
              $scope.totals_average_meter_cost +=$scope.immobiliare_todays.SanPolo.average_meter_cost
              $scope.totals_average_meter_cost +=$scope.immobiliare_todays.SantaCroce.average_meter_cost ;                                       
                
               if( $scope.totals_average_meter_cost>0){
                $scope.totals_average_meter_cost= ($scope.totals_average_meter_cost/6);
                $scope.totals_average_meter_cost=Math.round10($scope.totals_average_meter_cost ,2);
               }
                 

             
               
            });   
            
            
        
    };  
    
  
  
  };
}; 