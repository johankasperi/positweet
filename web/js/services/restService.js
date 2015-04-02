(function() {
  'use strict';
  var restService = function($http) {
    this.http = $http;
  };

  restService.prototype.getUser = function(callback) {
    this.http.get('/api/user', {})
    .error(function(data, status, headers, config) {
      return callback(null);
    })
    .success(function(data, status, headers, config) {
      return callback(data);
    });
  }

  restService.prototype.getFriends = function(callback) {
    this.http.get('/api/friends', {})
    .error(function(data, status, headers, config) {
      return callback(null);
    })
    .success(function(data, status, headers, config) {
      return callback(data);
    });
  }

  restService.prototype.getReceiver = function(callback) {
    this.http.get('/api/receiver', {})
    .error(function(data, status, headers, config) {
      return callback(null);
    })
    .success(function(data, status, headers, config) {
      return callback(data);
    });
  }

  restService.prototype.setReceiver = function(screenName) {
    this.http.post('/api/receiver', { screen_name: screenName })
    .error(function(data, status, headers, config) {
    })
    .success(function(data, status, headers, config) {
    });
  }

  restService.prototype.findTweet = function(r,g,b) {
    this.http.get('/api/tweet/find?red='+r+'&green='+g+'&blue='+b)
    .error(function(data, status, headers, config) {
    })
    .success(function(data, status, headers, config) {
    });
  }

  restService.prototype.sendTweet = function() {
    this.http.post('/api/tweet/send', {})
    .error(function(data, status, headers, config) {
    })
    .success(function(data, status, headers, config) {
    });
  }

  restService.prototype.getLastTweet = function(callback) {
    this.http.get('/api/tweet/last')
    .error(function(data, status, headers, config) {
      return callback(null);
    })
    .success(function(data, status, headers, config) {
      return callback(data);
    });
  }

  restService.prototype.getCurrentTweet = function(callback) {
    this.http.get('/api/tweet/current')
    .error(function(data, status, headers, config) {
      return callback(null);
    })
    .success(function(data, status, headers, config) {
      return callback(data);
    });
  }


  theBox.service('restService', restService);
}());
