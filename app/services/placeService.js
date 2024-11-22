placeDash.factory('placeService', [
           '$firebase', '$firebaseAuth', '$sce', '$routeParams', '$location', '$timeout', '$interval',
  function ($firebase ,  $firebaseAuth ,  $sce ,  $routeParams ,  $location ,  $timeout ,  $interval) {

  var result = {};
  result.checkUser = function(my_scope) {
    my_scope.loggedIn = false;
    my_scope.user = { email: '', password: '', passwordconfirm: '', uid: 99 };
    $timeout(function(){
      var authData = ckconfig.dbs_fb.getAuth();
      if (authData) {
        console.log("Auth Data:", authData);
        my_scope.loggedIn = true;
        my_scope.user.email = authData.password.email;
        my_scope.user.uid = authData.uid;
        // console.log(authData.uid);
        my_scope.user.uid = authData.uid.split(':')[1];
      }
    }, 500);
  };
  result.loginUser = function(my_scope) {
    if (('' + my_scope.user.email   ).length < 4) { alert('Specify an E-Mail' ); return false; }
    if (('' + my_scope.user.password).length < 6) { alert('Password too short'); return false; }

    $('div.modal.login button.login-btn').attr("disabled", "disabled");
    ckconfig.dbs_fb.authWithPassword({
      email    : my_scope.user.email,
      password : my_scope.user.password
    }, function (error, authData){
      console.log("Auth Data:", authData);
      $('div.modal.login button.login-btn').removeAttr("disabled");
      if (error)
        alert("Login Failed!", error);
      else {
        // FORCE UPDATE
        my_scope.$apply(function(){
          my_scope.loggedIn = true;
          my_scope.user.password = '';
          my_scope.user.uid = authData.uid;
        });
        $('div.modal.login').modal('hide');
      }
    });
  };
  result.logoutUser = function(my_scope) {
    // NON SERVE PERCHE' IL METODO E' DI ANGULAR...
    // $scope.$apply(function(){ $scope.loggedIn = false; });
    ckconfig.dbs_fb.unauth();
    my_scope.loggedIn = false;
    my_scope.user.password = '';
    return false;
  };
  result.registerUser = function(my_scope) {
    if (('' + my_scope.user.email   ).length < 4) { alert('Specify an E-Mail' ); return false; }
    if (('' + my_scope.user.password).length < 6) { alert('Password too short'); return false; }
    if (('' + my_scope.user.password) != ('' + my_scope.user.passwordconfirm)) {
      alert('Password do not match'); return false;
    }
    $('div.modal.register button.login-btn').attr("disabled", "disabled");
    ckconfig.dbs_fb.createUser({
      email    : my_scope.user.email,
      password : my_scope.user.password
    }, function(error, userData) {
      $('div.modal.register button.login-btn').removeAttr("disabled");
      if (error) {
        alert("Error creating user: " + error);
        console.log("Error creating user:", error);
      } else {
        // console.log("Successfully created user account with uid:", userData.uid);
        my_scope.$apply(function(){
          my_scope.loggedIn = true;
          my_scope.user.password = '';
        });
        $('div.modal.register').modal('hide');
      }
    });
  };

  return result;
}]);
