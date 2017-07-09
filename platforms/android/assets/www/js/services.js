angular.module('myApp.services', [])

.factory('encodeURIService', function() {
  return {
    encode: function(string){
      //console.log(string);
      return encodeURIComponent(string).replace(/\"/g, "%22").replace(/\ /g, "%20").replace(/[!'()]/g, escape);
    }
  };
})

.service('modalService', function($ionicModal) {

  this.openModal = function(id) {

    var _this = this;

    if(id == 1) {
      $ionicModal.fromTemplateUrl('templates/search.html', {
        scope: null,
        controller: 'SearchCtrl'
      }).then(function(modal) {
        _this.modal = modal;
        _this.modal.show();
      });
    }
    else if(id == 2) {
      $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: null,
        controller: 'LoginSearchCtrl'
      }).then(function(modal) {
        _this.modal = modal;
        _this.modal.show();
      });
    }
    else if(id == 3) {
      $ionicModal.fromTemplateUrl('templates/signup.html', {
        scope: null,
        controller: 'LoginSearchCtrl'
      }).then(function(modal) {
        _this.modal = modal;
        _this.modal.show();
      });
    }
  };

  this.closeModal = function() {

    var _this = this;

    if(!_this.modal) return;
    _this.modal.hide();
    _this.modal.remove();
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


.factory('stockPriceCacheService', function(CacheFactory) {

  var stockPriceCache;

  if (!CacheFactory.get('stockPriceCache')) {
    stockPriceCache = CacheFactory('stockPriceCache', {
      maxAge: 2 * 1000,
      deleteOnExpire: 'aggressive',
      storageMode: 'localStorage'
    });
  }
  else {
    stockPriceCache = CacheFactory.get('stockPriceCache');
  }

  return stockPriceCache;

})


.factory('notesCacheService', function(CacheFactory) {
  var notescache;

  if (!CacheFactory.get('notesCache')) {
    notesCache = CacheFactory('notesCache', {
      storageMode: 'localStorage'
    });
  }
  else {
    notesCache = CacheFactory.get('notesCache');
  }

  return notesCache;
})


.factory('fillMyStocksCacheService', function(CacheFactory) {

  var myStocksCache;


  if(!CacheFactory.get('myStocksCache')) {
    myStocksCache = CacheFactory('myStocksCache', {
      storageMode: 'localStorage'
    });
  }
  else {
    myStocksCache = CacheFactory.get('myStocksCache');
  }

  var fillMyStocksCache = function() {

    var myStocksArray = [
      {ticker: "AAPL"},
      {ticker: "AMZN"},
      {ticker: "FB"},
      {ticker: "GOOGL"},
      {ticker: "NFLX"},
      {ticker: "MSFT"},
      {ticker: "HPQ"},
      {ticker: "TSLA"},
      {ticker: "ORCL"},
      {ticker: "IBM"},
      {ticker: "BAC"},
      {ticker: "C"},
      {ticker: "T"},
      {ticker: "ADBE"}
    ];

    myStocksCache.put('myStocks', myStocksArray);
  };

  return {
    fillMyStocksCache: fillMyStocksCache
  };

})


.factory('myStocksCacheService', function(CacheFactory) {

  var myStocksCache = CacheFactory.get('myStocksCache');

  return myStocksCache;
})


.factory('myStocksArrayService', function(fillMyStocksCacheService, myStocksCacheService) {

  if(!myStocksCacheService.info('myStocks')) {
    fillMyStocksCacheService.fillMyStocksCache();
  }

  var myStocks = myStocksCacheService.get('myStocks');

  return myStocks;

})


.factory('followStockService', function(myStocksArrayService, myStocksCacheService) {

  return {

    follow: function(ticker) {

      var stockToAdd = {"ticker": ticker};

      myStocksArrayService.push(stockToAdd);
      myStocksCacheService.put('myStocks', myStocksArrayService);
    },

    unfollow: function(ticker) {

      for (var i = 0; i < myStocksArrayService.length; i++) {
        if(myStocksArrayService[i].ticker == ticker) {
          myStocksArrayService.splice(i, 1);
          myStocksCacheService.remove('myStocks');
          myStocksCacheService.put('myStocks', myStocksArrayService);

          break;
        }
      }
    },

    checkFollowing: function(ticker) {

      for (var i = 0; i < myStocksArrayService.length; i++) {
        if(myStocksArrayService[i].ticker == ticker) {
          return true;
        }
      }

      return false;
    }
  };
})


.factory('stockDataService', function($q, $http, encodeURIService, stockDetailsCacheService, stockPriceCacheService)  {

  var getDetailsData = function(ticker) {

    var deferred = $q.defer(),
    cacheKey = ticker,
    stockDetailsCache = stockDetailsCacheService.get(cacheKey),

    query = 'select * from yahoo.finance.quotes where symbol in ("' + ticker +'")',
    url = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIService.encode(query) +'&format=json&env=store://datatables.org/alltableswithkeys';


    if(stockDetailsCache){
      deferred.resolve(stockDetailsCache);
    }
      else {
        $http.get(url)
      .success(function(json) {
        var jsonData = json.query.results.quote;
        deferred.resolve(jsonData);
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

    cacheKey = ticker;
    //apiKey = keys.alphavantage_api_key,
    url = 'https://finance.google.com/finance/info?client=ig&q=' + ticker;
    //url = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&apikey='+ apiKey + '&symbol=' + ticker;

    $http.get(url)
    .success(function(json) {
      var jsonData = JSON.parse(json.replace(/\//g,''))[0];
      deferred.resolve(jsonData);
      stockPriceCacheService.put(cacheKey, jsonData);
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

.factory('notesService',function(notesCacheService) {

  return {
    getNotes: function(ticker) {
      return notesCacheService.get(ticker);
    },

    addNote: function(ticker, note) {

      var stockNotes = [];

      if (notesCacheService.get(ticker)) {
        stockNotes = notesCacheService.get(ticker);
        stockNotes.push(note);
      }
      else {
        stockNotes.push(note);
      }

      notesCacheService.put(ticker, stockNotes);
    },

    deleteNote: function(ticker, index) {

      var stockNotes = [];

      stockNotes = notesCacheService.get(ticker);
      stockNotes.splice(index, 1);
      notesCacheService.put(ticker, stockNotes);

    }

  };

})



.factory('newsService', function($q, $http, encodeURIService) {

  return {
    getNews: function(ticker) {

      var deferred = $q.defer(),

      query = 'select * from rss where url="http://feeds.finance.yahoo.com/rss/2.0/headline?s=' + ticker + '"',
      url = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIService.encode(query) +'&format=json&env=store://datatables.org/alltableswithkeys';
      $http.get(url)
      .success (function(json) {

        jsonData = json.query.results.item;
        cleanedData = JSON.parse(JSON.stringify(jsonData).replace(/&apos;/g, "\’").replace(/&#39;/g, "\'").replace(/&quot;/g, "\\\"").replace(/[‘’]/g, "\'"));
        deferred.resolve(cleanedData);
      })
      .error(function() {
        deferred.reject();
        console.log("News error: " + error);
      });

      return deferred.promise;
    }
  };

})


.factory('searchService', function($q, $http, encodeURIService) {

  return {

    search: function(query) {

      var deferred = $q.defer(),

      cleanResults = [],

      string = 'select * from json where url="https://s.yimg.com/aq/autoc?region=CA&lang=en-CA&query=' + query + '"';
      url = 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIService.encode(string) + '&format=json&env=store://datatables.org/alltableswithkeys';

      $http.get(url)
      .success(function(data) {
        var jsonData = data.query.results.ResultSet.Result;

        if(jsonData) {
          for (var i = 0; i < jsonData.length; i++) {
            if((jsonData[i].exch == 'NMS') || (jsonData[i].exch == 'NYQ')) {
              cleanResults.push(jsonData[i]);
            }
          }
        }

        deferred.resolve(cleanResults);
      })
      .error(function(error) {
        console.log("Search error: " + error);
      });

      return deferred.promise;
    }
  };
})


;
