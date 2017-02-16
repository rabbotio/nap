'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.ProductTC = exports.Product = exports.ProductSchema = undefined;var _mongoose = require('mongoose');var _mongoose2 = _interopRequireDefault(_mongoose);
var _graphqlComposeMongoose = require('graphql-compose-mongoose');var _graphqlComposeMongoose2 = _interopRequireDefault(_graphqlComposeMongoose);
var _graphqlComposeRelay = require('graphql-compose-relay');var _graphqlComposeRelay2 = _interopRequireDefault(_graphqlComposeRelay);

var _order = require('./order');
var _supplier = require('./supplier');
var _category = require('./category');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var ProductSchema = exports.ProductSchema = new _mongoose.Schema({
  productID: {
    type: Number,
    description: 'Unique product id',
    unique: true },

  name: String,
  supplierID: Number,
  categoryID: Number,
  quantityPerUnit: String,
  unitPrice: {
    type: Number,
    index: true },

  unitsInStock: Number,
  unitsOnOrder: Number,
  reorderLevel: Number,
  discontinued: Boolean },
{
  collection: 'northwind_products' });


ProductSchema.index({ name: 1, supplierID: 1 }, { unique: true });

var Product = exports.Product = _mongoose2.default.model('Product', ProductSchema);

var ProductTC = exports.ProductTC = (0, _graphqlComposeRelay2.default)((0, _graphqlComposeMongoose2.default)(Product));

var extendedResolver = ProductTC.
getResolver('findMany').
addFilterArg({
  name: 'nameRegexp',
  type: 'String',
  description: 'Search by regExp',
  query: function query(_query, value, resolveParams) {
    _query.name = new RegExp(value, 'i');
  } });

extendedResolver.name = 'findMany';
ProductTC.addResolver(extendedResolver);


ProductTC.addRelation(
'orderConnection',
function () {return {
    resolver: _order.OrderTC.getResolver('connection'),
    args: {
      filter: function filter(source) {return { details: { productID: source.productID } };} },

    projection: { productID: true } };});



ProductTC.addRelation(
'supplier',
function () {return {
    resolver: _supplier.SupplierTC.getResolver('findOne'),
    args: {
      filter: function filter(source) {return { supplierID: source.supplierID };},
      skip: null,
      sort: null },

    projection: { supplierID: true } };});



ProductTC.addRelation(
'category',
function () {return {
    resolver: _category.CategoryTC.getResolver('findOne'),
    args: {
      filter: function filter(source) {return { categoryID: source.categoryID };},
      skip: null,
      sort: null },

    projection: { categoryID: true } };});