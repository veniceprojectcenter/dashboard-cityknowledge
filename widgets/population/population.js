// var populationsRef = new Firebase('https://vpc.firebaseio.com').child('dashboard/venicePopulation');
var populationsRef = ckconfig.dat_fb.child('venicePopulation');
populationsRef.on('value', function(dataSnap) {
  function drawSmallChart() {
    var populations = [];
    dataSnap.forEach(function(p) {
      populations.push(p.val());
    });

    var margin = {top: 10, right: 10, bottom: 10, left: 10},
      width = 180 - margin.left - margin.right,
      height = 100 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;

    var x = d3.time.scale().range([0, width]);

    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom").tickFormat('');

    var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat('');

    var area = d3.svg.area()
        .x(function(p) { return x(p.timestamp); })
        .y0(height)
        .y1(function(p) { return y(p.population); });

    var svg = d3.select(".population-chart-small").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var index = 0;
    populations.forEach(function(p) {
      p.timestamp = parseDate(p.timestamp);
      if (p.population == 0 && index > 0) {
        p.population = populations[index - 1].population;
      } else {
        p.population = + p.population;
      }
      index++;
    });

    x.domain(d3.extent(populations, function(p) { return p.timestamp; }));
    y.domain([54000, d3.max(populations, function(p) { return p.population; })]);

    svg.append("path")
        .datum(populations)
        .attr("class", "area")
        .attr("style", "fill: #6cbe5f;")
        .attr("d", area);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
  }

  function drawLargeChart() {
    var populations = [];
    dataSnap.forEach(function(p) {
      populations.push(p.val());
    });

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;

    var x = d3.time.scale().range([0, width]);

    var y = d3.scale.linear().range([height, 0]);

    var xAxis = d3.svg.axis().scale(x).orient("bottom");

    var yAxis = d3.svg.axis().scale(y).orient("left");

    var area = d3.svg.area()
        .x(function(p) { return x(p.timestamp); })
        .y0(height)
        .y1(function(p) { return y(p.population); });

    var svg = d3.select(".population-chart-large").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var index = 0;
    populations.forEach(function(p) {
      p.timestamp = parseDate(p.timestamp);
      if (p.population == 0 && index > 0) {
        p.population = populations[index - 1].population;
      } else {
        p.population = + p.population;
      }
      index++;
    });

    x.domain(d3.extent(populations, function(p) { return p.timestamp; }));
    y.domain([54000, d3.max(populations, function(p) { return p.population; })]);

    svg.append("path")
        .datum(populations)
        .attr("class", "area")
        .attr("d", area);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Venetians");
  }

  drawLargeChart();
  drawSmallChart();


  $('a[rel*=facebox]').facebox({
    loadingImage: 'bower_components/facebox/src/loading.gif',
    closeImage: 'bower_components/facebox/src/closelabel.png'
  });

  // var dataRef = new Firebase('https://vpc.firebaseio.com').child('dashboard/currentPopulation');
  var dataRef = ckconfig.dat_fb.child('currentPopulation');
  dataRef.on('value', function(dataSnap) {
    var population = replaceNumberWithCommas(dataSnap.val());
    $('#population_num').text(population);
  });

  function replaceNumberWithCommas(yourNumber) {
    //Seperates the components of the number
    var n= yourNumber.toString().split(".");
    //Comma-fies the first part
    n[0] = n[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //Combines the two sections
    return n.join(".");
  }
});
