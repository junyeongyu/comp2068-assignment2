"use strict";
let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

// passport dependencies
let passport = require('passport');
let session = require('express-session');
let FacebookStrategy = require('passport-facebook').Strategy;
let TwitterStrategy = require('passport-twitter').Strategy;

let app = express();

//use mongoose to connect to mongodb
let mongoose = require('mongoose');
let conn = mongoose.connection;

//link to config file
let config = require('./config/config');

let moment = require('moment');

// connect db using mongoose connection
conn.open(config.db);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//configure passport and sessions
app.use(session({
  secret: 'some salt value here',
  resave: true,
  saveUninitialized: false
}));

// initialize passport & synchronize express session of passport with express session
app.use(passport.initialize());
app.use(passport.session());

// link to the new User model
let User = require('./models/user');
passport.use(User.createStrategy());

// facebook auth
passport.use(new FacebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook[app.get('env') === 'development' ? 'callbackURLDev' : 'callbackURL'],
    profileFields: ['id', 'displayName', 'email']
  },
  function(accessToken, refreshToken, profile, cb) {
	User.findOrCreate({ username: profile.emails[0].value }, function (err, user) {
	  return cb(err, user);
	});
  }
));

// twitter auth
passport.use(new TwitterStrategy({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callbackURL: config.twitter.callbackURL
  },
  function(token, tokenSecret, profile, cb) {
	User.findOrCreate({ username: profile.username }, function (err, user) {
      return cb(err, user);
    });
  }
));

// manage user login status through the db
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// route url
app.use('/', require('./routes/index'));
app.use('/saleItems', require('./routes/saleItems'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  renderError(req, res, err);
});

app.locals.moment = moment; // this makes moment available as a variable in every EJS page
app.locals.shortDateFormat = 'YYYY-MM-DD';

// Default error rendering
function renderError(req, res, err) {
  console.log(err);
  res.render('error', {
    title: 'Error Page',
    user: req.user,
    message: 'This page has unexpected error.',
    error: err
  });
  return false;
}

module.exports = app;