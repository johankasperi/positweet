(function() {
	'use strict';
	var StartCtrl = function(socketService, restService) {
		this.socketService = socketService;
		this.restService = restService;
		this.lastTweet = ""
		var self = this;
		self.socketService.on('send:tweet', function (message) {
		   self.lastTweet = message.tweet;
		});
	};

	StartCtrl.prototype.findTweet = function(rgb) {
		rgb = rgb.replace("rgb(", "");
		rgb = rgb.replace(")", "");
		rgb = rgb.split(",")
		this.restService.findTweet(rgb[0], rgb[1], rgb[2]);
	}

	StartCtrl.prototype.sendTweet = function() {
		console.log("hej")
		this.restService.sendTweet()
	}

	theBox.controller('StartCtrl', StartCtrl);
}());
