var Twit = require('twit'),
passport = require('passport'),
express = require('express'),
session = require('express-session'),
bodyParser = require('body-parser'),
socketio = require('socket.io'),
_ = require('underscore'),
fs = require('fs'),
TwitterStrategy = require('passport-twitter').Strategy;

// App
var app = express();
app.use(session({
    secret: "the box",
    name: "the box",
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Web client
app.use("/js", express.static(__dirname + "/web/js"));
app.use("/css", express.static(__dirname + "/web/css"));
app.use("/html", express.static(__dirname + "/web/html"));
app.use("/bower_components", express.static(__dirname + "/web/bower_components"));

// Global Twitterkeys, user and twit obj
var T;
var user;
var friends = {};
var receiver = "johannahilding";
var lastTweet = "";
var currentTweet = ""

var twitterKeys = {
  consumerKey: "zQl5puCnLLXb6FQPYhcs6FT4a",
  consumerSecret: "hpe2walWETNW2aQrQ8VWskGEOUyIdmEGEzzi4OBVcLUEg2yrTw",
  accessToken: '',
  accessTokenSecret: ''
}

// Passport.js for login with Twitter
passport.use(new TwitterStrategy({
    consumerKey: twitterKeys.consumerKey,
    consumerSecret: twitterKeys.consumerSecret,
    callbackURL: "http://localhost:2222/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    twitterKeys.accessToken = token;
    twitterKeys.accessTokenSecret = tokenSecret;
    T = new Twit({
      consumer_key: twitterKeys.consumerKey,
      consumer_secret: twitterKeys.consumerSecret,
      access_token: twitterKeys.accessToken,
      access_token_secret: twitterKeys.accessTokenSecret
    });
    user = profile;
    done(null,profile.id);
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// Middleware to check if user is loggedin
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

// Routes
app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }));

app.get('/login', function(req, res) {
  // Static file for login
  res.sendfile("login.html", { root: __dirname + "/web" })
})

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

// Static content
app.all("/", ensureAuthenticated, function(req, res) {
  res.sendfile("index.html", { root: __dirname + "/web" });
});

// Rest api
app.get("/api/user", function(req, res) {
  if(!req.isAuthenticated()) {
    res.status(400);
    return res.send();
  }
  res.status(200),
  res.send(user);
})

app.get("/api/friends", function(req, res) {
  getFriends(function(data) {
    if(!data) {
      res.status(400);
      return res.send();
    }
    friends = data;
    res.status(200);
    res.send(friends);
  })
})

app.post("/api/receiver", function(req, res) {
  receiver = req.body.screen_name;
  console.log(receiver);
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

app.post("/api/tweet/find", function(req, res) {
  var r = parseInt(req.body.red);
  var g = parseInt(req.body.green);
  var b = parseInt(req.body.blue);
  findAndPrepareTweet(r,g,b, function(tweet) {
    currentTweet = tweet;
    res.status(200);
    res.send()
  })
})

app.post("/api/tweet/send", function(req, res) {
  sendTweet(currentTweet, function(resp) {
    console.log(resp)
    res.status(200);
    res.send();
  })
})

// Server
var server = app.listen(process.env.PORT || 2222, function () {
	var host = server.address().address
	var port = server.address().port
	console.log('The box app listening at http://%s:%s', host, port)
})

// Socket.io
var io = socketio.listen(server);
io.on('connection', function(socket){
  socket.emit("send:tweet", {
    tweet: lastTweet
  })
});

// Tweeting from the color sensor
var tweets = {};
fs.readFile('tweets-register/tweets.json', function(err, data) {
  if (err) throw err;
  tweets = JSON.parse(data);
})

function findAndPrepareTweet(r, g, b, callback) {
  var foundColor = {};
  var bestScore = 0;
  var foundColor = _.max(tweets.register, function(item) {
      return item.color.r*r + item.color.g*g + item.color.b*b;
  })
  var tweet = _.sample(foundColor.tweets);
  if(!tweet) {
    return callback(null);
  }
  tweet = tweet.replace("#receiver#", "@"+receiver) + " #INFO490 #UIUC";
  io.emit("send:tweet", {
    tweet: tweet
  })

  return callback(tweet);
}

function sendTweet(message, callback) {
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
