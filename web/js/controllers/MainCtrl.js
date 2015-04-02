(function() {
	'use strict';
	var MainCtrl = function(userService, socketService, $location) {
		this.userService = userService;
		this.socketService = socketService;
		this.location = $location;
		this.init();
		this.user = {};
		this.bgClass = ""

		var self = this;
		self.socketService.on('send:color', function(message) {
			self.bgClass = message.color;
		})
	};

	MainCtrl.prototype.init = function() {
		var self = this;
		self.userService.loadUser(function() {
			self.user = self.userService.getUser();
		});
	}

	MainCtrl.prototype.activeRoute = function(route) {
        return route === this.location.path();
	}

	theBox.controller('MainCtrl', MainCtrl);
}());
