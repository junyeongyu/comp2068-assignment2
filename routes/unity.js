"use strict";
let express = require('express');
let router = express.Router();

let passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('unity/index', {
    title: 'Slot Machine',
    user: req.user
  });
});

module.exports = router;