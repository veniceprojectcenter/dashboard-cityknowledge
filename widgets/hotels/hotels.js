placeDash.directive('hotelsCard', function() {
  return {
    scope: {
      widget: '=',
      city: '='
    },
    templateUrl: '/widgets/hotels/template.html',
    replace: true,
    restrict: 'E',
    controller: function($scope) {
      
    },
    link: function(scope, element) {
      // console.log("Citta", scope.city);
      // console.log("widget", scope.widget);
      // https://venicedata.firebaseio.com/
      var today = new Date,
          tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000),
          ref = new Firebase('https://venicedata.firebaseio.com/dashdata/hotels/');
      ref
        .child(scope.city)
        .child(
          today.getFullYear() +
          ('0' + (today.getMonth() + 1)).slice(-2) +
          ('0' + today.getDate()).slice(-2))
        .once('value', function(v){
          scope.today = v.val();
        });
      ref
        .child(scope.city)
        .child(
          tomorrow.getFullYear() +
          ('0' + (tomorrow.getMonth() + 1)).slice(-2) +
          ('0' + tomorrow.getDate()).slice(-2))
        .once('value', function(v){
          scope.tomorrow = v.val();
        });
    }
  };
});
