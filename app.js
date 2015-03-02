var Twit = require('twit'),
passport = require('passport'),
express = require('express'),
TwitterStrategy = require('passport-twitter').Strategy;

var app = express();
app.use(express.session({ secret: 'SECRET' }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new TwitterStrategy({
    consumerKey: "zQl5puCnLLXb6FQPYhcs6FT4a",
    consumerSecret: "hpe2walWETNW2aQrQ8VWskGEOUyIdmEGEzzi4OBVcLUEg2yrTw",
    callbackURL: "http://www.example.com/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    User.findOrCreate({}, function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/login' }));

var server = app.listen(process.env.PORT || 2222, function () {
	var host = server.address().address
	var port = server.address().port
	console.log('The box app listening at http://%s:%s', host, port)
})



var T = new Twit({
    consumer_key:         '...'
  , consumer_secret:      '...'
  , access_token:         '...'
  , access_token_secret:  '...'
})

//
//  tweet 'hello world!'
//
/*T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
  console.log(data)
})*/
