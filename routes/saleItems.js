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
  SaleItem.find({}).sort({date: 'desc'}).exec(function(err, saleItems) {
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
    date: new Date(),
    username: req.user.username,
    phone: req.body.phone,
    address: req.body.address,
    view: 0
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

//GET /saleItems/detail/_id --> Public page that can be approached by any user
router.get('/detail/:_id', function(req, res, next) {
   let _id = req.params._id;
   SaleItem.findById(_id, function(err, saleItem) {
      if (err) {
        return renderError(req, res, err);
      }
      
      saleItem.view = saleItem.view + 1; // add view count
      saleItem.update(saleItem,  function(err) {
        if (err) {
          return renderError(req, res, err);
        }
        res.render('saleItems/detail', {
            saleItem: saleItem,
            title: 'SaleItem Details',
            user: req.user
        });
      });
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
         title: 'SaleItem Edit',
         user: req.user
      });
   });
});

// POST /saleItems/_id - save the updated saleItem
router.post('/:_id', verifyLogin, function(req, res, next) {
  let _id = req.params._id;
  SaleItem.findById(_id, function(err, saleItem) {
    if (err) {
      return renderError(req, res, err);
    }
    saleItem.title = req.body.title;
    saleItem.description = req.body.description;
    saleItem.price = req.body.price;
    saleItem.date = new Date();
    saleItem.phone = req.body.phone;
    saleItem.address = req.body.address;
    
    saleItem.update(saleItem,  function(err) {
      if (err) {
        return renderError(req, res, err);
      }
      res.redirect('/saleItems');
    });
  });
});

module.exports = router;