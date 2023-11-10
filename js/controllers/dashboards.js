(function () {
  'use strict';

  dashboard.controller('CreateDashboardController', ['$scope', '$firebase', '$location', function ($scope, $firebase, $location) {
    document.title = 'City Knowledge Dashboards';

    $scope.createDashboard = function() {
      var dashboardName = $scope.dashboardName;
      var dashboardUrl = dashboardName.replace(/,/g, '-').replace(/ /g,'').toLowerCase();
      // var dashboardRef  = new Firebase(ckconfig.dbs_url + '/' + dashboardUrl);
      var dashboardRef = ckconfig.dbs_fb.child(dashboardUrl);
      dashboardRef.set({
        url: dashboardUrl,
        name: dashboardName,
        footerMessage: "Footer Message",
        subtitle: "subtitle",
        timeZone: 0,
        helpDocUrl: 'https://docs.google.com/document/d/1IRXSVG0kjCUGCBoIxZsDSk8nlU98XABB2B_1axjE1fk/pub?embedded=true',
        helpDocWidth: 800,
        helpDocHeight: 300,
        pageTitle: dashboardName + ' Dashboard',
        logos: [
          { url: 'https://wpi.edu', file: 'wpi.gif' }
        ]
      });

      $location.path(dashboardUrl);
    }

    $scope.attemptLogin = function() {
      // if ($scope.user.email == 'admin@cityknowledge.net' && $scope.user.password == 'password') {
      //   $scope.loggedIn = true;
      // }
      ckconfig.dbs_fb.authWithPassword({
        email    : $scope.user.email,
        password : $scope.user.password
      }, function (error, authData){
        if (error)
          alert("Login Failed!", error);
        else {
          $scope.loggedIn = true;
        }
      });
    }

    $scope.logout = function() {
      $scope.loggedIn = false;
    }

    // var settingsRef = new Firebase(ckconfig.dbs_url);
    // $firebase(settingsRef).$asObject().$bindTo($scope, 'settings').then(function() {
    //   debugger
    // });

    $firebase(ckconfig.dbs_fb).$asObject().$bindTo($scope, 'd').then(function() {
      $scope.dashboards = $.map($scope.d, function(dashboard) {
        if (dashboard && dashboard.name) {
          return dashboard;
        }
      });
    })

    $firebase(ckconfig.wdg_fb).$asObject().$bindTo($scope, 'w').then(function() {
      $scope.dashboardWidgets = $.map($scope.w, function(widget) {
        if (widget && widget.id) {
          return widget;
        }
      });
    })
  }]);
}());
