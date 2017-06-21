angular.module('myApp.services', [])


.factory('stockDataService', function($q, $http)  {

  var getDetailsData = function(ticker) {

    var deferred = $q.defer(),
    url = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22' + ticker +'%22)&format=json&env=store://datatables.org/alltableswithkeys';

    $http.get(url)
    .success(function(json) {
      var jsonData = json.query.results.quote;
      deferred.resolve(jsonData);
    })
    .error(function(error) {
      console.log("Details data error: " + error);
      deferred.reject();
    });

    return deferred.promise;

  };

  var getPriceData = function(ticker) {

    //https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22GE%22,%20%22AAPL%22)&format=json&env=store://datatables.org/alltableswithkeys

    var deferred = $q.defer(),
    url = 'http://finance.google.com/finance/info?client=ig&q=' + ticker;
    //url = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&apikey=demo&symbol=' + ticker;

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
;
