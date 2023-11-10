dashboard.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/create.html',
        controller: 'CreateDashboardController',
        title: 'Create Dashboard'
      }).
      when('/:dashboard', {
        templateUrl: 'partials/dashboard.html',
        controller: 'DashboardController'
      }).
      when('/widgets/new', {
        templateUrl: 'partials/new-widget.html',
        controller: 'NewWidgetController'
      }).
      when('/widget_elements/new', {
        templateUrl: 'partials/new-widget-element.html',
        controller: 'NewWidgetElementController'
      });
    }
]);
