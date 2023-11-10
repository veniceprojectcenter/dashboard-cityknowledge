placeDash.directive('geojsonmapCard', function() {
  return {
    scope: {
      widget: '=',
      geojson: '='
    },
    templateUrl: '/widgets/geojson_map/template.html',
    replace: true,
    restrict: 'E',
    controller: function($scope) {
      
    },
    link: function(scope, element) {
      console.log("element", element, scope.widget);
      console.log('...', $(element).find('.geojsonmap'));
      
      var my_id = new Date().getUTCMilliseconds() + '_' + parseInt(Math.random() * 1000);
      $(element).find('.geojsonmap').attr("id",my_id);
      $(element).find('.geojsonmap').css('height', (scope.widget.height * 160) + 'px');
      
      var map = L.map(my_id);
      L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      var geojsonLayer = L.geoJson.ajax(scope.geojson, {
      	style: function (feature) {
          return {color: feature.properties['marker-color'].replace('##', '#')};
        },
        onEachFeature: function (feature, layer) {
          layer.bindPopup(
            "<div class='my_popup'>" +
              "<b>" + feature.properties['name'] + "</b><br />" +
              feature.properties['type']+
            "</div>"
          );
        },
        pointToLayer: function(feature, latlng) {
          return new L.CircleMarker(latlng, {radius: 5, fillOpacity: 0.85});
          
          
          // return new L.CircleMarker(latlng, {radius: 10, fillOpacity: 0.85});
          
          // var myIcon = new L.icon({
          //   iconUrl: '/venice_map.gif',
          //   iconSize:     [38, 95], // size of the icon
          //   shadowSize:   [50, 64], // size of the shadow
          //   iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
          //   shadowAnchor: [4, 62],  // the same for the shadow
          //   popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
          // });
          // return new L.marker(latlng, {icon: myIcon}).addTo(map);
        }
      });

      geojsonLayer.on('data:loaded', function() {
        console.log("Geojson Loaded!", scope.geojson);
        map.fitBounds(geojsonLayer.getBounds());
      });
      
      var popup = L.popup();
      geojsonLayer.addTo(map).on('click', function(e) {
         //alert("ok");
         //popup
           //.setLatLng(e.latlng)
           //.setContent("You clicked the map at " + e.latlng.toString())
           //.openOn(map);
      });
    }
  };
});