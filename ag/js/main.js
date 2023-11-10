var FBURL ="https://ck-dashboard.firebaseio.com",
    FBKEY = "AIzaSyBfkujNSdRLpZ0uoQELWBK2_3hyobDVjEc",
    FBDOM = "ck-dashboard.firebaseapp.com",
    FBBKT = "ck-dashboard.appspot.com";
    
angular
  .module('app', ['gridster', 'ui.bootstrap', 'ngRoute', 'ngMap'])
  .config(['$routeProvider',
    function($routeProvider) {
      $routeProvider
        .when('/:dashboard', {
          templateUrl: 'tpl/dashboard/view.html',
          controller: 'DashboardCtrl',
          controllerAs: 'dc'
        })
        .otherwise({
          redirectTo: '/ATVO'
        });
    }
  ]);

var cl = function(){ console.log.apply(console, arguments) };
