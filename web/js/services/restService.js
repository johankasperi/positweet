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
  theBox.service('restService', restService);
}());
