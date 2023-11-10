angular.module('app').controller('RootCtrl', function($scope, fireSrv, dashSrv) {
  var root_ctl = this;
  root_ctl.dash = dashSrv;
  root_ctl.fire = fireSrv;
  
  $scope.$on('$locationChangeStart', function(e, next, current) {
    root_ctl.page = next.split('/').splice(-1)[0];
    root_ctl.dash.init(root_ctl.page);
    // $scope.styleUrl = 'tpl/' + $scope.page + '/style.css'
  });
  
  root_ctl.current_date = function(){
    $('#current_date').html(moment().tz(root_ctl.dash.timeZone || 'Europe/Rome').format('llll'));
  }
  setInterval(root_ctl.current_date, 1000);
  
  root_ctl.auth = function(){
    root_ctl.fire.auth('minni@osti.co', 'tomaso');
    setTimeout(function(){ $scope.$apply() },  750)
  };
  
  root_ctl.logout = function(){
    root_ctl.fire.logout();
    setTimeout(function(){ $scope.$apply() },  750)
  }
});