/*global angular */
var theBox = angular.module('theBox', ['ngRoute']);

theBox.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: 'html/login.html',
        controller: 'LoginCtrl as loginCtrl'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);