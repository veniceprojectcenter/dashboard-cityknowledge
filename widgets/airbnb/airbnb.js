$root_scope=angular.element(document.querySelector('[ng-app=placeDash]')).scope();

(function() {

var ROW_SIZE = 4;
var ARC_SPACING = 20;

var districts = ['Cannaregio', 'Castello', 'DorsoduroAccademia', 'SanMarco', 'SanPolo', 'SantaCroce', 'total'];

var special = {
/*	others: function(val) {
		var total = val.city_total_rooms_est - val.neighborhood_rooms_total;
		return {
			total: total,
			amount: total * 0.8
		};
	},*/
	total: function(val) {
		return {
			total: val.totalRooms,
			amount: val.bookedRooms,
			color: '#73b158'
		};
	}
};

// settings:
//   radius: arc radius
//   size: arc size
//   cornerRadius: rounded corner radius
//   color: arc color
//   amount: amount
//   total: total
function createArc(elem, settings) {
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
	
	updateArc(elem, settings);
}

function updateArc(elem, settings) {
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

function getSettings(val, name, settings) {
	return $.extend({}, settings,
		name in special ? special[name](val) : {
			total: val.neighborhood_rooms[name],
			amount: val.neighborhoods_diff[name]
		});
}

if (!(typeof $root_scope.VeniceAirbnbController == 'function')) {
	
	$root_scope.VeniceAirbnbController = function($scope) {
		
		//Local scope functions
		$scope.initController = function($w) {
			var $widget = $('.airbnb-widget');
			var settings = {
				radius: ($widget.width() - (ROW_SIZE - 1) * ARC_SPACING) / ROW_SIZE / 2,
				size: 15,
				cornerRadius: 2,
				color: '#330099'
			};
			
			var init = false;
			var location="Venezia, VE"; 
			var fb_url="airbnb/"+location+"/stats/last_update/";    
			
			ckconfig.dat_fb.child(fb_url).on('value', function(myVal){
				var val = myVal.val();
				val.rooms_price_per_night_avg = Math.round(val.rooms_price_per_night_avg);
				
				
				var others = val.city_total_rooms_est - val.neighborhood_rooms_total;
				/*
				val.totalRooms = Math.round(val.city_total_rooms_est - others);
				val.bookedRooms = Math.round((val.city_total_rooms_est - val.neighborhood_rooms_total) * 0.8 - others + val.neighborhood_rooms_total_diff);
				*/
				 
				val.totalRooms  = val.widget_data.TOT_LISTINGS_VE  ;
				val.bookedRooms = val.widget_data.TOT_BOOKED_VE;
				val.bookedBeds =  val.widget_data.TOT_BEDS_VE* (val.bookedRooms/val.totalRooms);
				//val.widget_data.TOT_BEDS_ISLANDS+val.widget_data.TOT_BEDS_MESTRE+val.widget_data.TOT_BEDS_VE
				
				
				if (init) {
					$.each(districts, function(i, name) {
						updateArc(
							$widget.find('.arc[data-name="' + name + '"]')[0],
							getSettings(val, name, settings)
						);
					});
				} else {
					$.each(districts, function(i, name) {
						createArc(
							$widget.find('.arc[data-name="' + name + '"]')[0],
							getSettings(val, name, settings)
						);
					});				
					
					init = true;
				}
				
				// val.rooms_avg_occupancy_year = parseInt(100.00 - val.rooms_avg_availability_year);
				val.rooms_avg_occupancy_year = parseInt(100.00 * val.bookedRooms / val.totalRooms);
				
				$scope.airbnb_stats_values = val;
				console.log('Airbnb stats values:', $scope.airbnb_stats_values);
			});
		};
	}//Controller
}//Function defined    

})();