
  dashboard.controller('DashboardController', ['$scope', '$firebase', '$sce', '$routeParams', '$location', 'dashboardService', function ($scope, $firebase, $sce, $routeParams, $location, dashboardService) {
    dashboardService.setDashboardConfigurationToScope($scope, 'dashboardConfiguration', $routeParams.dashboard);

    // var firebaseUrl = ckconfig.dbs_url + '/' + $routeParams.dashboard;

    $scope.$watch('dashboardConfiguration', function() {
      if ($scope.dashboardConfiguration && !$scope.dashboardConfiguration.name) {
        $location.path('/');
      }

      if ($scope.dashboardConfiguration) {
        document.title = $scope.dashboardConfiguration.pageTitle;
      }

      $(".sortable").sortable({
        stop: function(event, ui) {
          // var logosRef = new Firebase(firebaseUrl + '/logos');
          var logosRef = ckconfig.dbs_fb.child($routeParams.dashboard).child('logos');
          logosRef.remove();

          var nodes = ui.item.parent().children();
          for (var i = 0; i < nodes.length; i++) {
            logosRef.push({ 'url': $(nodes[i]).data('url'), 'file': $(nodes[i]).data('file') });
          }
        }
      });
    });

    // var settingsRef = new Firebase(firebaseUrl);
    // var widgetsRef = new Firebase(ckconfig.wdg_url);
    var settingsRef = ckconfig.dbs_fb.child($routeParams.dashboard);
    var widgetsRef = ckconfig.wdg_fb;

    
    $firebase(ckconfig.dat_fb.child('current_tide_level/tide_level')).$asObject().$bindTo($scope, 'tideLevel').then(function() {
      $scope.highTide = $scope.tideLevel.$value >= 0.90;
    });

    $scope.saveWidgetTitle = function(widget) {
      updateWidgetGeneralSetting(widget, 'title', $scope.settingsWidget.title);
    }

    $scope.saveWidgetHelpDocUrl = function(widget) {
      updateWidgetGeneralSetting(widget, 'helpDocUrl', $scope.settingsWidget.helpDocUrl);
    };

    $scope.saveWidgetUrl = function(widget) {
      updateWidgetGeneralSetting(widget, 'url', $scope.settingsWidget.url);
    };

    $scope.saveWidgetUrlTitle = function(widget) {
      updateWidgetGeneralSetting(widget, 'urlTitle', $scope.settingsWidget.urlTitle);
    };

    $scope.saveWidgetContent = function(widget) {
      var set = false;
      widgetsRef.on('value', function (snapshot) {
        snapshot.forEach(function(w) {
          if (w.val().id == widget.id) {
            if (!set) {
              w.child('contentHTML').ref().set($scope.settingsWidget.contentHTML);
              set = true;
              return;
            }
          }
        });
      });
    }

    $scope.updatePageTitle = function(widget) {
      document.title = $scope.dashboardConfiguration.pageTitle;
    };

    var updateWidgetGeneralSetting = function(widget, setting, value) {
      var set = false;
      settingsRef.child('widgetsInUse').on('value', function (snapshot) {
        snapshot.forEach(function(w) {
          if (w.val().id == widget.id) {
            if (!set) {
              w.child(setting).ref().set(value);
              set = true;
              return;
            }
          }
        });
      });
    }

    $scope.loginUser = function() {
      // if ($scope.user.email == 'admin@cityknowledge.net' && $scope.user.password == 'password') {
      //   $scope.isAdmin = true;
      //   $('.modal.login').modal('hide');
      // }
      ckconfig.dbs_fb.authWithPassword({
        email    : $scope.user.email,
        password : $scope.user.password
      }, function (error, authData){
        if (error)
          alert("Login Failed!", error);
        else {
          $scope.isAdmin = true;
          $('.modal.login').modal('hide');
        }
      });
    }

    $scope.htmlSafe = function(html_code) {
      return $sce.trustAsHtml(html_code);
    }

    setInterval(updateClock, 1000);
    function updateClock() {
      $scope.clock = moment().utc().add($scope.settings ? $scope.dashboardConfiguration.timeZone : 0, 'hours').format('ddd D MMM @ HH:mm:ss');
      $scope.clockHourMinute = moment().utc().add($scope.settings ? $scope.dashboardConfiguration.timeZone : 0, 'hours').format('HH:mm');

      $scope.$apply();
    }

    $firebase(ckconfig.wdg_fb).$asObject().$bindTo($scope, 'w').then(function() {
      $scope.widgets = $.map($scope.w, function(widget, i) {
        if (widget && widget != 'widgets') {
          return widget;
        }
      });
    })

    $scope.widgetSetting = function(widget, label) {
      return _.find(widget.settings, function(setting) { return (setting.label == label) });
    }
    $scope.updateWidgetSetting = function(widget, setting) {
      widgetsRef.on('value', function(snapshot) {
        snapshot.forEach(function(w) {
          if (w.val().id == widget.id) {
            var settings = w.child('settings').val();
            var key = _.find(Object.keys(settings), function(key) { return settings[key].label == setting.label });
            settingsRef.child('widgetsInUse').on('value', function (snapshot) {
              var widgetsInUse = snapshot;
              widgetsInUse.forEach(function(w) {
                w.child('settings').child(key).ref().set({ label: setting.label, value: setting.value });
                return;
              });
            });
            return;
          }
        }.bind(setting));
      }.bind(setting));
    }

    settingsRef.child('widgetsInUse').on('value', function (snapshot) {
      var widgetsInUse = snapshot;
      var widgets = [];
      widgetsInUse.forEach(function(w) {
        var widget = w.val();
        widget.row = widget.dashboardRow;
        widget.column = widget.dashboardColumn;
        widgets.push(widget);
      });
      $scope.widgetsInUse = widgets;
    });

    $scope.gridsterOpts = {
      columns: 6,
      colWidth: 195,
      rowHeight: 205,
      margins: [1, 1],
      pushing: false,
      floating: false,
      draggable: { enabled: true }
    };

    $scope.addSelectedWidget = function() {
      var widget = $scope.widgetToAdd;
      var id = widget.id;
      var title = widget.title;
      var width = widget.width;
      var height = widget.height;
      var helpDocUrl = widget.helpDocUrl;
      var url = widget.url;
      var urlTitle = widget.urlTitle;
      var log = widget.log;
      var widgetSettings = widget.settings || {};
      var row = 0;
      while (true) {
        for (var col = 0; col <= 5; col++) {
          var goodSpaces = 0;
          for (var i = 0; i < width; i++) {
            if (spaceOccupied(row, col)) {
              break;
            } else {
              goodSpaces++;
            }
            if (goodSpaces == width) {
              $firebase(settingsRef.child('widgetsInUse')).$push({id: id, title: title, width: width, height: height, dashboardRow: row, dashboardColumn: col, helpDocUrl: helpDocUrl, url: widget.url, urlTitle: urlTitle, settings: widgetSettings, log: log });
              $scope.$apply();
              $('.modal').modal('hide');
              return;
            }
          }
        }
        row++;
      }
    };

    $scope.deleteWidget = function(row, col) {
      settingsRef.child('widgetsInUse').on('value', function (snapshot) {
        var widgetsInUse = snapshot;
        var widgets = [];
        widgetsInUse.forEach(function(w) {
          var widget = w.val();
          if (row == widget.dashboardRow && col == widget.dashboardColumn) {
            w.ref().remove();
            $scope.deleteIcons = false;
            return;
          }
        });
      });
    };

    $scope.showSettings = function(widget) {
      $scope.settingsWidget = widget;
      $scope.settingsWidget.contentHTML = $scope.widgetContent(widget);
      $('.widget-config').modal('show');
    };

    $scope.removeLogo = function(logo) {
      // var logosRef = new Firebase(firebaseUrl + '/logos');
      var logosRef = ckconfig.dbs_fb.child($routeParams.dashboard).child('logos');
      logosRef.on('value', function (snapshot) {
        for (firebaseLogo in snapshot.val()) {
          var obj = snapshot.val()[firebaseLogo];
          if (logo.file == obj.file && logo.url == obj.url) {
            snapshot.ref().child(firebaseLogo).remove();
          }
        }
      });
    }

    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    };

    $scope.showWidgetAbout = function(widget) {
      $('.widget-help-' + widget.id).modal('show');
    };

    $scope.showWidgetLogs = function(widget) {
      $('.widget-logs-' + widget.id).modal('show');
      // var dashboardRef = new Firebase('https://vpc.firebaseio.com/dashboard/tideLog');
      var dashboardRef = ckconfig.log_fb.child('tideLog');
      dashboardRef.on('value', function (snapshot) {
        var data = $.map(snapshot.val(), function(value, index) {
          value.timestamp = new Date(value.timestamp);
          return [value];
        });
        data_graphic({
          title: "Venice Tides",
          description: "This chart displays the Punta Salute tide heights recorded in Venice every 5 minutes.",
          data: data,
          width: 850,
          height: 300,
          target: '.widget-log-chart-' + widget.id,
          x_accessor: 'timestamp',
          y_accessor: 'puntaSalute',
          area: false,
          baselines: [{'value': 1.1, 'label': 'Very high tide'},
                      {'value': 0.8, 'label': 'High tide'},
                      {'value': -0.5, 'label': 'Normal tide'},
                      {'value': -0.9, 'label': 'Tide under normal level'}]
        });
      });
    };

    function spaceOccupied(row, col) {
      var occupied = false;
      $scope.widgetsInUse.forEach(function(widget) {
        var rowOccupied = (widget.row == row || (row > widget.row && row <= widget.row + widget.height - 1));
        var columnOccupied = (widget.column == col || (col > widget.column && col <= widget.column + widget.width - 1));
        if (!occupied && rowOccupied && columnOccupied) {
          occupied = true;
        }
      });
      return occupied;
    }

    $scope.widgetContent = function(widget) {
      var content = '';
      widgetsRef.on('value', function (snapshot) {
        snapshot.forEach(function(w) {
          if (w.val().id == widget.id) {
            if (content.length == 0) {
              content = w.child('contentHTML').val();
              retrieved = true;
              return;
            }
          }
        });
      });
      return content;
    }
  }]);
