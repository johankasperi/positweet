(function() {
	'use strict';
	var userService = function(restService) {
		this.restService = restService;
		this.user = {};
		this.friends = null;
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

	userService.prototype.getFriends = function(callback) {
		var self = this;
		if(self.friends) {
			console.log("finns");
			return callback(self.friends);
		}
		self.restService.getFriends(function(friends) {
			if(friends) {
				self.friends = friends;
				return callback(self.friends);
			}
		});
	}

	theBox.service('userService', userService);
}());
