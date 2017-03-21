"use strict";
// reference mongoose
let mongoose = require('mongoose');

// create classified ad schema (class)
var saleItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: 'Title is required'
    },
    description: {
        type: String,
        required: 'Description is required'
    },
    price: {
        type: Number,
        min: 0.01,
        required: 'Price is required'
    },
    date: {
        type: Date,
        required: 'Date is required'
    },
    username: {// user login id
        type: String,
        required: 'Username is required'
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    view: {
        type: Number,
        required: 'View count is required'
    }
});

// make it public
module.exports = mongoose.model('SaleItem', saleItemSchema);