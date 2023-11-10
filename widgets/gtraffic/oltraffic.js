
$root_scope=angular.element(document.querySelector('[ng-app=placeDash]')).scope();

//Single instance controller
if (!(typeof $root_scope.OLtrafficController == 'function') ){  

  $root_scope.OLtrafficController = function($scope){ 

   //Local scope functions
    $scope.initController = function($widget)
    {
    	  
       // console.log( $scope.widget.id+".initController( log?"+$scope.widget.log+" fb_id:"+$scope.widget.fb_id);
       
       
        $scope.appendLibraries();
        
        setTimeout(function() {
         	 
         	//if($scope.widget.log)
         	 // console.log( $scope.widget.id+".setTimeout( " );
         	  

            $scope.map = new ol.Map({
            target: 'map_canvas_'+$scope.widget.fb_id,
            layers: [
              new ol.layer.Tile({
                source: new ol.source.MapQuest({layer: 'sat'})
              })
            ],
            view: new ol.View({
              center: ol.proj.transform([37.41, 8.82], 'EPSG:4326', 'EPSG:3857'),
              zoom: 7
            })
          });
          
          
        },  2000);		
         
    };
    
     $scope.appendLibraries = function() 
    {
  
		        
		        if (!(typeof ol === 'object' && typeof ol.Map === 'object')) {
		        	//if($scope.widget.log)
		    	     // console.log( $scope.widget.id+".appendLibraries( inject openlayers 3 lib");
		    	 
			        var script = document.createElement("script");
			        script.type = "text/javascript";
			        script.src = "widgets/gtraffic/openlayers/ol.js";
			        script.onload=function(){  
			        };
			        document.body.appendChild(script);		        
                }else{
		         	//if($scope.widget.log)
		         	 // console.log( $scope.widget.id+".appendLibraries( duplicate gmaps include");
		    	 
		         }		        
		        
		         if (!(typeof google === 'object' && typeof google.maps === 'object')) {
			    	//if($scope.widget.log)
			    	 // console.log( $scope.widget.id+".appendLibraries( inject gmaps 3 lib");
			    			        
			        script = document.createElement("script");
			        script.type = "text/javascript";
			        script.src = "https://maps.google.com/maps/api/js?v=3&amp;sensor=false";
			        script.onload=function(){  
			        };
			        document.body.appendChild(script);	
		        
		         }else{
		         	//if($scope.widget.log)
		         	 // console.log( $scope.widget.id+".appendLibraries( duplicate gmaps include");
		    	 
		         }

		                 
	 
		};
		
		      
		
   
  }//Controller

}//Function defined    
