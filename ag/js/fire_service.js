var my_fire;
angular.module('app').factory('fireSrv', function() {
  var fireSrv = {
    databaseURL:   FBURL,
    apiKey:        FBKEY,
    authDomain:    FBDOM,
    storageBucket: FBBKT
  }
  fireSrv.main = firebase.initializeApp({
    databaseURL:   fireSrv.databaseURL,
    apiKey:        fireSrv.apiKey,
    authDomain:    fireSrv.authDomain,
    storageBucket: fireSrv.storageBucket
  });
  fireSrv.db = fireSrv.main.database();
  my_fire = fireSrv.main;
  
  fireSrv.setUser = function(user){
    console.log("Fire User", user)
    if (user) {
      fireSrv.isAnonymous = user.isAnonymous;
      fireSrv.uid = user.uid;
      fireSrv.email = user.email;
    } else {
      fireSrv.isAnonymous = undefined;
      fireSrv.uid = undefined;
      fireSrv.email = undefined;
    }
  };
  fireSrv.main.auth().onAuthStateChanged(fireSrv.setUser);
  fireSrv.setUser(fireSrv.main.auth().currentUser);
  
  fireSrv.auth = function(username, password) {
    fireSrv.main.auth().signInWithEmailAndPassword(username, password);
  };
  
  fireSrv.logout = function(){
    fireSrv.main.auth().signOut();
  };

  
  return fireSrv;
});
