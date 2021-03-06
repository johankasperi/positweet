# Positweet
Repo for project 1 in INFO490 at UIUC. This project makes it possible to easily spread some positive tweets to your friends. It uses the Intel Galileo Gen 2 together with a color sensor. The color sensor detects a color of an object, the server then generates a random tweet within the associated feeling for that color, and after pressing the connected button the tweet is sent.

## Create Twitter app

First you have to create a Twitter app that allows the app to post tweets and read the authenticated users friends list. Go to [apps.twitter.com](http://apps.twitter.com) and follow the instructions.

When you have an Twitter app, create the json-file /secret/twitterkeys.json with the following structure:
```json
{
  "consumerKey": "Your consumerkey from Twitter",
  "consumerSecret": "Your consumersecret from Twitter",
  "accessToken": "",
  "accessTokenSecret": ""
}
```

## Run instructions

### If you have an Intel Galileo board
First make all the wiring needed, see [positweet.kspri.se](http://positweet.kspri.se)

When the wiring is done, run /arduino/theBoxColorSensor.ino from the Arduino IDE.

Edit line 40 to the IP of your board:
```javascript
var callbackUrl = "http://YOUR.IP"
```
SSH to your Galileo and run with:
```bash
node app.js
```
Go to http://THE.BOARD.IP:2222

### If you don't have an Intel Galileo board
The repo comes with a version that don't require a Intel Galileo. You can run this app on your computer. Instead of generating tweets from objects infront of a color sensor, a color picker is shown in the web interface for manual interaction.

Go to /web/js/controllers/StartCtrl.js and make this edit:
```javascript
this.colorPicker = true;
```
Run app with:
```bash
node app_withoutboard.js
```

## Dependencies
A lot of dependencies, checkout package.json and bower.json

## More information
For more information about the project and more detailed information about wiring and stuff, checkout [positweet.kspri.se](http://positweet.kspri.se)

## Credits
Created by Johan Kasperi, Holly Brown and Aileen Bai.