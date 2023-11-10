'use strict';

placeDash.controller('DashboardShowController', [
           '$scope', '$firebase', '$firebaseAuth', '$sce', '$routeParams', '$location', '$interval', '$timeout', 'placeService',
  function ($scope ,  $firebase ,  $firebaseAuth ,  $sce ,  $routeParams ,  $location ,  $interval ,  $timeout ,  placeService) {
  
  // LOADING STATUS
  document.title = 'Loading Dashboard';
  $timeout(function(){ $('div.modal.loading').modal('show'); }, 250);
  
  // https://github.com/ManifestWebDesign/angular-gridster
  // http://stackoverflow.com/questions/27429388/move-gridster-widgets-programmatically
  $scope.grid_size = 195;
  $scope.gridsterOpts = {
    columns: 6,
    colWidth: $scope.grid_size,
    rowHeight: 'match',
    minColumns: 1, // the minimum columns the grid must have
    minRows: 1, // the minimum height of the grid, in rows
    maxRows: 10,
    margins: [5, 5],
    pushing: false,
    swapping: true,
    floating: false,
    resizable: {
      enabled: false,
    },
    draggable: {
      enabled: true,
      stop: function(event, $element, widget) {
        // Metto il timeout così si poasiziona DOPO il posizionamento automativo
        $timeout(function(){
          $scope.save_gridster_positions();
        }, 250);
        
      }
    }
  };
  $scope.save_gridster_positions = function(){
    if (!$scope.isOwner) return true;
    // console.log("vediamo...");
    $(".gridster ul li").each(function(i, item){
      // console.log("test su ", e);
      var e = $(item), pos = e.position();      
      pos.row = parseInt(pos.top  / $scope.grid_size);
      pos.col = parseInt(pos.left / $scope.grid_size);
      // console.log("posizione ", pos);
      if (e.data('fb_id') && (e.data('row') != pos.row || e.data('col') != pos.row)) {
        e.data('row', pos.row);
        e.data('col', pos.row);
        // console.log("spostato", e.data('fb_id'), " in ", pos);
        settingsRef.child('widgetsInUse/'+e.data('fb_id')).update({
          dashboardRow:    pos.row,
          dashboardColumn: pos.col,
        }, function(){
          e.data('row', pos.row);
          e.data('col', pos.row);
        });
      }
    });
  }
  
  // DEFAULT SETTINGS
  $scope.dashboardUrl = $routeParams.dashboard;
  var settingsRef = ckconfig.dbs_fb.child($scope.dashboardUrl);
  $scope.dashboardSettings = {timeZone: 0}
  
  // USER STATUS
  $scope.isOwner  = false;
  placeService.checkUser($scope);
  
  // CLOCK
  $interval(function() {
    $scope.clock = moment().utc().
      add($scope.dashboardSettings.timeZone, 'hours').
      format('ddd D MMM @ HH:mm:ss');
      
     $scope.clockHourMinute = moment().utc().
      add($scope.dashboardSettings.timeZone, 'hours').
      format('HHmm');    
      
      
  }, 1000);


  //GLOBAL LOG
  $scope.commonLog = function(log_string){
     console.log(log_string);
  };
  
  // VENICE TIDE ANNOUCE
  ckconfig.dat_fb.child('current_tide_level/tide_level').on('value', function(myVal){
    if (myVal) {
      $scope.highTide = myVal.val() >= 0.90;
      $scope.$apply();
    }
  });
  
  // LOADING SETTINGS
  $scope.load_data_key = function(data_key, node_name){
    $scope["data_"+data_key] = $firebase(
      ckconfig.dat_fb.child(node_name)
    ).$asObject();
  };
  $scope.reloadwidgets = function(){
    // USE ONCE INSTEAD ON TO SIMPLIFY SAVING BY REQUEST
    settingsRef.once('value', function(mySettings){
      $scope.dashboardSettings = mySettings.val();
      $scope.widgetsInUse = [];
      for (var k in $scope.dashboardSettings.widgetsInUse) {
        
         var w      = $scope.dashboardSettings.widgetsInUse[k];
         var w_cfg  = $scope.widgets_obj[$scope.dashboardSettings.widgetsInUse[k].id];
        
        /*
        Questa funzione genera un errore di id duplicato
        var w = jQuery.extend(
          $scope.widgets_obj[$scope.dashboardSettings.widgetsInUse[k].id], 
          $scope.dashboardSettings.widgetsInUse[k]
        );
        */
   
        for(var i in w_cfg) {
            if (!w.hasOwnProperty(i))
                w[i] = w_cfg[i];
        }
         
        
        if ($scope.dashboardSettings.widgetsInUse[k].data_bindings && !w.data_bindings) {
          w.data_bindings = $scope.dashboardSettings.widgetsInUse[k].data_bindings;
          for (var data_key in $scope.dashboardSettings.widgetsInUse[k].data_bindings) {
            if (!w.data_bindings[data_key]) {
              w.data_bindings[data_key] = $scope.dashboardSettings.widgetsInUse[k].data_bindings[data_key];
            }
          }
        }
        // w.row    = w.dashboardRow;
        // w.column = w.dashboardColumn;
        w['fb_id'] = k;
        w['widget_name'] = $scope.dashboardSettings.widgetsInUse[k].id;
        if (w.data_bindings) {
          for (var data_key in w.data_bindings) {
            $scope["data_"+data_key] = $firebase(
              ckconfig.dat_fb.child(w.data_bindings[data_key].node_name)
            ).$asObject();
            // console.log("Caricato data_"+data_key, $scope);
          }
        }
        //console.log(".reloadwidgets( w.fb_id"+w.fb_id);
        $scope.widgetsInUse.push(w);
      }
      placeDash.pp = $scope.widgetsInUse;
      $scope.$apply();
    });
  };
  $scope.widgets = $firebase(ckconfig.wdg_fb.orderByKey()).$asArray();
  $scope.widgets_obj = $firebase(ckconfig.wdg_fb.orderByKey()).$asObject();
  settingsRef.once('value', function(mySettings){
    if (!mySettings) {
      alert('Error loading dashboard');
      return $location.path('/');
    }
    $scope.dashboardSettings = mySettings.val();
    if (!$scope.dashboardSettings.name) {
      alert('Error loading dashboard');
      return $location.path('/');
    }
    document.title = $scope.dashboardSettings.pageTitle;
    
    $scope.checkOwner();
    
    $('div.modal.loading').modal('hide');
    // ckconfig.wdg_fb.orderByChild('has_directive').equalTo(true).once('value', function(snap){
    //   var v = snap.val();
    //   var loaded_scripts = 0;
    //   if (Object.keys(v).length == 0) {
    //     return $scope.reloadwidgets();
    //   }
    //   Object.keys(v).forEach(function(i){
    //     // $.getScript('widgets/'+i+'/'+i+'.js', function(){
    //     //   loaded_scripts += 1;
    //     //   console.log("Loaded Directive", i);
    //     //   if (loaded_scripts == Object.keys(v).length) {
    //     //     console.log("Loading Widgets");
    //     //     $scope.reloadwidgets();
    //     //   }
    //     // });
    //     $('<script>')
    //       .attr('type', 'text/javascript')
    //       .attr('src', '/widgets/'+i+'/'+i+'.js')
    //       .appendTo('body');
    //     console.log("Appended Directive", '/widgets/'+i+'/'+i+'.js');
    //   });
    //   setTimeout(function(){ $scope.reloadwidgets(); }, 750);
    // });
    $scope.reloadwidgets();
  });
  
  // BIND FUNCTIONS
  $scope.htmlSafe = $sce.trustAsHtml;
  $scope.trustSrc = $sce.trustAsResourceUrl;
  
  // GESTIONE LOGIN
  $scope.loginUser = function() {
    return placeService.loginUser($scope);
  };
  $scope.logoutUser = function() {
    return placeService.logoutUser($scope);
  };
  $scope.registerUser = function() {
    return placeService.registerUser($scope);
  };
  $scope.checkOwner = function() {
    $scope.isOwner = false;
    if ($scope.loggedIn) {
      if ($scope.user.uid == 1) $scope.isOwner = true;
      if ($scope.user.email == ('' + $scope.dashboardSettings.owner)) $scope.isOwner = true;
    }
  };
  $scope.$watch('loggedIn', function() {
    $scope.checkOwner();
  });
  
  // FUNZIONI VARIE
  $scope.widgetContent = function(widget) {
    alert("unused?");
    // return widget.contentHTML;
  };
  $scope.widgetPartial = function(widget) { 
    return ('widgets/'+widget.id+'/widget.html');
  };
  $scope.widgetSettingPartial = function(widget) {
    if (widget && widget.specific_settings)
      return ('widgets/'+widget.id+'/settings.html');
    else
      return '';
  };
  $scope.widgetSetting = function(widget, label) {
    return _.find(widget.settings, function(setting) { return (setting.label == label) });
  };
  $scope.saveDasboardSettings = function(widget) {
    if (!$scope.isOwner) return true;
    $('div.modal.dashboard-settings button.save-btn').attr("disabled", "disabled");
    // console.log($scope.dashboardSettings);
    var allowedSettings = {};
    // placeDash.zz = $scope.dashboardSettings;
    Object.keys($scope.dashboardSettings).forEach(function(key) {
      // console.log("match? ", key);
      if (key.match(/(pageTitle|helpDocUrl|helpDocWidth|helpDocHeight)/g) ||
          key.match(/(name|subtitle|timeZone)/g) ||
          key.match(/(footerMessage)/g)
      ) {
        // console.log("MATCH!");
        // ELIMINO UNDEFINED
        if ($scope.dashboardSettings[key])
          allowedSettings[key] = $scope.dashboardSettings[key];
      }
    });
    // TODO (LOGOS)
    // console.log(allowedSettings);
    settingsRef.update(
      allowedSettings
    , function(err){
      $('div.modal.dashboard-settings button.save-btn').removeAttr("disabled");
      if (err) {
        alert('Error Saving Settings');
        // console.log("Error Saving Settings:", err);
      } else {
        $('div.modal.dashboard-settings').modal('hide');
      }
    });
  };
  $scope.addSelectedWidget = function() {
    var widget_id = $('div.modal.add-widget form select').val();
    var widget = jQuery.extend({}, 
      $.grep($scope.widgets, function(e){ return e.id == widget_id; })[0]
    );
    delete widget['$id'];
    delete widget['$priority'];
    if (!widget.settings) widget.settings = {};
    var max_row = 1;
    for (var k in $scope.dashboardSettings.widgetsInUse) {
      var w = $scope.dashboardSettings.widgetsInUse[k];
      if (w.dashboardRow > max_row) max_row = (w.dashboardRow + 1);
    }
    if ($scope.widgetsInUse.length == 0) max_row = 0;
    widget.dashboardRow    = max_row;
    widget.dashboardColumn = 0;
    settingsRef.child('widgetsInUse').push(widget, function(err){
      $('div.modal.add-widget button').removeAttr("disabled");
      if (err) {
        alert('Error Adding Widget');
        // console.log("Error Adding Widget User:", $scope.user);
        // console.log("Error Adding Widget dashboard:", $scope.dashboardSettings);
        // console.log("Error Adding Widget:", err);
      } else {
        // alert('Widget Succesfully Added!');
        $scope.reloadwidgets();
        $scope.$apply();
        $('div.modal.add-widget').modal('hide');
      }
    });
  };
  $scope.showSettings = function(widget) {
    $scope.settingsWidget = widget;
    // $scope.settingsWidget.contentHTML = $scope.widgetContent(widget);
    $('.widget-config').modal('show');
  };
  $scope.saveSettings = function(widget) {
    if (!$scope.isOwner) return true;
    $('div.modal.widget-config button.save-btn').attr("disabled", "disabled");
    var my_settings = {
      title:      $('input[ng-model="settingsWidget.title"]'     ).val(),
      urlTitle:   $('input[ng-model="settingsWidget.urlTitle"]'  ).val(),
      url:        $('input[ng-model="settingsWidget.url"]'       ).val(),
      helpDocUrl: $('input[ng-model="settingsWidget.helpDocUrl"]').val(),
      width:      $('input[ng-model="settingsWidget.width"]'     ).val(),
      height:     $('input[ng-model="settingsWidget.height"]'    ).val(),
    };
    if ($scope.settingsWidget.settings) {
      my_settings.settings = {};
      // console.log("settings", $scope.settingsWidget.settings);
      for (var k in $scope.settingsWidget.settings) {
        var my_selector = 'input[ng-model="setting.value"][data-setting_label="' +
                          $scope.settingsWidget.settings[k].label + '"]';
        // console.log("Search for", my_selector);
        if ($(my_selector).length > 0) {
          my_settings.settings[k] = {
            label: $scope.settingsWidget.settings[k].label,
            value: $(my_selector).val()
          };
        }
      }
    }
    $(".gridster ul li[data-fb_id='"+$scope.settingsWidget.fb_id+"']").width(
      ($scope.grid_size * my_settings.width) - 20
    );
    $(".gridster ul li[data-fb_id='"+$scope.settingsWidget.fb_id+"']").height(
      ($scope.grid_size * my_settings.height) - 20
    );
    // console.log("my_settings", my_settings);
    settingsRef.child('widgetsInUse/'+$scope.settingsWidget.fb_id).update(
      my_settings
    , function(err){
      $('div.modal.widget-config button.save-btn').removeAttr("disabled");
      if (err) {
        alert('Error Saving Widget Settings');
        // console.log("Error Saving Widget Settings:", err);
      } else {
        $scope.reloadwidgets();
        $('div.modal.widget-config').modal('hide');
      }
    });
  };
  $scope.deleteWidget = function(widget) {
    settingsRef.child('widgetsInUse/'+widget.fb_id).remove(function(){ $scope.reloadwidgets(); });
  };
  $scope.showWidgetAbout = function(widget) {
    $('.widget-help-' + widget.id).modal('show');
  };
  $scope.showWidgetLogs = function(widget) {
    $('.widget-logs-' + widget.id).modal('show');
    
    // alert('CARICO '+ ckconfig.log_url + '---' + widget.log_key);
    ckconfig.log_fb.child(widget.log_key).once('value', function(myData){
      // alert('CARICATI '+widget.log_key);
      // $.oo = myData.val();
      var data = $.map(myData.val(), function(value, index) {
        return {
          date: new Date(
            index.substring(0,4),
            index.substring(4,6),
            index.substring(6,8),
            index.substring(8,10),
            index.substring(10,12),
            index.substring(12,14)
          ),
          value: value
        };
        value.timestamp = new Date(value.timestamp);
        return [value];
      });
      // $.pp = data;
      $('.widget-log-chart-' + widget.id).html('');
      MG.data_graphic({
          title: "Venice Tides",
          description: "This chart displays the Punta Salute tide heights recorded in Venice every hour.",
          data: data,
          width: 850,
          height: 300,
          target: '.widget-log-chart-' + widget.id,
          x_accessor: 'date',
          y_accessor: 'value',
          area: false,
          baselines: [{'value': 1.1, 'label': 'Very high tide'},
                      {'value': 0.8, 'label': 'High tide'},
                      {'value': -0.5, 'label': 'Normal tide'},
                      {'value': -0.9, 'label': 'Tide under normal level'}]
      });
    });
  };
}]);