(function() {
	'use strict';
	var userService = function(restService) {
		this.restService = restService;
		this.user = {};
		this.friends = {};
	};

	userService.prototype.loadUser = function(callback) {
		var self = this;
		self.restService.getUser(function(user) {
			if(user) {
				self.user = user;
				return callback();
			}
		});
	}

	userService.prototype.getUser = function() {
		return this.user;
	}

	userService.prototype.loadFriends = function(callback) {
		var self = this;
		self.restService.getFriends(function(friends) {
			if(friends) {
				self.friends = friends;
				return callback();
			}
		});
	}

	userService.prototype.getFriends = function() {
		return this.friends;
	}

	theBox.service('userService', userService);
}());
