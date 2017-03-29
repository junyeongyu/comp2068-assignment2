"use strict";
let mongoose = require('mongoose');

let plm = require('passport-local-mongoose');
let findOrCreate = require('mongoose-findorcreate');

let userSchema = new mongoose.Schema({});

userSchema.plugin(plm); // for passport local authentication
userSchema.plugin(findOrCreate); // used for social authentication

module.exports = mongoose.model('User', userSchema);