'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.AddressSchema = undefined;var _mongoose = require('mongoose');

var AddressSchema = exports.AddressSchema = new _mongoose.Schema({
  street: String,
  city: String,
  region: String,
  postalCode: String,
  country: String,
  phone: String },

{
  _id: false });