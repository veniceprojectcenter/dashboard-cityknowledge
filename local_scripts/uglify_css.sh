#!/usr/bin/env bash 

# DEPENDECY:
# npm install uglifycss -g

uglifycss ../bower_components/metrics-graphics/dist/metricsgraphics.css      \
          ../bower_components/bootstrap/dist/css/bootstrap.min.css           \
          ../bower_components/angular-gridster/dist/angular-gridster.min.css \
          ../bower_components/facebox/src/facebox.css                        \
          > ../all.min.css

