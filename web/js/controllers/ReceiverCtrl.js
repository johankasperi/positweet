(function() {
	'use strict';
	var ReceiverCtrl = function(userService, restService) {
		this.userService = userService;
		this.restService = restService;
		this.friends = null;
		this.receiver = "";
		this.init();
	};

	ReceiverCtrl.prototype.init = function() {
		var self = this;
		this.userService.getFriends(function(friends) {
			self.friends = friends;
		});
		this.getReceiver();
	}

	ReceiverCtrl.prototype.getReceiver = function() {
		var self = this;
		self.restService.getReceiver(function(data) {
			self.receiver = data.receiver;
		});
	}

	ReceiverCtrl.prototype.setReceiver = function(screenName) {
		this.restService.setReceiver(screenName);
		this.receiver = screenName;
	}

	theBox.controller('ReceiverCtrl', ReceiverCtrl);
}());
