$.mt_extensions = function($scope) {

    ckconfig.dat_fb.child('dashboard/nmroads/tweets').on('value', function(myVal){
         
         $scope.pippo = myVal.val();
         // console.log("dati", $scope.pippo);
   });
  

};

$.mt_extensions(
  angular.element(
    document.querySelector('[ng-app=placeDash]')
  ).scope()
);
