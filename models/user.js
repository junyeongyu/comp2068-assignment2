"use strict";
let mongoose = require('mongoose');

let plm = require('passport-local-mongoose');
let findOrCreate = require('mongoose-findorcreate');

let userSchema = new mongoose.Schema({});

userSchema.plugin(plm);
userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);