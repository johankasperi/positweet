(function() {
	'use strict';
	var ReceiverCtrl = function(userService, restService) {
		this.userService = userService;
		this.restService = restService;
		this.friends = {};
		this.receiver = "";
		this.init();
	};

	ReceiverCtrl.prototype.init = function() {
		this.friends = this.userService.getFriends();
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

	ReceiverCtrl.prototype.friendsRange = function() {
		return Math.ceil(this.friends/3);
	}

	theBox.controller('ReceiverCtrl', ReceiverCtrl);
}());
