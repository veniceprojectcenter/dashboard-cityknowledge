placeDash.directive('hotelsGraphCard', function() {
  return {
    scope: {
      widget: '=',
      city: '=',
      days: '='
    },
    templateUrl: '/widgets/hotels_graph/template.html',
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
            label: 'Free Rooms',
            data: []
          }]
        }
      };
      
      var today = new Date,
          ref = new Firebase('https://venicedata.firebaseio.com/dashdata/hotels/'),
          myChart;
      today = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
      for(var i = (scope.days - 1); i >= 0; i -= 1){
        // console.log("STEP", i);
        (function (d, i) {
          ref
            .child(scope.city)
            .child(
              d.getFullYear() +
              ('0' + (d.getMonth() + 1)).slice(-2) +
              ('0' + d.getDate()).slice(-2))
            .once('value', function(v){
              var tmp = v.val();
              chart_options.data.labels[i] = d.getDate() + '/' + (d.getMonth() + 1);
              chart_options.data.datasets[0].data[i] = (tmp ? tmp.tot.rooms : 0);
              if (i >= (scope.days - 1)) {
                myChart = new Chart(chart, chart_options);
                $(element).find('.chart').css('height', '300px')
              }
            });
        }(new Date(today.getTime() - i * 24 * 60 * 60 * 1000), (scope.days - i - 1)));
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
