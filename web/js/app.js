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