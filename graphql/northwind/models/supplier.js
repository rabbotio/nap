'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.SupplierTC = exports.Supplier = exports.SupplierSchema = undefined;var _mongoose = require('mongoose');var _mongoose2 = _interopRequireDefault(_mongoose);
var _graphqlComposeMongoose = require('graphql-compose-mongoose');var _graphqlComposeMongoose2 = _interopRequireDefault(_graphqlComposeMongoose);
var _graphqlComposeRelay = require('graphql-compose-relay');var _graphqlComposeRelay2 = _interopRequireDefault(_graphqlComposeRelay);

var _addressSchema = require('./addressSchema');
var _product = require('./product');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var SupplierSchema = exports.SupplierSchema = new _mongoose.Schema({
  supplierID: {
    type: Number,
    description: 'Supplier unique ID',
    unique: true },

  companyName: {
    type: String,
    unique: true },

  contactName: String,
  contactTitle: String,
  address: _addressSchema.AddressSchema },
{
  collection: 'northwind_suppliers' });


var Supplier = exports.Supplier = _mongoose2.default.model('Supplier', SupplierSchema);

var SupplierTC = exports.SupplierTC = (0, _graphqlComposeRelay2.default)((0, _graphqlComposeMongoose2.default)(Supplier));

SupplierTC.addRelation(
'productConnection',
function () {return {
    resolver: _product.ProductTC.getResolver('connection'),
    args: {
      filter: function filter(source) {return { supplierID: source.supplierID };} },

    projection: { supplierID: true } };});