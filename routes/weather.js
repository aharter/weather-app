var express = require('express');
var http = require('http');
var router = express.Router();

function callWeatherApi(requestOptions, callback) {
  var buffer = '';

  http.get(requestOptions, function (result) {
    result.on('data', function (chunk) {
      buffer += chunk;
    });

    result.on('end', function () {
      callback(buffer);
    });

    result.on('error', function (e) {
      throw 'An error occured ' + e;
    });

  });
}

function queryOpenWeatherApi(response) {
  var openWeatherMapOptions = {
    host: 'api.openweathermap.org',
    port: 80,
    path: '/data/2.5/weather?units=metric&q=Stockholm',
    method: 'GET'
  }

  callWeatherApi(openWeatherMapOptions, function (buffer) {
    var json = JSON.parse(buffer);
    var result = {};
    result.name = json.name;
    result.temperature = json.main.temp;
    response(result);
  });
}

/* GET weather for Stockholm */
router.get('/', function (req, res, next) {
  queryOpenWeatherApi(function (buffer) {
    res.send(buffer);
  });
});

module.exports = router;
