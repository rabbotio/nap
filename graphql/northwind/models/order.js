'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.OrderTC = exports.Order = exports.OrderSchema = exports.OrderDetailsSchema = undefined;var _mongoose = require('mongoose');var _mongoose2 = _interopRequireDefault(_mongoose);
var _graphqlComposeMongoose = require('graphql-compose-mongoose');var _graphqlComposeMongoose2 = _interopRequireDefault(_graphqlComposeMongoose);
var _graphqlComposeRelay = require('graphql-compose-relay');var _graphqlComposeRelay2 = _interopRequireDefault(_graphqlComposeRelay);

var _addressSchema = require('./addressSchema');
var _cutomer = require('./cutomer');
var _employee = require('./employee');
var _shipper = require('./shipper');
var _product = require('./product');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var OrderDetailsSchema = exports.OrderDetailsSchema = new _mongoose.Schema(
{
  productID: Number,
  unitPrice: Number,
  quantity: Number,
  discount: Number },

{
  _id: false });



var OrderSchema = exports.OrderSchema = new _mongoose.Schema({
  orderID: {
    type: Number,
    description: 'Order unique ID',
    unique: true },

  customerID: String,
  employeeID: Number,
  orderDate: Date,
  requiredDate: Date,
  shippedDate: Date,
  shipVia: Number,
  freight: Number,
  shipName: String,
  shipAddress: _addressSchema.AddressSchema,
  details: {
    type: [OrderDetailsSchema],
    index: true,
    description: 'List of ordered products' } },

{
  collection: 'northwind_orders' });


var Order = exports.Order = _mongoose2.default.model('Order', OrderSchema);

var OrderTC = exports.OrderTC = (0, _graphqlComposeRelay2.default)((0, _graphqlComposeMongoose2.default)(Order));

OrderTC.addRelation(
'customer',
function () {return {
    resolver: _cutomer.CustomerTC.getResolver('findOne'),
    args: {
      filter: function filter(source) {return { customerID: source.customerID };},
      skip: null,
      sort: null },

    projection: { customerID: true } };});



OrderTC.addRelation(
'employee',
function () {return {
    resolver: _employee.EmployeeTC.getResolver('findOne'),
    args: {
      filter: function filter(source) {return { employeeID: source.employeeID };},
      skip: null,
      sort: null },

    projection: { employeeID: true } };});



OrderTC.addRelation(
'shipper',
function () {return {
    resolver: _shipper.ShipperTC.getResolver('findOne'),
    args: {
      filter: function filter(source) {return { shipperID: source.shipVia };},
      skip: null,
      sort: null },

    projection: { shipVia: true } };});



var OrderDetailsTC = OrderTC.get('details');
OrderDetailsTC.addRelation(
'product',
function () {return {
    resolver: _product.ProductTC.getResolver('findOne'),
    args: {
      filter: function filter(source) {return { productID: source.productID };},
      skip: null,
      sort: null },

    projection: { productID: true } };});