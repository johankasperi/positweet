# Positweet
Repo for project 1 in INFO490 at UIUC. This project makes it possible to easily spread some positive tweets to your friends. It uses the Intel Galileo Gen 2 together with a color sensor. The color sensor detects a color of an object, the server then generates a random tweet within the associated feeling for that color, and after pressing the connected button the tweet is sent.

# Run instructions
### Create Twitter app
Skip this step if your board do not have Internet.

1. First you have to create a Twitter app that allows the app to post tweets and read the authenticated users friends list. Go to [apps.twitter.com](apps.twitter.com) and follow the instructions.
2. When you have an Twitter app, create the json-file /secret/twitterkeys.json with the following structure:
```json
{
  "consumerKey": "Your consumerkey from Twitter",
  "consumerSecret": "Your consumersecret from Twitter",
  "accessToken": "",
  "accessTokenSecret": ""
}
``

### If you have an Intel Galileo board
1. Make all the wiring needed.
2. If your board have Internet connection, edit line 40 to the IP of your board:
```javascript
var callbackUrl = "http://YOUR.IP"
```
3. Run with:
```bash
node app.js
```
3. If your board do not have Internet, run:
```bash
node app_nointernet.js
```
### If you don't have an Intel Galileo board
1. Go to /web/js/controllers/StartCtrl.js and make this edit:
```javascript
this.colorPicker = true;
``
2. Run app with:
```bash
node app_withoutboard.js
``

# Dependencies
A lot of dependencies, checkout package.json and bower.json

# More information
For more information about the project and more detailed information about wiring and stuff, checkout[positweet.kspri.se](positweet.kspri.se)

# Credits
Created by Johan Kasperi, Holly Brown and Aileen Bai.