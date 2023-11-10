
$root_scope=angular.element(document.querySelector('[ng-app=placeDash]')).scope();


/* LAYER SWITCHER */
var hotelsmap_layers = [];

function switchLayer()
 {
  var checkedLayer = $('#layerswitcher input[name=layer]:checked').val();
  for (i = 1, ii = hotelsmap_layers.length; i < ii; ++i){
      hotelsmap_layers[i].setVisible(i==checkedLayer);
  }  
 }

 

$("#layerswitcher input[name=layer]").change(function() { switchLayer() } );

/*  WIDGET CONTROLLER*/
if (!(typeof $root_scope.HotelsMapPortController == 'function') ){  

  $root_scope.HotelsMapPortController = function($scope){ 
      
        $scope.getDatabaseWidgetVars = function($widget) {

            //Read config vars 
 
            $scope.map_center_long=parseFloat($widget.settings.center_lat.value);
            $scope.map_center_lat =parseFloat($widget.settings.center_long.value);
            
  
            
        }
          
        $scope.computeFeatureStyle = function(feature) {
                         
               var iconStyle = [
                    new ol.style.Style({
                        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                            anchor: [0, 0],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'fraction',
                            src: 'widgets/hotelsmap/airbnb.png'
                        }))
                    }),
                    new ol.style.Style({
                        text: new ol.style.Text({
                            text: feature.get('name'),
                            offsetX: 0,
                            offsetY: -5,
                            fill: new ol.style.Fill({
                                color: '#0000'
                            })
                        })
                    })
                ];
                
                return iconStyle;
    }
    
    
    $scope.computeBookingFeatureStyle = function(feature) {
                         
               var iconStyle = [
                    new ol.style.Style({
                        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                            anchor: [0, 0],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'fraction',
                            src: 'widgets/hotelsmap/booking.jpg'
                        }))
                    }),
                    new ol.style.Style({
                        text: new ol.style.Text({
                            text: feature.get('name'),
                            offsetX: 0,
                            offsetY: -5,
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
        console.log('HotelsMapPortController.WidgetSettings:',$widget.settings );
       
       
       
        $scope.getDatabaseWidgetVars($widget);
       
        $scope.appendLibraries();
        
        $scope.total_recs=0;
        
        setTimeout(function() {
            
            var fb_url='airbnb/Venezia, VE/rooms';
            // console.log('Ships in port at url:'+fb_url);
            ckconfig.dat_fb.child(fb_url).on('value', function(myVal){
                   $scope.recs_list = myVal.val();
                   console.log("hotels(airbnb) list size:", $scope.recs_list);
       	  
                   var proj_int= 'EPSG:4326';
                   var proj_ext= 'EPSG:3857';
            
                    //Event markers
                    var iconFeatures=[];
                    if($scope.recs_list){
                        $.each( $scope.recs_list , function(index, value) {
                           value.pos_long=parseFloat(value.long);
                           value.pos_lat =parseFloat(value.lat);
                            
                           $scope.total_recs++;
                            
                           var rec_name="Airbnb: "+value.host_id;
                          // console.log('Rec:'+rec_name+" "+value.pos_lat+'/'+value.pos_long,index,value);
                           if(rec_name){
                               
                               var iconFeature = new ol.Feature({
                                  geometry: new ol.geom.Point(ol.proj.transform([value.pos_long,value.pos_lat],proj_int,  proj_ext)),
                                  name: rec_name 
                                });
                                
                                var featureStyle=$scope.computeFeatureStyle(iconFeature);
                                iconFeature.setStyle(featureStyle);
                                iconFeatures.push(iconFeature);
                           }
    
                        });
                    } 
                                  
                    var vectorSource = new ol.source.Vector({
                      features: iconFeatures //add an array of features
                    });
                    
          
                    var vectorLayer = new ol.layer.Vector({
                      source: vectorSource 
                    });

                    hotelsmap_layers[0]=new ol.layer.Tile({
                        source: new ol.source.MapQuest({layer: 'osm'})
                      } );
 
                    hotelsmap_layers[2]=vectorLayer;
                      
                    $scope.map = new ol.Map({
                    target: 'map_canvas_'+$scope.widget.fb_id,
                    layers:hotelsmap_layers,
                    view: new ol.View({
                      center: ol.proj.transform([ $scope.map_center_lat, $scope.map_center_long], proj_int,proj_ext),
                      zoom: 13
                    })
                  });//map
                   
                  
                   
                  
            }); 
        },  2000);	
        
        
        setTimeout(function() {
            
            var fb_url='booking/hotels';
            ckconfig.dat_fb.child(fb_url).on('value', function(myVal){
                   $scope.recs_list = myVal.val();
                   console.log("hotels(booking) list size:", $scope.recs_list);
       	  
                   var proj_int= 'EPSG:4326';
                   var proj_ext= 'EPSG:3857';
            
                    //Event markers
                    var iconFeatures=[];
                    if($scope.recs_list){
                        $.each( $scope.recs_list , function(index, value) {
                           value.pos_long=parseFloat(value.long);
                           value.pos_lat =parseFloat(value.lat);
                            
                           $scope.total_recs++;
                            
                           var rec_name="Booking: "+value.host_id;
                          // console.log('Rec:'+rec_name+" "+value.pos_lat+'/'+value.pos_long,index,value);
                           if(rec_name){
                               
                               var iconFeature = new ol.Feature({
                                  geometry: new ol.geom.Point(ol.proj.transform([value.pos_long,value.pos_lat],proj_int,  proj_ext)),
                                  name: rec_name 
                                });
                                
                                var featureStyle=$scope.computeBookingFeatureStyle(iconFeature);
                                iconFeature.setStyle(featureStyle);
                                iconFeatures.push(iconFeature);
                           }
    
                        });
                    } 
                                  
                    var vectorSource = new ol.source.Vector({
                      features: iconFeatures //add an array of features
                    });
                    
          
                    var vectorLayer = new ol.layer.Vector({
                      source: vectorSource 
                    });

                    hotelsmap_layers[0]=new ol.layer.Tile({
                        source: new ol.source.MapQuest({layer: 'osm'})
                      } );
 
                    hotelsmap_layers[1]=vectorLayer;
                      
                    $scope.map = new ol.Map({
                    target: 'map_canvas_'+$scope.widget.fb_id,
                    layers:hotelsmap_layers,
                    view: new ol.View({
                      center: ol.proj.transform([ $scope.map_center_lat, $scope.map_center_long], proj_int,proj_ext),
                      zoom: 13
                    })
                  });//map
                   
                  
                   
                  
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
			        script.src = "widgets/vessels_inport/openlayers/ol.js";
			        script.onload=function(){  
			        };
			        document.body.appendChild(script);		        
                }else{
		         	//if($scope.widget.log)
		         	 // console.log( $scope.widget.id+".appendLibraries( duplicate map include");
		    	 
		         }		        
		         
		                 
	 
		};
		
		      
		
   
  }//Controller

}//Function defined    
