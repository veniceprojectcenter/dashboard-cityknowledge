dashboard.factory('dashboardService', ['$firebase', function dashboardService($firebase) {
  var _url = ckconfig.dbs_url;
  // var _ref = new Firebase(_url)
  var _ref = ckconfig.dbs_fb;

  return {
    // setListToScope: function(scope, localScopeVarName) {
    //   angularFire(_ref, scope, localScopeVarName);
    // },
    // addItem: function(item){
    //   _ref.push(item);
    // },
    // removeAll: function(){
    //   _ref.remove();
    // },
    // deleteItem: function(id){
    //   var itemRef = new Firebase(_url + '/' + id);
    //   itemRef.remove();
    // }

    setDashboardConfigurationToScope: function(scope, localScopeVarName, dashboardName) {
      $firebase($firebase(_ref).$ref().child(dashboardName)).$asObject().$bindTo(scope, localScopeVarName);
    }
  };
}]);
