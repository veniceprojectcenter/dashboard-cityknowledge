var express = require('express'),
    session  = require('express-session'),
    bodyParser = require('body-parser'),
    albero = require('./middleware/albero'),
    app = express();

// serve static files from public/ directory
app.use(express.static(__dirname + '/'));

// parse incoming application/json
app.use(bodyParser.json());

app.use(session({
  secret: 'My Super Secret KEY',
  saveUninitialized: true, // (default: true)
  resave: true, // (default: true)
  cookie: {
    // httpOnly: true,
    // secure: true
  }
}));

app.use('/albero', albero);

app.get('/', function(req, res) {
  res.sendFile('index.html');
});

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

// var server = app.listen(80, function() {
var server = app.listen(8000, function() {

  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);

});