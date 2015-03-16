(function() {
  'use strict';
  var socketService = function($rootScope) {
    this.socket = io.connect();
    this.rootScope = $rootScope;
  };

  socketService.prototype.on = function (eventName, callback) {
    var self = this;
    self.socket.on(eventName, function () {
      var args = arguments;
      self.rootScope.$apply(function () {
        callback.apply(self.socket, args);
      });
    });
  };

  socketService.prototype.emit = function (eventName, data, callback) {
    var self = this;
    self.socket.emit(eventName, data, function () {
      var args = arguments;
      self.rootScope.$apply(function () {
        if (callback) {
          callback.apply(self.socket, args);
        }
      });
    })
  }

  theBox.service('socketService', socketService);
}());
