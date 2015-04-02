var Twit = require('twit'),
express = require('express'),
session = require('express-session'),
bodyParser = require('body-parser'),
socketio = require('socket.io'),
_ = require('underscore'),
fs = require('fs'),
Galileo = require("galileo-io"),
mraa = require('mraa');

// App
var app = express();
app.use(session({
    secret: "positweet",
    name: "positweet",
    resave: true,
    saveUninitialized: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Web client
app.use("/js", express.static(__dirname + "/web/js"));
app.use("/css", express.static(__dirname + "/web/css"));
app.use("/html", express.static(__dirname + "/web/html"));
app.use("/bower_components", express.static(__dirname + "/web/bower_components"));

// Global Twitterkeys, user, twit obj and sensor params
var T;
var user;
var friends = {};
var receiver = "";
var lastTweet = ""; // last sended tweet
var currentTweet = ""; // current random tweet message
var previousClear = null; // store clear to check if object has been put infront of sensor

// Static content
app.all("/", function(req, res) {
  res.sendFile("index.html", { root: __dirname + "/web" });
});

// Rest api
app.get("/api/user", function(req, res) {
  if(!user) {
    res.status(400);
    res.send();
  }
  res.status(200),
  res.send(user);
})

app.get("/api/friends", function(req, res) {
  res.status(400);
  return res.send();
})

app.post("/api/receiver", function(req, res) {
  receiver = req.body.screen_name;
  res.status(200);
  res.send();
})

app.get("/api/receiver", function(req, res) {
  if(!receiver.length > 0) {
    res.status(400)
    res.send()
    return null
  }
  res.status(200);
  res.send({ receiver: receiver });
})

app.get("/api/tweet/find", function(req, res) {

  if(receiver.length === 0) {
    io.emit("send:noReceiver", {});
    res.status(200);
    res.send();
    return null
  }

  var r = parseInt(req.query.red);
  var g = parseInt(req.query.green);
  var b = parseInt(req.query.blue);
  var clear = parseInt(req.query.clear);

  checkIfObjInfront(r,g,b,clear, function(objInfront) {
    if(!objInfront) {
      res.status(200);
      res.send();
      return null
    }
    findAndPrepareTweet(r,g,b, function() {
      res.status(200);
      res.send()
    })
  })
})

app.post("/api/tweet/send", function(req, res) {
  sendTweet(currentTweet, function(resp) {
    console.log(resp)
    res.status(200);
    res.send();
  })
})

app.get("/api/tweet/current", function(req, res) {
  if(!currentTweet.length > 0) {
    res.status(400)
    res.send()
    return null
  }
  res.status(200);
  res.send({ current: currentTweet });
})

app.get("/api/tweet/last", function(req, res) {
  if(!lastTweet.length > 0) {
    res.status(400)
    res.send()
    return null
  }
  res.status(200);
  res.send({ last: lastTweet });
})

// Server
var server = app.listen(process.env.PORT || 2222, function () {
	var host = server.address().address
	var port = server.address().port
	console.log('The box app listening at http://%s:%s', host, port)
})

// Socket.io
var io = socketio.listen(server);

// Vector functions

function correctColors(r,g,b,clear) {
  total = r+g+b;
  r /= clear;
  g /= clear;
  b /= clear;
  return [r,g,b];
}

function vectorNorm(r,g,b) {
  var vectorLength = Math.sqrt(Math.pow(r, 2)+Math.pow(g, 2)+Math.pow(b, 2));
  r /= vectorLength;
  g /= vectorLength;
  b /= vectorLength;
  return {r: r, g: g, b: b};
}

function vectorLength(r,g,b) {
  return Math.sqrt(Math.pow(r, 2)+Math.pow(g, 2)+Math.pow(b, 2));
}

function dotProduct(r1,g1,b1,r2,g2,b2) {
  return r1*r2+g1*g2+b1*b2;
}

function vectorCompare(r1,g1,b1,r2,g2,b2) {
  var norm1 = vectorNorm(r1,g1,b1);
  var norm2 = vectorNorm(r2,g2,b2);
  return dotProduct(norm1.r,norm1.g,norm1.b,norm2.r,norm2.g,norm2.b)
}

// Tweeting from the color sensor
var tweets = {};
fs.readFile('tweets-register/tweets.json', function(err, data) {
  if (err) throw err;
  tweets = JSON.parse(data);
})

function checkIfObjInfront(r, g, b, clear, callback) {
  if(previousClear === null) {
    previousClear = clear;
    setRgbColor(0,0,0);
    return callback(false);
  }

  var relation = clear/previousClear;
  if(relation < 1.6 && relation > 0.4) {
    previousClear = clear;
    return callback(false);
  }
  else if(relation < 0.4) {
    setRgbColor(0,0,0);
    previousClear = clear;
    return callback(false);
  }
  previousClear = clear;

  callback(true)
}

function findAndPrepareTweet(r, g, b, callback) {
  var foundColor = _.max(tweets.register, function(item) {
    return vectorCompare(r,g,b,item.colorIn.r,item.colorIn.g,item.colorIn.b);
  })

  setRgbColor(foundColor.colorOut.r,foundColor.colorOut.g,foundColor.colorOut.b); // set the color of the led

  var tweet = _.sample(foundColor.tweets);
  tweet = tweet.replace("#receiver#", "@"+receiver) + " #INFO490 #UIUC";

  currentTweet = tweet;
  io.emit("send:tweet", {
    tweet: tweet
  })
  io.emit("send:color", {
    color: foundColor.name
  })
  callback();
}

function sendTweet(message, callback) {
  currentTweet = "";
  lastTweet = message;
  postTweet(message, callback);
}

// Talk to Twitter API
function postTweet(message, callback) {
  /*T.post('statuses/update', { status: message }, function(err, data, response) {
    if(err)
      return callback(err)
    callback(response)
    console.log(data)
  })*/
  io.emit("send:tweetSent", {})
  callback("Sended tweet: "+message)
}

function getFriends(callback) {
  T.get('friends/list', { user_id: user._json.id, count: 200 },  function (err, data, response) {
    if(err) {
      return callback(null);
    }
    callback(data);
  })
}

// Control board pins and stuff
var board = new Galileo();

var rgbPins = {
  red: 3,
  green: 5,
  blue: 6
};
board.on("ready", function() {
  this.pinMode(rgbPins.red, this.MODES.OUTPUT);
  this.pinMode(rgbPins.green, this.MODES.OUTPUT);
  this.pinMode(rgbPins.blue, this.MODES.OUTPUT);
});

function setRgbColor(r,g,b) {
  board.analogWrite(rgbPins.red, 255-r);
  board.analogWrite(rgbPins.green, 255-g);
  board.analogWrite(rgbPins.blue, 255-b);
}

// Read the button on digitalpin 2
var numOnes = 0;
board.digitalRead(2, function(data) { // maybe change this to johnny five.
  if(data === 1 && currentTweet.length > 0 ) {
    numOnes++
    if(numOnes === 100) {
      numOnes = 0;
      sendTweet(currentTweet, function(resp) {
        console.log(resp);
      })
    }
  }
  else {
    numOnes = 0;
  }
});


