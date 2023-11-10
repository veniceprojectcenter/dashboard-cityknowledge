angular.module('app').directive('jsonmap', function(NgMap, $http) {
  return {
    scope: {
      center: '@center',
      zoom: '@zoom',
      json: '@json',
      refresh: '@refresh'
    },
    templateUrl: '/ag/widgets/jsonmap/jsonmap.html',
    replace: true,
    restrict: 'E',
    transclude: true,
    controller: function($scope) {
      
    },
    link: function(scope, element, attrs, ctrl, transclude) {
      // http://stackoverflow.com/questions/15881453/angularjs-accessing-dom-elements-inside-directive-template
      // var my_map = $(element.find('ng-map'));
      var my_map = $(element), my_ngmap;
      cl("ZOOME e CENTER", "--" + scope.zoom + "--", scope.center);
      
      // gestione ridimensionamento
      var resizeMap = function(){
        // cl("Imposto altezza di", my_map, element, (my_map.parent().parent().innerHeight() + 2 - 70) + 'px');
        my_map.css('height', (my_map.parent().parent().innerHeight() + 2 - 70) + 'px');
      };
      my_map.resize(resizeMap);
      setTimeout(resizeMap, 250);
      
      scope.features = [];
      var load_features = function(jsonurl){
        cl("Features Loading...", jsonurl);
        // scope.features = [{"lat":45.508003333333335,"lng":12.636388333333333,"linea":"25","speed":1,"veicolo":"1_ATVO_0001"}];
        $http({
          method: 'GET',
          url: jsonurl
        }).then(function successCallback(response) {
          cl("Features Loaded", jsonurl);
          scope.features = response.data;
        }, function errorCallback(response) {
          cl("Error getting positions", jsonurl);
          // alert("Error getting positions");
        });
      };
      var load_jsons = function(){
        scope.json.forEach(function(i){ load_features(i); });
      };
      NgMap.getMap(my_map).then(function(map) {
        if (!Array.isArray(scope.json)) scope.json = [scope.json];
        cl("Imposto Zoom --" + parseInt(scope.zoom) + '--', scope.json);
        my_ngmap = map;
        setTimeout(function(){
          my_ngmap.setZoom(parseInt(scope.zoom));
          load_jsons();
          if (parseInt(scope.refresh) > 0) setInterval(load_jsons, parseInt(scope.refresh));
        }, 250);
      });
    }
  };
});
