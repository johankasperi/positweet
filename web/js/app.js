/*global angular */
var theBox = angular.module('theBox', ['ngRoute', 'colorpicker.module']);

theBox.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'html/start.html',
        controller: 'StartCtrl as startCtrl'
      }).
      when('/set-receiver', {
        templateUrl: 'html/receiver.html',
        controller: 'ReceiverCtrl as receiverCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);

theBox.directive('resize', function ($window) {
    return function (scope, element) {
        var w = angular.element($window);
        var changeHeight = function() {element.css('height', (w.height() -20) + 'px' );};
        w.bind('resize', function () {
          changeHeight();   // when window size gets changed
        });
        changeHeight(); // when page loads
    }
})