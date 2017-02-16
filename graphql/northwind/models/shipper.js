'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.ShipperTC = exports.Shipper = exports.ShipperSchema = undefined;var _mongoose = require('mongoose');var _mongoose2 = _interopRequireDefault(_mongoose);
var _graphqlComposeMongoose = require('graphql-compose-mongoose');var _graphqlComposeMongoose2 = _interopRequireDefault(_graphqlComposeMongoose);
var _graphqlComposeRelay = require('graphql-compose-relay');var _graphqlComposeRelay2 = _interopRequireDefault(_graphqlComposeRelay);

var _order = require('./order');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var ShipperSchema = exports.ShipperSchema = new _mongoose.Schema({
  shipperID: {
    type: Number,
    description: 'Shipper unique ID',
    unique: true },

  companyName: String,
  phone: String },
{
  collection: 'northwind_shippers' });


var Shipper = exports.Shipper = _mongoose2.default.model('Shipper', ShipperSchema);

var ShipperTC = exports.ShipperTC = (0, _graphqlComposeRelay2.default)((0, _graphqlComposeMongoose2.default)(Shipper));

ShipperTC.addRelation(
'orderConnection',
function () {return {
    resolver: _order.OrderTC.getResolver('connection'),
    args: {
      filter: function filter(source) {return { shipVia: source.shipperID };} },

    projection: { shipperID: true } };});