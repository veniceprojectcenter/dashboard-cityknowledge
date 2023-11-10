 
    

$root_scope=angular.element(document.querySelector('[ng-app=placeDash]')).scope();

//Single instance controller
if (!(typeof $root_scope.VeniceAirbnbtopController == 'function') ){  

  $root_scope.VeniceAirbnbtopController = function($scope){ 
       
                    

   //Local scope functions
    $scope.initController = function($widget)
    { 	
         
         
           console.log("VeniceAirbnbtopController.initController START");
			
			  
			var location="Venezia, VE"; 
			var fb_url="airbnb/"+location+"/stats_multilisting/last/";    
			
			ckconfig.dat_fb.child(fb_url).on('value', function(myVal){
				var val = myVal.val();


				$scope.airbnb_values = val; 
				 
				
				console.log('Airbnb top values:', $scope.airbnb_values); 
				
				
			});
			
    };
  
		      
		
   
  }//Controller

}//Function defined    
