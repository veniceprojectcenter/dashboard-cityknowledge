$.venice_tide_extensions = function($scope) {
  $scope.colorsForTide = function (tide_level) {
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
  };
  
  $scope.upDirection = function (direction) {
    
    if (direction == 1) {
      return '↑';
    }
    else {
      return '↓';

    }    

  };
  
  
  $scope.styleForTide = function (tide_level) {
    c = $scope.colorsForTide(tide_level);
    return "line-height:13px; font-weight: bold; " +
      "text-align:center; margin-top: 4px; "       +
      "width: 180px; height: 35px; "               +
      "padding: 3px 0; padding-top: 6px; "         +
      "color: "+c.textColor+"; "                   +
      "background-color: "+c.backgroundColor+";";
  };
};

// THANKS TO:
// https://stackoverflow.com/questions/22570357/angularjs-access-controller-scope-from-outside
$.venice_tide_extensions(
  angular.element(
    document.querySelector('[ng-app=placeDash]')
  ).scope()
);
