"use strict";
// reference mongoose
let mongoose = require('mongoose');

// create classified ad schema (class)
var classifiedAdSchema = new mongoose.Schema({
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
    view: {
        type: Number,
        required: 'View count is required'
    },
    username: {// user login id
        type: String,
        required: 'Username is required'
    }
});

// make it public
module.exports = mongoose.model('ClassifiedAd', classifiedAdSchema);