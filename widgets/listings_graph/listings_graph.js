placeDash.directive('listingsGraphCard', function() {
  return {
    scope: {
      widget: '=',
      city: '=',
      days: '='
    },
    templateUrl: '/widgets/listings_graph/template.html',
    replace: true,
    restrict: 'E',
    controller: function($scope) {
      
    },
    link: function(scope, element) {
      var chart = $(element).find('.chart');
      console.log(chart);
      
      var chart_options = {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'Available Listings',
            data: [],
            borderColor: "rgba(75,192,192,1)",
          }, {
            label: 'Total of presences',
            data: [],
            borderColor: "rgba(75,192,75,1)",
          }]
        }
      };
      
      var today = new Date,
          ref = new Firebase('https://testfox-9b363.firebaseio.com/Airbnb/'),
          myChart;
      // ref.child('Venezia, VE').child('Hosts').once('value', function(v){
      //   var tot = v.val();
      //   var res = ""
      //   for (var key in tot) {
      //     res += "'" + key + "': " + Object.keys(tot[key]).length + ",\n";
      //   }
      //   console.log(res);
      // });
      var rooms = {
        'Cannaregio': 243,
        'Castello': 244,
        'Dorsoduro Accademia': 69,
        'Giudecca': 12,
        'Lido': 43,
        'Murano': 9,
        'San Marco': 114,
        'San Polo': 87,
        'Santa Croce': 64,
      };
      today = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
      for(var i = 0; i <= (scope.days - 1); i += 1){
        // console.log("STEP", i);
        (function (d, i) {
          ref  //Today
            .child(scope.city)
            .child(
              (today.getFullYear()) +
              ('0' + (d.getMonth() + 1)).slice(-2) +
              ('0' + d.getDate()).slice(-2))
            .once('value', function(v){
              var tmp = v.val();
              chart_options.data.labels[i] = d.getDate() + '/' + (d.getMonth() + 1);
              console.log("Dati", scope.city, (today.getFullYear()) +
              ('0' + (d.getMonth() + 1)).slice(-2) +
              ('0' + d.getDate()).slice(-2), tmp);
              var tot = 0, tot_full = 0;
              if (tmp)
                for (var key in tmp) {
                  if (rooms[key] > tmp[key].numListings) tot_full += (rooms[key] - tmp[key].numListings) * 2.3;
                  tot += tmp[key].numListings;
                }
              chart_options.data.datasets[0].data[i] = tot;
              chart_options.data.datasets[1].data[i] = tot_full;
              //chart_options.data.datasets[1].data[i] = (tmp ? tmp['Cannaregio'].numListings : 0);
              //chart_options.data.datasets[2].data[i] = (tmp ? tmp['Castello'].numListings : 0);
              //chart_options.data.datasets[3].data[i] = (tmp ? tmp['San Marco'].numListings : 0);
              if (i == (scope.days - 1)) {
                setTimeout(function(){
                  myChart = new Chart(chart, chart_options);
                  $(element).find('.chart').css('height', '300px')
                }, 1000);
              }
            });
        }(new Date(today.getTime() - (scope.days - i - 1) * 24 * 60 * 60 * 1000), i));
      }
      
      // var today = new Date,
      //     tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000),
      //     ref = new Firebase('https://venicedata.firebaseio.com/dashdata/hotels/');
      // ref
      //   .child(scope.city)
      //   .child(
      //     today.getFullYear() +
      //     ('0' + (today.getMonth() + 1)).slice(-2) +
      //     ('0' + today.getDate()).slice(-2))
      //   .once('value', function(v){
      //     scope.today = v.val();
      //   });
      // ref
      //   .child(scope.city)
      //   .child(
      //     tomorrow.getFullYear() +
      //     ('0' + (tomorrow.getMonth() + 1)).slice(-2) +
      //     ('0' + tomorrow.getDate()).slice(-2))
      //   .once('value', function(v){
      //     scope.tomorrow = v.val();
      //   });
    }
  };
});
