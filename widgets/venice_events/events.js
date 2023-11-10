
$root_scope=angular.element(document.querySelector('[ng-app=placeDash]')).scope();

//Single instance controller
if (!(typeof $root_scope.VeniceEventsController == 'function') ){  

  $root_scope.VeniceEventsController = function($scope){ 
      
        $scope.computeFeatureStyle = function(feature) {
                         
               var iconStyle = [
                    new ol.style.Style({
                        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                            anchor: [0.5, 1],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'fraction',
                            src: 'widgets/venice_events/event_active.png'
                        }))
                    }),
                    new ol.style.Style({
                        text: new ol.style.Text({
                            text: feature.get('name'),
                            offsetY: -25,
                            fill: new ol.style.Fill({
                                color: '#0000'
                            })
                        })
                    })
                ];
                
                return iconStyle;
    }
                    

   //Local scope functions
    $scope.initController = function($widget)
    {
    	  
       // console.log( $scope.widget.id+".initController( log?"+$scope.widget.log+" fb_id:"+$scope.widget.fb_id);
       
       
        $scope.appendLibraries();
        
        setTimeout(function() {
            
             $scope.city_key='venice';
             var now = new Date();  
             $scope.today_key = now.getFullYear()  +
                (" 00" + (now.getMonth() + 1)).slice(-2) +
                (" 00" + (now.getDate()  + 0)).slice(-2);
            /*
            ckconfig.dat_fb.child('cityevents/'+ $scope.city_key+'/'+ $scope.today_key+'/events_kml').on('value', function(myVal){
              $scope.kml_layer = myVal.val();
              // console.log("events kml", $scope.kml_layer);
            });
            */
            ckconfig.dat_fb.child('cityevents/'+ $scope.city_key+'/'+ $scope.today_key+'/events_list').on('value', function(myVal){
                   $scope.events_list = myVal.val();
                   // console.log("events list", $scope.events_list);
                      
                 	// if($scope.widget.log)
                 	 // console.log( $scope.widget.id+".setTimeout( " );
                 	  
                 	  var proj_int= 'EPSG:4326';
                 	  var proj_ext= 'EPSG:3857';
            
                    
                    //Event markers
                    var iconFeatures=[];
                    if($scope.events_list){
                        $.each( $scope.events_list , function(index, value) {
                           // console.log('Event:'+value.name+value.lat+'/'+value.lon,index,value);
                           
                           var iconFeature = new ol.Feature({
                              geometry: new ol.geom.Point(ol.proj.transform([value.lat,value.lon],proj_int,  proj_ext)),
                              name: value.name
                              // name: 'NULL',
                            });
                            
                            var featureStyle=$scope.computeFeatureStyle(iconFeature);
                            iconFeature.setStyle(featureStyle);
                            iconFeatures.push(iconFeature);
    
                        });
                     }else{
                        //Call vpc server scripts
                        
                        //Marinetraffic
                        $.get( "bluehost/scripts/vpc/11_veniceevents.php", function( data ) {    });
                         
                        
                        
                    }
                                      
                    var vectorSource = new ol.source.Vector({
                      features: iconFeatures //add an array of features
                    });
                    
          
                    var vectorLayer = new ol.layer.Vector({
                      source: vectorSource 
                    });
                            
                    $scope.map = new ol.Map({
                    target: 'map_canvas_'+$scope.widget.fb_id,
                    layers: [
                      new ol.layer.Tile({
                        source: new ol.source.MapQuest({layer: 'osm'})
                      }  
                      )
                      ,vectorLayer
                    ],
                    view: new ol.View({
                      center: ol.proj.transform([12.33,45.44], proj_int,proj_ext),
                      zoom: 13
                    })
                  });//map
                  
                  
                  //POPUP 
                  var popup = new ol.Overlay({
                      element: element,
                      positioning: 'bottom-center',
                      stopEvent: false
                  });
                  map.addOverlay(popup);
                    
                  // display popup on click
                  map.on('click', function(evt) {
                      var feature = map.forEachFeatureAtPixel(evt.pixel,
                          function(feature, layer) {
                            return feature;
                          });
                      if (feature) {
                        var geometry = feature.getGeometry();
                        var coord = geometry.getCoordinates();
                        popup.setPosition(coord);
                        $(element).popover({
                          'placement': 'top',
                          'html': true,
                          'content': feature.get('name')
                        });
                        $(element).popover('show');
                      } else {
                        $(element).popover('destroy');
                      }
                    });
                  
            }); 
        },  2000);		
         
    };
 
    
     $scope.appendLibraries = function() {
        if (!(typeof ol === 'object' && typeof ol.Map === 'object')) {
        	// if($scope.widget.log) {
    	    // console.log( $scope.widget.id+".appendLibraries( inject openlayers 3 lib");
  	      // } 
	        var script = document.createElement("script");
	        script.type = "text/javascript";
	        script.src = "widgets/venice_events/openlayers/ol.js";
	        script.onload=function(){  
	        };
	        document.body.appendChild(script);		        
        } else {
         	// if($scope.widget.log)
         	// console.log( $scope.widget.id+".appendLibraries( duplicate map include");
        }		        
		};
		
		      
		
   
  }//Controller

}//Function defined    
