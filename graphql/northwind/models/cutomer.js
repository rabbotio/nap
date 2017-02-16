'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.CustomerTC = exports.Customer = exports.CustomerSchema = undefined;var _mongoose = require('mongoose');var _mongoose2 = _interopRequireDefault(_mongoose);
var _graphqlComposeMongoose = require('graphql-compose-mongoose');var _graphqlComposeMongoose2 = _interopRequireDefault(_graphqlComposeMongoose);
var _graphqlComposeRelay = require('graphql-compose-relay');var _graphqlComposeRelay2 = _interopRequireDefault(_graphqlComposeRelay);

var _addressSchema = require('./addressSchema');
var _order = require('./order');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var CustomerSchema = exports.CustomerSchema = new _mongoose.Schema({
  customerID: {
    type: String,
    description: 'Customer unique ID',
    unique: true },


  companyName: {
    type: String,
    unique: true },

  contactName: String,
  contactTitle: String,
  address: _addressSchema.AddressSchema },
{
  collection: 'northwind_customers' });


var Customer = exports.Customer = _mongoose2.default.model('Customer', CustomerSchema);

var CustomerTC = exports.CustomerTC = (0, _graphqlComposeRelay2.default)((0, _graphqlComposeMongoose2.default)(Customer));

CustomerTC.addRelation(
'orderConnection',
function () {return {
    resolver: _order.OrderTC.getResolver('connection'),
    args: {
      filter: function filter(source) {return { customerID: source.customerID };} },

    projection: { customerID: true } };});