"use strict";
var express = require('express');
var router = express.Router();

let passport = require('passport');
let User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Classified Ad',
    user: req.user
  });
});

/* GET register */
router.get('/register', function(req, res, next) {
  // load the register.ejs view
  res.render('register', {
    title: 'Please Register',
    user: null
  });
});

/* GET login */
router.get('/login', function(req, res, next) {
  let messages = req.session.messages || [];
  req.session.messages = []; // clear messages from session
  res.render('login', {
    title: 'Please Login',
    messages: messages,
    user: null
  });
});

/* POST register */
router.post('/register', function(req, res, next) {
  // use the Account model to create a new user account
  User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      res.render('error', { title: 'Create User Error'});
    }
    res.redirect('/login');
  });
});

/* POST login */
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureMessage: 'Invalid Login'
}));

/* GET logout */
router.get('/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

router.get('/facebook', passport.authenticate('facebook', {scope: 'email'}));		 
router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login', scope: 'email' }),
  function(req, res) {
    // Successful authentication, redirect home. 
    res.redirect('/');
  }
);

module.exports = router;
