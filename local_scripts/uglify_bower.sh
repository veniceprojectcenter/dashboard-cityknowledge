#!/usr/bin/env bash 

# DEPENDECY:
# npm install uglify-js -g

uglifyjs ../bower_components/jquery/dist/jquery.min.js                                         \
         ../bower_components/jquery-ui/jquery-ui.min.js                                        \
         ../bower_components/firebase/firebase.js                                              \
         ../bower_components/angular/angular.min.js                                            \
         ../bower_components/angular-route/angular-route.min.js                                \
         ../bower_components/angularfire/dist/angularfire.min.js                               \
         ../bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js                        \
         ../bower_components/bootstrap/dist/js/bootstrap.min.js                                \
         ../bower_components/angular-gridster/dist/angular-gridster.min.js                     \
         ../bower_components/moment/min/moment.min.js                                          \
         ../bower_components/moment-timezone/builds/moment-timezone-with-data-2010-2020.min.js \
         ../bower_components/d3/d3.min.js                                                      \
         ../bower_components/d3-cloud/d3.layout.cloud.js                                       \
         ../bower_components/jquery-ui/jquery-ui.min.js                                        \
         ../bower_components/facebox/src/facebox.js                                            \
         ../bower_components/underscore/underscore-min.js                                      \
         ../bower_components/ng-debounce/angular-debounce.js                                   \
         ../bower_components/metrics-graphics/dist/metricsgraphics.min.js                      \
         -o ../js/all.min.js
