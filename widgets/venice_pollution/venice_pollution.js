 
$root_scope=angular.element(document.querySelector('[ng-app=placeDash]')).scope();

//Single instance controller
if (!(typeof $root_scope.VenicePollutionController == 'function') ){  

  $root_scope.VenicePollutionController = function($scope){ 
  
  
  
    $scope.initController = function($widget)
    { 
        
            console.log('"VenicePollutionController.initController')
               
            var now = new Date();   
            
            $scope.veniceair_todays={};
            $scope.today_key_date = now.getFullYear()  +
                (" 00" + (now.getUTCMonth() + 1)).slice(-2) +
                (" 00" + (now.getUTCDate()  )).slice(-2)  
                ;
                
           $scope.tomorrow_date = now.getFullYear()  +
                (" 00" + (now.getUTCMonth() + 1)).slice(-2) +
                (" 00" + (now.getUTCDate() +1 )).slice(-2)  
                ;
                
                
            var fb_url='venice_pollution/todays/'+ $scope.today_key_date+'/';    
            console.log(fb_url);
            ckconfig.dat_fb.child(fb_url).on('value', function(myVal){
                        
                       
               $scope.veniceair_todays= myVal.val();
 
               console.log('VenicePollutionController values:',$scope.veniceair_todays);
             
               
            });   
            
            
        
    };  
    
  
  
  };
}; 