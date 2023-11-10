var express = require('express'),
    router = express.Router();
var request = require('request');

// http://stackoverflow.com/questions/16866015/node-js-wait-for-callback-of-rest-service-that-makes-http-request
router.get('/rand', function(req, res) {
  res.json({
    value:  42
  });
});

module.exports = router;