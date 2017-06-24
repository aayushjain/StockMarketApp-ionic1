angular.module('myApp.services', [])

.factory('encodeURIService', function() {
  return {
    encode: function(string){
      //console.log(string);
      return encodeURIComponent(string).replace(/\"/g, "%22").replace(/\ /g, "%20").replace(/[!'()]/g, escape);
    }
  };
})

.factory('dateService', function($filter) {

  var currentDate = function(){
    var d = new Date();
    var date = $filter('date')(d, 'yyyy-MM-dd');
    return date;
  };

  var oneYearAgoDate = function() {
    var d = new Date(new Date().setDate(new Date().getDate() - 365));
    var date = $filter('date')(d, 'yyyy-MM-dd');
    return date;
  };

  return {
    currentDate: currentDate,
    oneYearAgoDate: oneYearAgoDate
  };

})


.factory('chartDataCacheService', function(CacheFactory) {

  var chartDataCache;

  if(!CacheFactory.get('chartDataCache')) {
    chartDataCache = CacheFactory('chartDataCache', {
      maxAge: 60 * 60 * 1000,
      deleteOnExpire: 'aggressive',
      storageMode: 'localStorage'
    });
  }
  else {
    chartDataCache = CacheFactory.get('chartDataCache');
  }

  return chartDataCache;

})


.factory('stockDetailsCacheService', function(CacheFactory) {

  var stockDetailsCache;

  if (!CacheFactory.get('stockDetailsCache')) {
    stockDetailsCache = CacheFactory('stockDetailsCache', {
      maxAge: 60 * 1000,
      deleteOnExpire: 'aggressive',
      storageMode: 'localStorage'
    });
  }
  else {
    stockDetailsCache = CacheFactory.get('stockDetailsCache');
  }

  return stockDetailsCache;

})


.factory('stockDataService', function($q, $http, encodeURIService, stockDetailsCacheService)  {

  var getDetailsData = function(ticker) {

    var deferred = $q.defer(),
    cacheKey = ticker,
    stockDetailsCache = stockDetailsCacheService.get(cacheKey),

    query = 'select * from yahoo.finance.quotes where symbol in ("' + ticker +'")',
    url = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIService.encode(query) +'&format=json&env=store://datatables.org/alltableswithkeys';

    //console.log(url);

    if(stockDetailsCache){
      deferred.resolve(stockDetailsCache);
    }
      else {
        $http.get(url)
      .success(function(json) {
        var jsonData = json.query.results.quote;
        deferred.resolve(jsonData);
        console.log(jsonData);
        stockDetailsCacheService.put(cacheKey, jsonData);
      })
      .error(function(error) {
        console.log("Details data error: " + error);
        deferred.reject();
      });
      }

    return deferred.promise;

  };

  var getPriceData = function(ticker) {

    //https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22GE%22,%20%22AAPL%22)&format=json&env=store://datatables.org/alltableswithkeys
    //https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=MSFT&apikey=
    //https://www.quandl.com/api/v3/datasets/WIKI/FB.json?&start_date=2017-05-11&end_date=2017-06-20&api_key=

    var deferred = $q.defer(),
    //apiKey = keys.alphavantage_api_key,
    url = 'http://finance.google.com/finance/info?client=ig&q=' + ticker;
    //url = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&apikey='+ apiKey + '&symbol=' + ticker;

    $http.get(url)
    .success(function(json) {
      var jsonData = JSON.parse(json.replace(/\//g,''));
      deferred.resolve(jsonData[0]);
    })
    .error(function(error) {
      console.log("Price data error: " + error);
      deferred.reject();
    });

    return deferred.promise;

  };

  return {
    getPriceData: getPriceData,
    getDetailsData: getDetailsData
  };
})


.factory('chartDataService', function($q, $http, encodeURIService, chartDataCacheService) {

  var getHistoricalData = function(ticker, fromDate, todayDate) {

    var deferred = $q.defer(),
    apiKey = keys.quandl_api_key,

    cacheKey = ticker,
    chartDataCache = chartDataCacheService.get(cacheKey),

    //query = 'select * from yahoo.finance.historicaldata where symbol = "' + ticker + '" and startDate = "' + fromDate + '" and endDate = "' + todayDate +'" ';
    //url = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIService.encode(query) +'&format=json&env=store://datatables.org/alltableswithkeys';
    //url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + ticker + '&apikey=' + apiKey + '&start_date=' + fromDate +'&end_date='+ todayDate;
    url = 'https://www.quandl.com/api/v3/datasets/WIKI/' + ticker + '/data.json?start_date=' + fromDate + '&end_date=' + todayDate + '&api_key='+ apiKey;

    if(chartDataCache){
      deferred.resolve(chartDataCache);
    }
    else {
      $http.get(url)
      .success(function(json) {
        var jsonData = json.dataset_data.data;

        var priceData = [],
        volumeData = [];

        jsonData.forEach(function(dayDataObject) {

          var dateToMilis = dayDataObject['0'],
          date = Date.parse(dateToMilis),
          price = parseFloat(Math.round(dayDataObject['4'] * 100) / 100).toFixed(3),
          volume = dayDataObject['5'],

          volumeDatum = '[' + date + ',' + volume + ']',
          priceDatum = '[' + date + ',' + price + ']';

          //console.log(volumeDatum, priceDatum);

          volumeData.unshift(volumeDatum);
          priceData.unshift(priceDatum);

        });

      var formattedChartData =
      '[{' +
        '"key":' + '"volume", ' +
        '"bar":' + 'true,' +
        '"values":' + '[' + volumeData + ']' +
      '},' +
      '{' +
        '"key":' + '"' + ticker + '",' +
        '"values":' + '[' + priceData + ']' +
      '}]';

        deferred.resolve(formattedChartData);
        chartDataCacheService.put(cacheKey, formattedChartData);
      })


      .error(function(error) {
        console.log("Chart data error: " + error);
        deferred.reject();
      });
    }

    return deferred.promise;
  };


  return {
    getHistoricalData: getHistoricalData
  };

})

;
