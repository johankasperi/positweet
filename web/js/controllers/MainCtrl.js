(function() {
	'use strict';
	var MainCtrl = function($location, restService) {
		this.location = $location;
		this.restService = restService;
		this.user = {};
		this.loggedIn = false;
		this.init();
	};

	MainCtrl.prototype.init = function() {
		console.log("main init");
		this.getUser();
	}

	MainCtrl.prototype.getUser = function() {
		this.restService.getUser(function(user) {
			if(user) {
				this.user = user;
				this.loggedIn = true;
			}
		});
	}

	MainCtrl.prototype.getLoggedIn = function() {
		return this.loggedIn;
	}

	theBox.controller('MainCtrl', MainCtrl);
}());
