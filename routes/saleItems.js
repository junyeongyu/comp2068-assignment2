"use strict";
let express = require('express');
let router = express.Router();

let SaleItem = require('../models/saleItem');

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

/* GET Items for Sale main page */
router.get('/', function(req, res, next) {
  SaleItem.find(function(err, saleItems) {
    if (err) {
      return renderError(req, res, err);
    }
    res.render('saleItems/index', {
      saleItems: saleItems,
      title: 'Items for Sale',
      user: req.user
    });
  });
});

// GET /saleItems/add
router.get('/add', verifyLogin,  function(req, res, next) {
	console.log(req.user);
   res.render('saleItems/add', {
      title: 'Classified Ad Details',
      user: req.user
   });
});

// POST /saleItems/add
router.post('/add', verifyLogin, function(req, res, next) {
  SaleItem.create({
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    view: 0,
    username: req.body.username
  }, function(err, saleItem) {
    if (err) {
      return renderError(req, res, err);
    }
    res.redirect('/saleItems');
  });
});

// GET /saleItems/delete/_id
router.get('/delete/:_id', verifyLogin, function(req, res, next) {
  let _id = req.params._id;
  SaleItem.remove({ _id: _id }, function(err) {
    if (err) {
      return renderError(req, res, err);
    }
    res.redirect('/saleItems');
  });
});

// GET /saleItems/_id
router.get('/:_id', verifyLogin, function(req, res, next) {
   let _id = req.params._id;
   SaleItem.findById(_id, function(err, saleItem) {
      if (err) {
        return renderError(req, res, err);
      }
      res.render('saleItems/edit', {
         saleItem: saleItem,
         title: 'saleItem Details',
         user: req.user
      });
   });
});

// POST /saleItems/_id - save the updated saleItem
router.post('/:_id', verifyLogin, function(req, res, next) {
  let _id = req.params._id;
  SaleItem.findById(_id, function(err, saleItemParam) {
    if (err) {
      return renderError(req, res, err);
    }
    let saleItem = new SaleItem({
      _id: _id,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      view: saleItemParam.view + 1
    });
    
    saleItem.update({ _id: _id }, saleItem,  function(err) {
      if (err) {
        return renderError(req, res, err);
      }
      res.redirect('/saleItems');
    });
  });
});

module.exports = router;