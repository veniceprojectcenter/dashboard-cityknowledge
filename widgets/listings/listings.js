placeDash.directive('listingsCard', function() {
  return {
    scope: {
      widget: '=',
      city: '='
    },
    templateUrl: '/widgets/listings/template.html',
    replace: true,
    restrict: 'E',
    controller: function($scope) {
      
    },
    link: function(scope, element) {
      var today = new Date,
          tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000),
          tt = new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000),
          ref = new Firebase('https://testfox-9b363.firebaseio.com/Airbnb');
          //total = 0
      console.log("Start Listings", today);
      ref  //Today
        .child(scope.city)
        .child(
          (today.getFullYear()) +
          ('0' + (today.getMonth() + 1)).slice(-2) +
          ('0' + today.getDate()).slice(-2))
        .once('value', function(v){
          scope.today = v.val();
          //total += scope.today
          console.log("Listings Today", scope.today);
        });
      ref   //Tomorrow
        .child(scope.city)
        .child(
          (tomorrow.getFullYear()) +
          ('0' + (tomorrow.getMonth() + 1)).slice(-2) +
          ('0' + tomorrow.getDate()).slice(-2))
        .once('value', function(v){
          scope.tomorrow = v.val();
          //total += scope.tomorrow
        });
      ref  //Day After Tomorrow
        .child(scope.city)
        .child(
          (tt.getFullYear()) +
          ('0' + (tt.getMonth() + 1)).slice(-2) +
          ('0' + tt.getDate()).slice(-2))
        .once('value', function(v){
          scope.tt = v.val();
          //total += scope.tt
        });
    }
  };
});