(function() {

$root_scope = angular.element(document.querySelector('[ng-app=placeDash]')).scope();

var TZ = 'cet';
var RESIDENTS = 55750;

var overnighters = [
    10000,
    13000,
    12500,
    18300,
    18650,
    20000,
    22500,
    21750,
    23000,
    19500,
    12500,
    10000
];

var daytrippers = [
    22000,
    33500,
    25000,
    43400,
    45000,
    51000,
    58000,
    62000,
    63500,
    42000,
    23000,
    15500
];

// Gaussian function: https://en.wikipedia.org/wiki/Gaussian_function
function dayDist(t, daytripz) {
    var month = parseInt(moment().tz(TZ).format('MM')) - 1;
    var a = daytripz;
    var b = 13;
    var c = 3.5;
    return a * Math.exp(-Math.pow(t - b, 2) / (2 * c * c));
}

function getData(overnight, daytripz) {
    var month = parseInt(moment().tz(TZ).format('MM')) - 1;
    var time = moment().tz(TZ).format('HH:mm');
    var timeArr = time.split(':').map(Number);
    var timeNum = timeArr[0] + timeArr[1] / 60;
    var data = [];
    var t;
    
    for (t = 0; t <= timeNum; t += 0.5) {
        data.push({
            time: t.toFixed(2).toString().replace('.', ':'),
            residents: RESIDENTS,
            tourists: overnight + dayDist(t,daytripz)
        });
    }
    
    $.each(data, function(i, d) {
        d.time = parseTime(d.time);
        d.residents = parseInt(d.residents);
        d.tourists = parseInt(d.tourists);
    });
            
    return data;
}

var $widget = $('.tourism-presence-widget');

var margin = {
    top: 5,
    right: 5,
    bottom: 25,
    left: 30 
};
var width = $widget.width() - margin.left - margin.right;
var height = width - 60;

var formatTime = d3.time.format('%H:%M');
var parseTime = formatTime.parse;

var x = d3.time.scale().range([0, width]);
var y = d3.scale.linear().range([height, 0]);

var xAxis = d3.svg.axis().scale(x)
    .orient('bottom').ticks(5)
    .tickFormat(formatTime);

var yAxis = d3.svg.axis().scale(y)
    .orient('left').ticks(6)
    .tickFormat(function(v) {
        return Math.round(v / 1000) + 'k';
    });

var residentsLine = d3.svg.line()
    .x(function(d) {
        return x(d.time);
    })
    .y(function(d) {
        return y(d.residents);
    });

var touristArea = d3.svg.area()
    .x(function(d) {
        return x(d.time);
    })
    .y0(height)
    .y1(function(d) {
        return y(d.tourists);
    });

var svg = d3.select($widget.find('.widget-container')[0])
    .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
    .append('g')
        .attr('transform',
            'translate(' + margin.left + ',' + margin.top + ')');

if (!(typeof $root_scope.TouristPresenceController === 'function')) {
    $root_scope.TouristPresenceController = function($scope) {
        $scope.initController = function($widget) {
        console.log('GHE RIVO');
            
        ckconfig.dat_fb.child('tourist_arrivals/data/now').once('value', function(myVal){
            var presence = myVal.val();

          
            
            var overnight = presence.all_day.overnight;
            //overnight = 90000;
            var daytripz = presence.total.day;
            console.log('LOGGING OUT PRESENCE');
            console.log($scope.presence);
 
            var data = getData(overnight, daytripz);
            
            x.domain([parseTime('00:00'), parseTime('23:59')]);
            
            y.domain([0, d3.max(data, function(d) {
                return Math.max(d.residents, d.tourists);
            })]);
            
            svg.append('path')
                .attr('class', 'fill -red')
                .attr('d', touristArea(data));

            svg.append('path')
                .attr('class', 'line -green')
                .attr('d', residentsLine(data));
            
            svg.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(0,' + height + ')')
                .call(xAxis);
            
            svg.append('g')
                .attr('class', 'axis')
                .call(yAxis);
            
            $scope.tourists = data[data.length - 1].tourists;
            
            setInterval(function() {
                data = getData();
                
                y.domain([0, d3.max(data, function(d) {
                    return Math.max(d.residents, d.tourists);
                })]);
                
                svg.select('path.fill')
                    .attr('d', touristArea(data));
                
                svg.select('path.line')
                    .attr('d', residentsLine(data));
                
                $scope.tourists = data[data.length - 1].tourists;
                
 
                
            }, 1000 * 60 * 30);
            
        });               
        };
    };
}

})();