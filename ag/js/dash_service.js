angular.module('app').factory('dashSrv', function($rootScope, $http, fireSrv) {
  var dashSrv = {
    gridsterOptions: {
      margins: [20, 20],
      columns: 4,
      draggable: { handle: 'h3' }
    }
  };
  
  // PER COMUNICARE LE MODIFICHE AI CONTROLLLERS
  // https://www.codelord.net/2015/05/04/angularjs-notifying-about-changes-from-services-to-controllers/
  dashSrv.subscribe = function(scope, callback) {
    var handler = $rootScope.$on('notifying-service-event', callback);
    scope.$on('$destroy', handler);
  };
  dashSrv.notify = function() { $rootScope.$emit('notifying-service-event'); };
  
  // INIZIALIZZO LA DASHBOARD CARICANDOLA DA FB
  dashSrv.init = function(dash_name){
    dashSrv.name      = dash_name;
    dashSrv.title     = dash_name.replace(/^([a-z])/, function($1) { return $1.toUpperCase(); });
    dashSrv.timeZone  = 'Europe/Rome';
    fireSrv.db.ref('/dashboards/' + dash_name).once('value').then(function(snapshot) {
      var dash_info = snapshot.val();
      // cl("Letta dash", dash_info);
      $.extend(dashSrv, dash_info);
      dashSrv.notify();
    });
  };

  return dashSrv;
});