(function () {
	var app = angular.module('weatherApp', []);
	app.controller('WeatherController', function() {
		this.openWeatherTemp = 17;
		this.yahooWeatherTemp = 19;
		this.avgTemp = 18;
	});
})();
