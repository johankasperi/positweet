(function() {
	'use strict';
	var MainCtrl = function(userService) {
		this.userService = userService;
		this.init();
		this.user = {};
	};

	MainCtrl.prototype.init = function() {
		console.log("main init");
		var self = this;
		self.userService.loadUser(function() {
			self.user = self.userService.getUser();
		});
		self.userService.loadFriends(function() {});
	}

	theBox.controller('MainCtrl', MainCtrl);
}());
