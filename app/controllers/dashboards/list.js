'use strict';

//placeDash.controller('DashListController', [
//           '$scope', '$firebase', '$sce', '$routeParams', '$location', 'dashboardService',
//  function ($scope ,  $firebase ,  $sce ,  $routeParams ,  $location ,  dashboardService) {
placeDash.controller('DashboardsListController', [
           '$scope', '$firebase', '$firebaseAuth', '$sce', '$routeParams', '$location', '$timeout', 'placeService',
  function ($scope ,  $firebase ,  $firebaseAuth ,  $sce ,  $routeParams ,  $location ,  $timeout ,  placeService) {
  
  document.title = 'Place Knowledge Avaible Dashboards';
  
  $scope.auth = $firebaseAuth(ckconfig.dbs_fb);
  
  $scope.loadingDsb = true;
  $scope.loadingWdg = true;
  placeService.checkUser($scope);
  
  $scope.widgets = $firebase(ckconfig.wdg_fb.orderByKey()).$asArray();
  $scope.widgets.$loaded(function(){
    $scope.loadingWdg = false;
    // $scope.widgets = $scope.widgets.filter(function(d) { return (d.title == 'Comune di Venezia' ? true : false); });
  });
  
  $scope.load_dashboards = function() {
    $scope.loadingDsb = true;
    $scope.dashboards = $firebase(ckconfig.dbs_fb.orderByKey()).$asArray();
    $scope.dashboards.$loaded(function(){
      $scope.dashboards = $scope.dashboards.filter(function(d) {
        return (d.name ? true : false);
      });
      $scope.loadingDsb = false;
    });
  };
  $scope.load_dashboards();
  
  $scope.loginUser = function() {
    return placeService.loginUser($scope);
  };
  $scope.logoutUser = function() {
    return placeService.logoutUser($scope);
  };
  $scope.registerUser = function() {
    return placeService.registerUser($scope);
  };
  $scope.createDashboard = function() {
    if ($scope.loadingDsb) { alert('Wait until loading all dasboards'); return false;      }
    // PER QUALCHE MOTIVO RIMANE IN CACHE...
    $scope.dashboardName = $("input[ng-model='dashboardName']").val();
    if (('' + $scope.dashboardName).length < 4) { alert('At least 4 chars'); return false; }
    if (!ckconfig.dbs_fb) { alert('Not connected! Retry later'); return false; }
    // DEBUG placeDash.dd = $scope.dashboards;
    // DEBUG placeDash.dn = $scope.dashboardName;
    var db_index = $scope.dashboards.findIndex(function(i){
      return (((''+ i.name) == $scope.dashboardName) ? true : false);
    });
    if (db_index > -1) { alert('Dashboard Name Already Exists'); return false; }
    
    var dashboardName = $scope.dashboardName;
    var dashboardUrl = dashboardName.replace(/,/g, '-').replace(/ /g,'').toLowerCase();
    var db_index = $scope.dashboards.findIndex(function(i){
      return (((''+ i.url) == dashboardUrl) ? true : false);
    });
    if (db_index > -1) { alert('Dashboard URL Already Exists'); return false; }

    $('div.modal.dashboard_new button.create-btn').attr("disabled", "disabled");
    ckconfig.dbs_fb.child(dashboardUrl).set({
      url: dashboardUrl,
      name: dashboardName,
      owner: $scope.user.email,
      owner_uid: ("simplelogin:"+$scope.user.uid),
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
    }, function(err){
      $('div.modal.dashboard_new button.create-btn').removeAttr("disabled");
      if (err) {
        alert('Error Creating Dashboard');
        console.log("Error Creating Dashboard:", err);
      } else {
        alert('Dashboard Succesfully Created!');
        // l'elenco delle $scope.dashboards dovrebbe aggiornarsi da solo...
        $scope.$apply(function(){ $scope.load_dashboards() });
        $('div.modal.dashboard_new').modal('hide');
      }
    });
  };
}]);