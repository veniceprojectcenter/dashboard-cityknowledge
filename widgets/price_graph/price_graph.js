placeDash.directive('priceGraphCard', function() {
  return {
    scope: {
      widget: '=',
      city: '=',
      days: '='
    },
    templateUrl: '/widgets/price_graph/template.html',
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
            label: 'Listings Avarage Price',
            data: [],
            borderColor: "rgba(75,192,192,1)",
          }]
        }
      };
      
      var today = new Date,
          ref = new Firebase('https://testfox-9b363.firebaseio.com/Airbnb/'),
          myChart;
      today = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
      for(var i = (scope.days - 1); i >= 0; i -= 1){
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
              var tot = 0, avp = 0;
              if (tmp) {
                for (var key in tmp) { tot += tmp[key].AvgPrice; }
                avp = tot / Object.keys(tmp).length;
              }
              console.log("Today Price", today, avp);
              chart_options.data.datasets[0].data[i] = avp;
              //chart_options.data.datasets[1].data[i] = (tmp ? tmp['Cannaregio'].numListings : 0);
              //chart_options.data.datasets[2].data[i] = (tmp ? tmp['Castello'].numListings : 0);
              //chart_options.data.datasets[3].data[i] = (tmp ? tmp['San Marco'].numListings : 0);
              if (i >= (scope.days - 1)) {
                setTimeout(function(){
                  myChart = new Chart(chart, chart_options);
                  $(element).find('.chart').css('height', '300px')
                }, 1000);
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
