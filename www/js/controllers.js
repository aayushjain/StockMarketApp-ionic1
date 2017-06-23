angular.module('myApp.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('MyStocksCtrl', ['$scope',
  function($scope) {

    $scope.myStocksArray = [
        {ticker: "AAPL"},
        {ticker: "AMZN"},
        {ticker: "FB"},
        {ticker: "GOOGL"},
        {ticker: "NFLX"},
        {ticker: "MSFT"},
        {ticker: "HPQ"},
        {ticker: "TSLA"},
        {ticker: "ORCL"},
        {ticker: "T"},
        {ticker: "YHOO"},
        {ticker: "ADBE"}
    ];
}])
.controller('StockCtrl', ['$scope', '$stateParams', '$window', 'stockDataService', 'dateService', 'chartDataService',
function($scope, $stateParams, $window, stockDataService, dateService, chartDataService) {

  $scope.ticker = $stateParams.StockTicker;
  $scope.chartView = 4;
  $scope.oneYearAgoDate = dateService.oneYearAgoDate();
  $scope.todayDate = dateService.currentDate();

  //console.log(dateService.currentDate());
  //console.log(dateService.oneYearAgoDate());

  $scope.$on("$ionicView.afterEnter", function() {
    getPriceData();
    getDetailsData();
    getChartData();
  });

  $scope.chartViewFunc = function(n) {
      $scope.chartView = n;
  };

  function getPriceData() {
    var promise = stockDataService.getPriceData($scope.ticker);

    promise.then(function(data) {
      //console.log(data);
      $scope.stockPriceData = data;
    });
  }

  function getDetailsData() {
    var promise = stockDataService.getDetailsData($scope.ticker);

    promise.then(function(data) {
      //console.log(data);
      $scope.stockDetailsData = data;

    });
  }

function getChartData() {

  var promise = chartDataService.getHistoricalData($scope.ticker, $scope.oneYearAgoDate, $scope.todayDate);

  promise.then(function(data) {
    $scope.myData = JSON.parse(data)
      .map(function(series) {
        series.values = series.values.map(function(d) { return {x: d[0], y: d[1] }; });
        return series;
      });
  });
}

  	var xTickFormat = function(d) {
  		var dx = $scope.myData[0].values[d] && $scope.myData[0].values[d].x || 0;
  		if (dx > 0) {
        return d3.time.format("%b %d")(new Date(dx));
  		}
  		return null;
  	};

    var x2TickFormat = function(d) {
      var dx = $scope.myData[0].values[d] && $scope.myData[0].values[d].x || 0;
      return d3.time.format('%b %Y')(new Date(dx));
    };

    var y1TickFormat = function(d) {
      return d3.format(',f')(d);
    };

    var y2TickFormat = function(d) {
      return d3.format('s')(d);
    };

    var y3TickFormat = function(d) {
      return d3.format(',.2s')(d);
    };

    var y4TickFormat = function(d) {
      return d3.format(',.2s')(d);
    };

    var xValueFunction = function(d, i) {
      return i;
    };

    var marinBottom = ($window.innerWidth / 100) * 10;

  	$scope.chartOptions = {
      chartType: 'linePlusBarWithFocusChart',
      data: 'myData',
      margin: {top: 15, right: 0, bottom: marinBottom, left: 0},
      interpolate: "cardinal",
      useInteractiveGuideline: false,
      yShowMaxMin: false,
      tooltips: false,
      showLegend: false,
      useVoronoi: false,
      xShowMaxMin: false,
      xValue: xValueFunction,
      xAxisTickFormat: xTickFormat,
      x2AxisTickFormat: x2TickFormat,
      y1AxisTickFormat: y1TickFormat,
      y2AxisTickFormat: y2TickFormat,
      y3AxisTickFormat: y3TickFormat,
      y4AxisTickFormat: y4TickFormat,
      transitionDuration: 500,
      y1AxisLabel: 'Price',
      y3AxisLabel: 'Volume',
      noData: 'Loading data...'
  	};



}]);
