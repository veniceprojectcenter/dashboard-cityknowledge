angular.module('app').controller('DashboardCtrl', function($scope, $timeout, dashSrv) {
	var dash_ctl = this;
  dash_ctl.dash = dashSrv;
  dash_ctl.widgets = [];
	
	dash_ctl.dash.subscribe($scope, function somethingChanged() {
    // Handle notification
    // alert("Eccoci");
    console.log("Aggiungo Dash", dash_ctl.dash);
    dash_ctl.widgets = [];
    for (var key in dash_ctl.dash.widgetsInUse) {
    	w = dash_ctl.dash.widgetsInUse[key];
    	if (w.dashboardColumn) w.col   = w.dashboardColumn ;
			if (w.dashboardRow   ) w.row   = w.dashboardRow    ;
			if (w.height         ) w.sizeY = parseInt(w.height);
			if (w.width          ) w.sizeX = parseInt(w.width );
			if (!w.contentHTML   ) w.contentHTML = 'TBD';
			
			w.widget_name = w.id;
			w.id = key;
			
			if (!w.title) w.title = "Widget " + w.id;
			// helpDocUrl
			// title
			// url
			// url_title
			// console.log("Aggiungo widget", w);
			dash_ctl.widgets.push(w);
    };
    console.log("WW", dash_ctl.widgets);
    $scope.$apply();
  });
  

		$scope.clear = function() {
			$scope.dashboard.widgets = [];
		};

		$scope.addWidget = function() {
			$scope.dashboard.widgets.push({
				name: "New Widget",
				sizeX: 1,
				sizeY: 1
			});
		};

		// $scope.$watch('selectedDashboardId', function(newVal, oldVal) {
		// 	if (newVal !== oldVal) {
		// 		$scope.dashboard = $scope.dashboards[newVal];
		// 	} else {
		// 		$scope.dashboard = $scope.dashboards[1];
		// 	}
		// });
// 
		// // init dashboard
		// $scope.selectedDashboardId = '1';

	}
)

.controller('CustomWidgetCtrl', ['$scope', '$uibModal',
	function($scope, $uibModal) {

		$scope.remove = function(widget) {
			$scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
		};

		$scope.openSettings = function(widget) {
			$uibModal.open({
				scope: $scope,
				templateUrl: 'tpl/dashboard/widget_settings.html',
				controller: 'WidgetSettingsCtrl',
				resolve: {
					widget: function() {
						return widget;
					}
				}
			});
		};

	}
])

.controller('WidgetSettingsCtrl', ['$scope', '$timeout', '$rootScope', '$uibModalInstance', 'widget',
	function($scope, $timeout, $rootScope, $uibModalInstance, widget) {
		$scope.widget = widget;

		$scope.form = {
			name: widget.name,
			sizeX: widget.sizeX,
			sizeY: widget.sizeY,
			col: widget.col,
			row: widget.row
		};

		$scope.sizeOptions = [{
			id: '1',
			name: '1'
		}, {
			id: '2',
			name: '2'
		}, {
			id: '3',
			name: '3'
		}, {
			id: '4',
			name: '4'
		}];

		$scope.dismiss = function() {
			$uibModalInstance.dismiss();
		};

		$scope.remove = function() {
			$scope.dashboard.widgets.splice($scope.dashboard.widgets.indexOf(widget), 1);
			$uibModalInstance.close();
		};

		$scope.submit = function() {
			angular.extend(widget, $scope.form);

			$uibModalInstance.close(widget);
		};

	}
])
;
