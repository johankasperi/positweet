var Twit = require('twit'),
passport = require('passport'),
express = require('express'),
session = require('express-session'),
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

// Web client
app.use("/js", express.static(__dirname + "/web/js"));
app.use("/css", express.static(__dirname + "/web/css"));
app.use("/html", express.static(__dirname + "/web/html"));
app.use("/bower_components", express.static(__dirname + "/web/bower_components"));

// Global Twitterkeys, user and twit obj
var T;
var user;

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

// Routes
app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/', failureRedirect: '/login' }));

app.get('/login', function(req, res) {
  // Static file for login
  res.sendfile("login.html", { root: __dirname + "/web" })
})
// Static content
app.all("/", ensureAuthenticated, function(req, res) {
  res.sendfile("index.html", { root: __dirname + "/web" });
});

// Middleware to check if user is loggedin
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}

// Rest api
app.get("/api/user", function(req, res) {
  if(!req.isAuthenticated()) {
    res.status(400);
    return res.send();
  }
  res.status(200),
  res.send(user);
})

// Server
var server = app.listen(process.env.PORT || 2222, function () {
	var host = server.address().address
	var port = server.address().port
	console.log('The box app listening at http://%s:%s', host, port)
})

// Helper functions
function sendTweet(message) {
  T.post('statuses/update', { status: message }, function(err, data, response) {
    console.log(data)
  })
}
