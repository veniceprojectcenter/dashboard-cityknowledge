
$root_scope=angular.element(document.querySelector('[ng-app=placeDash]')).scope();

//Single instance controller
if (!(typeof $root_scope.VesselsInPortController == 'function') ){  

  $root_scope.VesselsInPortController = function($scope){ 
      
        $scope.getDatabaseWidgetVars = function($widget) {

            //Read config vars 
            
            $scope.city_key_cruisett     =$widget.settings.cruisett_port.value;
            $scope.city_key_marinetraffic=$widget.settings.marinetraffic_port.value;
            
            $scope.passenger_vessels_total=0;
            
            
            $scope.map_center_long=parseFloat($widget.settings.marinetraffic_lat.value);
            $scope.map_center_lat =parseFloat($widget.settings.marinetraffic_long.value);
            
            var now = new Date();  
            $scope.today_key_with_hours = now.getFullYear()  +
                (" 00" + (now.getUTCMonth() + 1)).slice(-2) +
                (" 00" + (now.getUTCDate()  )).slice(-2) +
                (" 00" + (now.getUTCHours())).slice(-2) 
                ;
            $scope.today_key_date = now.getFullYear()  +
                (" 00" + (now.getUTCMonth() + 1)).slice(-2) +
                (" 00" + (now.getUTCDate()  )).slice(-2)  
                ;
                
            var fb_url='ships/marinetraffic_inport/'+ $scope.city_key_marinetraffic+'/'+ $scope.today_key_with_hours+'/0000_values';    
            // console.log(fb_url);
            ckconfig.dat_fb.child(fb_url).on('value', function(myVal){
                       
                       $scope.mt_0000_values= myVal.val();
                       // console.log('Marinetraffic values:', $scope.mt_0000_values);
            }); 
            
            
				      
		    if(false)
		       $scope.today_key_date="20150710";
		       
            fb_url='ships/cruisett_arrivals/'+ $scope.city_key_cruisett+'/'+ $scope.today_key_date+'/';   
            // console.log(fb_url);
            ckconfig.dat_fb.child(fb_url).on('value', function(myVal){
                       $scope.ctt_values = myVal.val();
                       
                       $scope.ctt_values.port_load=parseInt($scope.ctt_values.port_load);
                       $scope.ctt_values.passengers=parseInt($scope.ctt_values.passengers);
                       $scope.ctt_values.overnight_ships=parseInt($scope.ctt_values.overnight_ships);
                       $scope.ctt_values.overnight_load_pass=parseInt($scope.ctt_values.overnight_load_pass);
                       $scope.ctt_values.overnight_load=parseInt($scope.ctt_values.overnight_load);
                       
                       //gET CREWS AND PASSENGERS
                       //If not present use port_load
                       //console.log('CruiseTT values before:',$scope.ctt_values);
                       if($scope.ctt_values.port_load>0 && $scope.ctt_values.passengers<=0 ){
                           
                               
                         //4%
                         $scope.ctt_values.crews               =parseInt($scope.ctt_values.port_load/100 * 4);
                         $scope.ctt_values.passengers          =$scope.ctt_values.port_load-$scope.ctt_values.crews;
                           
                       }
                       
                       if($scope.ctt_values.overnight_ships>0 && $scope.ctt_values.overnight_load_pass<=0 ){
                           //Use capacity if there is
                           if($scope.ctt_values.overnight_load>0){
                               
                               //4%
                               $scope.ctt_values.overnight_load_crews=parseInt($scope.ctt_values.overnight_load/100 * 4);
                               
                               $scope.ctt_values.overnight_load_pass =$scope.ctt_values.overnight_load-$scope.ctt_values.overnight_load_crews;
                               
                           }else{
                              //Invent some data??? 
                           }
                           
                       }
                       
                       //Inconsistent data
                       if($scope.ctt_values.crews<$scope.ctt_values.overnight_load_crews   ){
                           $scope.ctt_values.crews=$scope.ctt_values.overnight_load_crews ;
                       }
                        
                       
                       //console.log('CruiseTT values after:',$scope.ctt_values);
            }); 
            
        }
          
        $scope.computeFeatureStyle = function(feature) {
                         
               var iconStyle = [
                    new ol.style.Style({
                        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                            anchor: [0, 0],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'fraction',
                            src: 'widgets/vessels_inport/img/vessel_ico.png'
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
       // console.log('WidgetSettings:',$widget.settings,' Lat:',$widget.settings.marinetraffic_lat.value);
       
       
       
        $scope.getDatabaseWidgetVars($widget);
       
        $scope.appendLibraries();
        
        setTimeout(function() {
            
            var fb_url='ships/marinetraffic_inport/'+ $scope.city_key_marinetraffic+'/'+ $scope.today_key_with_hours+'';
            // console.log('Ships in port at url:'+fb_url);
            ckconfig.dat_fb.child(fb_url).on('value', function(myVal){
                   $scope.vessels_list = myVal.val();
                  // console.log("vessels list size:", $scope.vessels_list);
       	  
                   var proj_int= 'EPSG:4326';
                   var proj_ext= 'EPSG:3857';
            
                    //Event markers
                    var iconFeatures=[];
                    if($scope.vessels_list){
                        $.each( $scope.vessels_list , function(index, value) {
                            value.pos_long=parseFloat(value.pos_long);
                            value.pos_lat =parseFloat(value.pos_lat);
                            
                           if(value.ship_name && value.ship_type && value.ship_type==6){
                               
                               $scope.passenger_vessels_total++;
                               
                               // console.log('Ship:'+value.ship_name+" "+value.pos_lat+'/'+value.pos_long,index,value);
                               var iconFeature = new ol.Feature({
                                  geometry: new ol.geom.Point(ol.proj.transform([value.pos_long,value.pos_lat],proj_int,  proj_ext)),
                                  name: value.ship_name
                                  //name: 'NULL'
                                });
                                
                                var featureStyle=$scope.computeFeatureStyle(iconFeature);
                                iconFeature.setStyle(featureStyle);
                                iconFeatures.push(iconFeature);
                           }
    
                        });
                    }else{
                        //Call vpc server scripts
                        
                        //Marinetraffic
                        $.get( "bluehost/scripts/vpc/15_shipsinport_marinetraffic.php", function( data ) {    });
                        
                        //CruiseTT
                        $.get( "bluehost/scripts/vpc/12_shipsinport_cruisett.php", function( data ) {    });
                        
                        
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
                      center: ol.proj.transform([ $scope.map_center_lat, $scope.map_center_long], proj_int,proj_ext),
                      zoom: 15
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
 
    
     $scope.appendLibraries = function() 
    {
  
		        
		        if (!(typeof ol === 'object' && typeof ol.Map === 'object')) {
		        	// if($scope.widget.log)
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
