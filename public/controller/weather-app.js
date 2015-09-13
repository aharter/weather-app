(function () {
	var app = angular.module('weatherApp', []);
	app.controller('WeatherController', function ($scope, $http) {
		var weatherData = this;
		$scope.city = '';
		$scope.validCity = false;

		function queryWeatherForCity(city) {
			$http.get('/weather/' + encodeURIComponent(city)).then(
				function (response) {
					$scope.openWeatherTemp = Number(response.data[0].temperature);
					$scope.yahooWeatherTemp = Number(response.data[1].temperature);
					$scope.avgTemp = (($scope.openWeatherTemp + $scope.yahooWeatherTemp) / 2).toFixed(2);
					$scope.validCity = true;
					$scope.finalCity = response.data[1].name;
				},
				function (response) {
					weatherData.validCity = false;
				});
		}

		$scope.$watch('city', function (newValue, oldValue) {
			if (newValue === '') {
				return;
			}
			queryWeatherForCity(newValue);
		});
	});
})();
