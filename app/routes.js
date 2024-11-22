placeDash.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/', {
      templateUrl: 'app/controllers/dashboards/list.html',
      controller: 'DashboardsListController',
      title: 'Avaible Dashboards'
    }).
    when('/:dashboard', {
      templateUrl: 'app/controllers/dashboard/show.html',
      controller: 'DashboardShowController'
    }).
    otherwise({redirectTo: '/'});
}]);
