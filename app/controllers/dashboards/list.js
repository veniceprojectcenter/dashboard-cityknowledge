placeDash.controller('DashboardsListController', [
    '$scope', '$firebase', '$firebaseAuth', '$sce', '$routeParams', '$location', '$timeout', 'placeService',
    function ($scope, $firebase, $firebaseAuth, $sce, $routeParams, $location, $timeout, placeService) {
        
        document.title = 'Place Knowledge Available Dashboards';
        
        $scope.auth = $firebaseAuth(); // Initialize Firebase Auth
        
        $scope.loadingDsb = true;
        $scope.loadingWdg = true;
        placeService.checkUser ($scope);
        
        $scope.widgets = $firebase(ckconfig.wdg_fb.orderByKey()).$asArray();
        $scope.widgets.$loaded(function(){
            $scope.loadingWdg = false;
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
        
        // Modifica delle funzioni di login/logout/registrazione
        $scope.loginUser  = async function() {
            try {
                await placeService.loginUser ($scope);
            } catch (error) {
                console.error("Login Error:", error);
                alert("Login Failed: " + error.message);
            }
        };

        $scope.logoutUser  = async function() {
            try {
                await placeService.logoutUser ($scope);
            } catch (error) {
                console.error("Logout Error:", error);
                alert("Logout Failed: " + error.message);
            }
        };

        $scope.registerUser  = async function() {
            try {
                await placeService.registerUser ($scope);
            } catch (error) {
                console.error("Registration Error:", error);
                alert("Registration Failed: " + error.message);
            }
        };

        $scope.createDashboard = function() {
            if ($scope.loadingDsb) { alert('Wait until loading all dashboards'); return false; }
            $scope.dashboardName = $("input[ng-model='dashboardName']").val();
            if (('' + $scope.dashboardName).length < 4) { alert('At least 4 chars'); return false; }
            if (!ckconfig.dbs_fb) { alert('Not connected! Retry later'); return false; }

            var db_index = $scope.dashboards.findIndex(function(i){
                return ((''+ i.name) == $scope.dashboardName);
            });
            if (db_index > -1) { alert('Dashboard Name Already Exists'); return false; }

            // Logica per creare la dashboard
            // ... (aggiungi qui il codice per creare la dashboard)
        };
    }
]);
