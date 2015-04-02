(function() {
	'use strict';
	var StartCtrl = function(socketService, restService) {
		this.socketService = socketService;
		this.restService = restService;
		this.currentTweet = "";
		this.tweetSent = false;
		this.colorPicker = true; // decides of colorpicker should be shown or not.

		var self = this;
		self.socketService.on('send:tweet', function (message) {
		   self.currentTweet = message.tweet;
		   self.errorMessage = "";
		});

		self.socketService.on('send:tweetSent', function () {
		   self.tweetSent = true;
		});

		self.socketService.on('send:noReceiver', function () {
		   self.errorMessage = "Please set a receiver first.";
		});

		self.init();
	};

	StartCtrl.prototype.init = function() {
		var self = this;
		this.restService.getCurrentTweet(function(tweet) {
			if(!tweet) {
				self.restService.getLastTweet(function(tweet) {
					if(!tweet) {
						self.errorMessage = "Nothing.";
						return null;
					}
					self.currentTweet = tweet.last;
				});
				return null;
			}
			self.currentTweet = tweet.current;
		})
	}

	StartCtrl.prototype.findTweet = function(rgb) {
		this.tweetSent = false;
		rgb = rgb.replace("rgb(", "");
		rgb = rgb.replace(")", "");
		rgb = rgb.split(",")
		this.restService.findTweet(rgb[0], rgb[1], rgb[2]);
	}

	StartCtrl.prototype.sendTweet = function() {
		this.restService.sendTweet()
	}

	StartCtrl.prototype.tweetCheck = function() {
		return this.currentTweet.length > 0;
	}

	theBox.controller('StartCtrl', StartCtrl);
}());
