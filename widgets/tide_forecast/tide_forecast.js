function colorsForTide(tide_level) {
	var red = "#c13e3e";      // >= +1.40m
	var orange = "#ee7c0e";   // +1.10m -> +1.39m
	var yellow = "#ffd300";   // +0.80m -> +1.09m
	var green = "#6cbe5f";    // -0.50m -> +0.79m
	var white = "#ffffff";    // -0.90m -> -0.51m
	var blue = "#0098d4";     // < -0.90m

	var background_color = "";
	var text_color = white;
	if (tide_level >= 1.40) {
		background_color = red;
	} else if (tide_level >= 1.10 && tide_level <= 1.39) {
		background_color = orange;
	} else if (tide_level >= 0.80 && tide_level <= 1.09) {
		background_color = yellow;
		text_color = "#000000";
	} else if (tide_level >= -0.50 && tide_level <= 0.79) {
		background_color = green;
	} else if (tide_level >= -0.90 && tide_level <= -0.51) {
		background_color = white;
	} else {
		background_color = blue;
	}

	return { 'backgroundColor': background_color, 'textColor': text_color };
}

// var tideRef = new Firebase('https://vpc.firebaseio.com').child('dashboard/current_tide_level');
var tideRef = ckconfig.dat_fb.child('current_tide_level');
tideRef.on('value', function(dataSnap) {
	var current_tide_height = dataSnap.val().tide_level;
	var direction = dataSnap.val().direction;
	if (direction == 1)
		$('#tide_direction').html("&#8593;");
	else
		$('#tide_direction').html("&#8595;");
	var current_tide_colors = colorsForTide(current_tide_height);
	$('#current_tide_height').text(current_tide_height);
	$('#current_tide_box').css({ 'color': current_tide_colors['textColor'], 'background-color': current_tide_colors['backgroundColor'] });
});

// var tideRef = new Firebase('https://vpc.firebaseio.com').child('dashboard/next_tide_peak');
var tideRef = ckconfig.dat_fb.child('next_tide_peak');
tideRef.on('value', function(dataSnap) {
	var next_tide_height = dataSnap.val().tide_level;
	var next_tide_time = dataSnap.val().time;
	var next_tide_colors = colorsForTide(next_tide_height);
	$('#next_tide_height').text(next_tide_height);
	$('#next_tide_time').text(next_tide_time);
	$('#next_tide_box').css({ 'color': next_tide_colors['textColor'], 'background-color': next_tide_colors['backgroundColor'] });
});

// var tideRef = new Firebase('https://vpc.firebaseio.com').child('dashboard/next_significant_tide');
var tideRef = ckconfig.dat_fb.child('next_significant_tide');
tideRef.on('value', function(dataSnap) {
	if (dataSnap.val() != "") {
		var next_significant_tide = dataSnap.val().tide_level;
		var next_significant_tide_time = dataSnap.val().time;
		var next_tide_colors = colorsForTide(next_significant_tide);
//alert(next_significant_tide);
		/*$('#next_tide_height').text(next_tide_height);
		$('#next_tide_time').text(next_tide_time);
		$('#next_tide_box').css({ 'color': next_tide_colors['text_color'], 'background-color': next_tide_colors['background_color'] });*/
	} else {
		//alert("0");
	}
});
