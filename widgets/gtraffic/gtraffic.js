
$root_scope=angular.element(document.querySelector('[ng-app=placeDash]')).scope();

//Single instance controller
if (!(typeof $root_scope.GtrafficController == 'function') ){  

  $root_scope.GtrafficController = function($scope){ 

   //Local scope functions
    $scope.initController = function($widget)
    {
    	 
        
       // console.log( $scope.widget.id+".initController( log?"+$scope.widget.log);
       
       $scope.appendGoogle3Bootstrap();
    };
    
    $scope.appendGoogle3Bootstrap = function() 
    {
    	    var len = $('script[src="https://maps.google.com*"]').length;
    	    
    	   	//if($scope.widget.log)
		    	 // console.log( $scope.widget.id+".appendGoogle3Bootstrap( google script len="+len);
		    	
    	    
		    if (typeof google === 'object' && typeof google.maps === 'object') {
		    	
		    	//if($scope.widget.log)
		    	 // console.log( $scope.widget.id+".appendGoogle3Bootstrap( google lib has been included previously");
		    	
		        
		    } else {
		    	
		    	//if($scope.widget.log)
		    	 // console.log( $scope.widget.id+".appendGoogle3Bootstrap( inject gmaps lib");
		    	
		    
		        var script = document.createElement("script");
		        script.type = "text/javascript";
		        script.src = "https://maps.google.com/maps/api/js?v=3&sensor=false&callback=callback";
		        //script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDAXAjmRjzVMVWRtuQSRozy_TiD95d5NH0";
		        document.body.appendChild(script);
		        
		    }
		    
		      setTimeout(function() {
	             	
	             	var google_ready=(typeof google === 'object' && typeof google.maps === 'object');
	             	
	             	//if($scope.widget.log)
	             	 // console.log( $scope.widget.id+".setTimeout( google_ready?"+google_ready);
	             	 
	                 $scope.handleGoogleApiReady();
	         },  4000);	
		};
		
		
	    $scope.handleGoogleApiReady = function() 
		  {
			    	 	 
		      	// if($scope.widget.log)
		          // console.log( $scope.widget.id+".handleGoogleApiReady( ",google.maps);
		             	 
			    $scope.myLatlng = new google.maps.LatLng(35.684211, -105.937815);
			    $scope.myOptions = {
			      zoom: 6,
			      center: $scope.myLatlng,
				  mapTypeControl: false,
				  panControl: false,
				  scaleControl: true,
				  zoomControl: true,			      
			      mapTypeId: google.maps.MapTypeId.ROADMAP 
			    }
			    $scope.map = new google.maps.Map(document.getElementById("map_canvas_"+$scope.widget.fb_id), $scope.myOptions);
 
 
			 
				$scope.trafficLayer = new google.maps.TrafficLayer();
			    $scope.trafficLayer.setMap($scope.map);
			
		};

 }//Controller

}