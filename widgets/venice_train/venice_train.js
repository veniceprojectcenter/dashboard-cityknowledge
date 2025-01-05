$root_scope = angular.element(document.querySelector('[ng-app=placeDash]')).scope();

var PERCENT_DAYTRIPPERS = 0.49623167;
var PERCENT_OVERNIGHTERS = 0.05181931;
vERCENT_DAYTRIPPERS + PERCENT_OVERNIGHTERS;
var PERCENT_COMMUTERS = 1 - PERCENT_TOURISTS;

//Single instance controller
if (!(typeof $root_scope.VeniceTrainController == 'function')) {

	$root_scope.VeniceTrainController = function($scope) {

		$scope.initController = function($widget) {

			function isObject(val) {
					if (val === null) {
							return false;
					}
					return ((typeof val === 'function') || (typeof val === 'object'));
			}
			
			function pad(str, val, length, after) {
					str = (str || '').toString().trim().substr(0, length);
					var joined = new Array(length + 1 - str.length).join(val);
					return after ? str + joined : joined + str;
			}
			
			function toFlappy(str) {
					var split = str.toString().split('');
					for (var i = 0; i < split.length; i++) {
							if (split[i] === ' ') {
									split[i] = '&nbsp;';
							}
					}
					return '<span class="flappy">' + split.join('</span><span class="flappy">') + '</span>';
			}
			
			function compare(a, b) {
				if (a.train.ora > b.train.ora) {
					return -1;
				} else if (a.train.ora < b.train.ora) {
					return 1;
				}
				if (a.train.min > b.train.min) {
					return -1;
				} else if (a.train.min < b.train.min) {
					return 1;
				}
				return 0;
			}

			var fb_url = '/venice_trains/trains';
			ckconfig.dat_fb.child(fb_url).on('value', function(myVal) {

				$scope.trains = myVal.val();

				var now = new Date();
				var hour = now.getHours().toString();

				var minute = now.getMinutes().toString();
				minute = pad(minute, '0', 2);

				var hour_minute = hour + minute;

				var arrived_so_far = 0;
				var last_arrived = 0;

				$scope.tracks = [];
				$scope.non_null_tracks = [];

				for (var i = 1; i < 30; i++)
					$scope.tracks.push(i);

				if ($scope.trains) {
					$.each($scope.trains, function(index, value) {
						// populate current track situation
						var track = value.track;

//					if (index < hour_minute) {

						hour_minute = $scope.clockHourMinute;
						console.log('UH!');
						console.log(hour_minute);
						


						if (parseInt(index) < parseInt(hour_minute)) { // check was failing sometimes
							$scope.tracks[track] = value;
							$scope.arrived_so_far = value.arrived_so_far;
							$scope.tourists = Math.round(value.arrived_so_far * PERCENT_TOURISTS);
							$scope.daytrippers = Math.round(value.arrived_so_far * PERCENT_DAYTRIPPERS);
							$scope.overnighters = Math.round(value.arrived_so_far * PERCENT_OVERNIGHTERS);
							$scope.commuters = Math.round(value.arrived_so_far * PERCENT_COMMUTERS);
						}
					});
				}

				var data;
				var count = 0;
				// remove unused tracks
				for (var i = 0; i < 30; i++) {
					if (isObject($scope.tracks[i])) {
						$scope.non_null_tracks.push(count);
						$scope.non_null_tracks[count] = $scope.tracks[i];
						$scope.tracks[i].track = pad(i + 1, ' ', 2);
						$scope.tracks[i].time = pad($scope.tracks[i].train.ora, '0', 2)
							 + ':' + pad($scope.tracks[i].train.min, '0', 2);
						$scope.tracks[i].provenance = pad($scope.tracks[i].train.provenienza, ' ', 12, true);
						$scope.tracks[i].row = toFlappy($scope.tracks[i].time
							+ $scope.tracks[i].provenance
							+ $scope.tracks[i].track
							+ pad($scope.tracks[i].train.occupation, ' ', 3));
						count++;
						console.log($scope.tracks[i]);
					}
				}
				$scope.non_null_tracks.sort(compare);
			});
		};
	};
};
