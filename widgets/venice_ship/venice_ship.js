$.venice_ship_extensions = function($scope) {
      if ($scope.vs) return true;
      $scope.vs = {
        arrivals_ship:   '0',
        departures_ship: '0',
        overnights_ship: '0',
        arrivals_pass:   '0',
        departures_pass: '0',
        overnights_pass: '0',
        arrivals_crew:   '0',
        departures_crew: '0',
        overnights_crew: '0',
        arrivals_tour:   '0',
        departures_tour: '0',
        overnights_tour: '0',
        week_ship: '0',
        week_pass: '0',
        week_crew: '0',
        week_tour: '0',
      };
      var now = new Date();
      var week = new Date();
      week.setDate(now.getDate() + 7);
      $scope.today_key = now.getFullYear()  +
        (" 00" + (now.getMonth() + 1)).slice(-2) +
        (" 00" + (now.getDate()  + 0)).slice(-2);
      $scope.week_key  = week.getFullYear() +
        (" 00" + (week.getMonth() + 1)).slice(-2) +
        (" 00" + (week.getDate()  + 0)).slice(-2);
      //$scope.today_key = '20150502';
      // $scope.week_key  = '20150820';
      // console.log('WEEK', $scope.today_key, $scope.week_key);
      $scope.vs_reduce = function(node, element){
        return _.reduce(
          _.pluck(node, 'ship'),
          function(memo, ship){
            return memo + $scope.data_ships[ship.toLowerCase().replace(/ /g, '_')][element];
          }, 0
        );
      };
      ckconfig.dat_fb.child('venice_ships/ship_capacities').once('value', function(myVal){
        $scope.data_ships = myVal.val();
        $scope.today_ships = {};
        ckconfig.dat_fb.child('venice_ships/arrivals/' + $scope.today_key).once('value', function(myVal2){
          $scope.today_ships.arrivals = myVal2.val();
          ckconfig.dat_fb.child('venice_ships/departures/' + $scope.today_key).once('value', function(myVal3){
            $scope.today_ships.departures = myVal3.val();
            ckconfig.dat_fb.child('venice_ships/overnight/' + $scope.today_key).once('value', function(myVal4){
              $scope.today_ships.overnights = myVal4.val();
       
                   
                  $scope.vs.arrivals_ship   = _.pluck($scope.today_ships.arrivals  , 'ship').length  ;
                  $scope.vs.departures_ship = _.pluck($scope.today_ships.departures, 'ship').length;
                  $scope.vs.overnights_ship = _.pluck($scope.today_ships.overnights, 'ship').length;
                  
                  $scope.vs.arrivals_pass   = $scope.vs_reduce($scope.today_ships.arrivals  , 'passengers')  ;
                  $scope.vs.departures_pass = $scope.vs_reduce($scope.today_ships.departures, 'passengers');
                  $scope.vs.overnights_pass = $scope.vs_reduce($scope.today_ships.overnights, 'passengers');
                  
                  $scope.vs.arrivals_crew   = $scope.vs_reduce($scope.today_ships.arrivals  , 'crew');
                  $scope.vs.departures_crew = $scope.vs_reduce($scope.today_ships.departures, 'crew');
                  $scope.vs.overnights_crew = $scope.vs_reduce($scope.today_ships.overnights, 'crew');
                  
                  $scope.vs.arrivals_tour   = parseInt(($scope.vs.arrivals_pass   + $scope.vs.arrivals_crew  ) * 0.95);
                  $scope.vs.departures_tour = parseInt(($scope.vs.departures_pass + $scope.vs.departures_crew) * 0.95);
                  $scope.vs.overnights_tour = parseInt(($scope.vs.overnights_pass + $scope.vs.overnights_crew) * 0.95);
                  
                  ckconfig.dat_fb.child('venice_ships/arrivals/').
                    orderByKey().
                    startAt($scope.today_key).
                    endAt($scope.week_key).
                    once('value', function(myValTot){
                      // console.log(myValTot.val());
                      var x = myValTot.val();
                      var flat = _.flatten(_.map(_.values(x), function(tmp){ return _.values(tmp); }))
                      $scope.vs.week_ship = flat.length;
                      $scope.vs.week_pass = $scope.vs_reduce(flat, 'passengers');
                      $scope.vs.week_crew = $scope.vs_reduce(flat, 'crew');
                      $scope.vs.week_tour = parseInt(($scope.vs.week_pass + $scope.vs.week_crew) * 0.95);
                      
                      //ckconfig.dat_fb.child('dashboard/vs').update($scope.vs);
     
              });    
            });
          });
        });
      });


     //CruiseTT Totals calc 
      $scope.city_key_cruisett     ='733-Venice'; 

      var now = new Date();   
      $scope.today_key_date = now.getFullYear()  +
          (" 00" + (now.getUTCMonth() + 1)).slice(-2) +
          (" 00" + (now.getUTCDate()  )).slice(-2)  
          ;

		  if(false)
		       $scope.today_key_date="20150710";
      
      var fb_url='ships/cruisett_arrivals/'+ $scope.city_key_cruisett+'/'+ $scope.today_key_date+'/';   
      // console.log('XXXXX:'+fb_url);
      ckconfig.dat_fb.child(fb_url).on('value', function(myVal){
                 $scope.ctt_values = myVal.val();
                 
                 $scope.ctt_values.port_load=parseInt($scope.ctt_values.port_load);
                 $scope.ctt_values.passengers=parseInt($scope.ctt_values.passengers);
                 $scope.ctt_values.overnight_ships=parseInt($scope.ctt_values.overnight_ships);
                 $scope.ctt_values.overnight_load_pass=parseInt($scope.ctt_values.overnight_load_pass);
                 $scope.ctt_values.overnight_load=parseInt($scope.ctt_values.overnight_load);
                 
                 //gET CREWS AND PASSENGERS
                 //If not present use port_load
                 //console.log('CruiseTT values before:',$scope.ctt_values);
                 if($scope.ctt_values.port_load>0 && $scope.ctt_values.passengers<=0 ){
                     
                         
                   //4%
                   $scope.ctt_values.crews               =parseInt($scope.ctt_values.port_load/100 * 4);
                   $scope.ctt_values.passengers          =$scope.ctt_values.port_load-$scope.ctt_values.crews;
                     
                 }
                 
                 if($scope.ctt_values.overnight_ships>0 && $scope.ctt_values.overnight_load_pass<=0 ){
                     //Use capacity if there is
                     if($scope.ctt_values.overnight_load>0){
                         
                         //4%
                         $scope.ctt_values.overnight_load_crews=parseInt($scope.ctt_values.overnight_load/100 * 4);
                         
                         $scope.ctt_values.overnight_load_pass =$scope.ctt_values.overnight_load-$scope.ctt_values.overnight_load_crews;
                         
                     }else{
                        //Invent some data??? 
                     }
                     
                 }
                 
                 //Inconsistent data
                 if($scope.ctt_values.crews<$scope.ctt_values.overnight_load_crews   ){
                     $scope.ctt_values.crews=$scope.ctt_values.overnight_load_crews ;
                 }
                  
 
				              
                // console.log('XXX: CruiseTT values after:',$scope.ctt_values);
      }); 

};

$.venice_ship_extensions(
  angular.element(
    document.querySelector('[ng-app=placeDash]')
  ).scope()
);