 
$root_scope=angular.element(document.querySelector('[ng-app=placeDash]')).scope();

(function() {

var W_ROW_SIZE    = 2;
var W_ARC_SPACING = 10;


function a_createArc(elem, settings) {
    
    console.log("a_createArc",elem,settings)
	var radius = settings.radius;
	
	var svg = d3.select(elem).append('svg')
		.attr('width', Math.ceil(radius * 2))
		.attr('height', Math.ceil(radius * 2));
	
	var field = svg.append('g')
		.attr('transform', 'translate(' + radius + ',' + radius + ')');
	
	var path = field.append('path')
		.attr('fill', settings.color);
	
	var num = field.append('text')
		.attr('x', 0)
		.attr('y', -4)
		.attr('text-anchor', 'middle')
		.text(parseInt(settings.amount));
	
	var den = field.append('text')
		.attr('x', 0)
		.attr('y', 14)
		.attr('text-anchor', 'middle')
		.text(parseInt(settings.total));
	
	var line = field.append('path')
		.attr('d', 'M -15 0 L 15 0 z')
		.attr('stroke-width', '0.5')
		.attr('stroke', '#000');
	
	a_updateArc(elem, settings);
}

function a_updateArc(elem, settings) {
	console.log("INNER", settings.radius - settings.size, settings.radius);
	var arc = d3.svg.arc(settings.radius - settings.size)
		.startAngle(0)
		.endAngle(
			parseFloat(settings.amount) / parseFloat(settings.total)
				* 2.0 * Math.PI
		)
		.innerRadius(settings.radius - settings.size)
		.outerRadius(settings.radius);
		// .cornerRadius(settings.cornerRadius);
	
	d3.select(elem).select('path')
		.attr('d', arc);
}


//Single instance controller
if (!(typeof $root_scope.VeniceAirbnbStatsController == 'function') ){  

  $root_scope.VeniceAirbnbStatsController = function($scope){ 
       
                    

   //Local scope functions
    $scope.initController = function($w)
    { 	
           var $widget = $('.airbnb-widget-stats'); 
           
           console.log("VeniceAirbnbStatsController.initController START");
           
           	var w_settings_base = {
				radius: 30,
				size: 10,
				cornerRadius: 2,
				color: '#330099'
			};
			var init=true;
			var location="Venezia, VE"; 
			var fb_url="airbnb/"+location+"/stats/last_update/widget_data/";  
			console.log(fb_url);
			
			//DB DATA
			ckconfig.dat_fb.child(fb_url).on('value', function(myVal){
			    
        			    $scope.air = myVal.val();
          
                        //Create or update arcs  
                         var arc_ids = ['booked_venice_arc', 'booked_islands_arc', 'booked_mestre_arc','booked_tot_arc'];
                         $.each(arc_ids, function(i, name) {
                              var tot=100;
                              var part=80;
                               if(name=="booked_venice_arc"){
                                   tot=100;
                                   part=$scope.air.TOT_BOOKED_VE_PERC;
                               }
                               else if(name=="booked_islands_arc"){
                                   tot=100;
                                   part=$scope.air.TOT_BOOKED_ISLANDS_PERC;
                               }
                               else if(name=="booked_mestre_arc"){
                                   tot=100;
                                   part=$scope.air.TOT_BOOKED_MESTRE_PERC;
                               }else if(name=="booked_tot_arc"){
                                   tot=100;
                                   part= parseInt(($scope.air.TOT_BOOKED_MESTRE_PERC+$scope.air.TOT_BOOKED_ISLANDS_PERC+$scope.air.TOT_BOOKED_VE_PERC)/3 );
                               }
                               
                               if (init) {
                    		     a_createArc(
                    					$widget.find('.arc[data-name="' + name + '"]')[0],
                    					($.extend({}, w_settings_base,{
                                			total: tot,
                                			amount: part 
                            	        }))
                    				);
                    	     	}else{		
                    				  a_updateArc(
                    					$widget.find('.arc[data-name="' + name + '"]')[0],
                    					($.extend({}, w_settings_base,{
                                			total: tot,
                                			amount: part
                            	        }))
                    				);
                    	     	}	
                         });//EACH
                         
            			init=false;
                    
         
        			 	console.log('Airbnb stats values:', $scope.air); 
        				
        				
			});//INIT
			
    };//INITCONTROLLEr
  
		      
		
   
  }//Controller


}//Function defined    

})();