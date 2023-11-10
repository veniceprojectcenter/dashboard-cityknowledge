'use strict';

// Declare app level module which depends on views, and components
var placeDash = angular.module('placeDash', [
  'firebase',
  'gridster',
  'ui.bootstrap',
  'debounce',
  'ngRoute',
  // definire i controller
  // 'dash.list',
]);

placeDash.filter('unsafe', function($sce) {
  return $sce.trustAsHtml;
});
