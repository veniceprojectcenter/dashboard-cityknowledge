City Knowledge Dashboards
=========
To setup:

1) `python -m SimpleHTTPServer`
2) open `localhost:8000`

####Framework
This project is written using AngularJS.

####Dependencies
Most third party libraries are maintained using bower. To install a new dependency use `bower install --save [package]` if the package is available on bower, and then include the necessary files from `/bower_components` in `index.html`. The file `bower.json` maintains the current set of dependencies. Update the dependencies using `bower update`.

####Database
The dashboards' data are stored in the CityKnowledge Firebase, and the data collected from scripts are currently in the VPC Firebase. The scripts to scrape Venice data are also still hosted on the Venice2Point0 server.

####Dashboard Code
The majority of the dashboard logic is in `js/controllers/dashboard.js`, and the logic for creating new dashboards is in `js/controllers/dashboard.js`. Logic for new widgets is in `js/controllers/newWidget.js`.

####Layout
Respective layout files can be found in the `/partials` directory.

####Routes
Routes are maintained in `js/router.js`.

npm install

