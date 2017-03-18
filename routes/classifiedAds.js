"use strict";
let express = require('express');
let router = express.Router();

let ClassifiedAd = require('../models/classifiedAd');

// Authentication check
function verifyLogin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

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

/* GET Classified Ads main page */
router.get('/', function(req, res, next) {
  ClassifiedAd.find(function(err, classifiedAds) {
    if (err) {
      return renderError(req, res, err);
    }
    res.render('classifiedAds/index', {
      classifiedAds: classifiedAds,
      title: 'Classified Ads',
      user: req.user
    });
  });
});

// GET /classifiedAds/add
router.get('/add', verifyLogin,  function(req, res, next) {
	console.log(req.user);
   res.render('classifiedAds/add', {
      title: 'Classified Ad Details',
      user: req.user
   });
});

// POST /classifiedAds/add
router.post('/add', verifyLogin, function(req, res, next) {
  ClassifiedAd.create({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    view: 0,
    username: req.body.username
  }, function(err, classifiedAd) {
    if (err) {
      return renderError(req, res, err);
    }
    res.redirect('/classifiedAds');
  });
});

// GET /classifiedAds/delete/_id
router.get('/delete/:_id', verifyLogin, function(req, res, next) {
  let _id = req.params._id;
  ClassifiedAd.remove({ _id: _id }, function(err) {
    if (err) {
      return renderError(req, res, err);
    }
    res.redirect('/classifiedAds');
  });
});

// GET /classifiedAds/_id
router.get('/:_id', verifyLogin, function(req, res, next) {
   let _id = req.params._id;
   ClassifiedAd.findById(_id, function(err, classifiedAd) {
      if (err) {
        return renderError(req, res, err);
      }
      res.render('classifiedAds/edit', {
         classifiedAd: classifiedAd,
         title: 'classifiedAd Details',
         user: req.user
      });
   });
});

// POST /classifiedAds/_id - save the updated classifiedAd
router.post('/:_id', verifyLogin, function(req, res, next) {
  let _id = req.params._id;
  ClassifiedAd.findById(_id, function(err, classifiedAdParam) {
    if (err) {
      return renderError(req, res, err);
    }
    let classifiedAd = new ClassifiedAd({
      _id: _id,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      view: classifiedAdParam.view + 1
    });
    
    classifiedAd.update({ _id: _id }, classifiedAd,  function(err) {
      if (err) {
        return renderError(req, res, err);
      }
      res.redirect('/classifiedAds');
    });
  });
});

module.exports = router;