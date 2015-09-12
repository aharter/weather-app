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

function queryYahooWeather(response) {
  var query = 'select * from weather.forecast where u="c" and woeid in (select woeid from geo.places(1) where text="Stockholm")';

  var yahooWeatherOptions = {
    host: 'query.yahooapis.com',
    port: 80,
    path: '/v1/public/yql?format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&q=' + encodeURIComponent(query),
    method: 'GET'
  }

  callWeatherApi(yahooWeatherOptions, function (buffer) {
    var json = JSON.parse(buffer);
    var result = {};
    result.name = json.query.results.channel.location.city;
    result.temperature = json.query.results.channel.item.condition.temp;
    response(result);
  });
}

/* GET weather for Stockholm */
router.get('/', function (req, res, next) {
  queryOpenWeatherApi(function (openWeatherBuffer) {
    queryYahooWeather(function (yahooWeatherBuffer) {
      var finalBuffer = [];
      finalBuffer.push(openWeatherBuffer, yahooWeatherBuffer)
      res.send(finalBuffer);
    });
  });
});

module.exports = router;
