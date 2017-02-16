'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};




var _graphqlCompose = require('graphql-compose');



var _graphqlComposeRelay = require('graphql-compose-relay');var _graphqlComposeRelay2 = _interopRequireDefault(_graphqlComposeRelay);

var _category = require('./models/category');
var _cutomer = require('./models/cutomer');
var _employee = require('./models/employee');
var _order = require('./models/order');
var _product = require('./models/product');
var _region = require('./models/region');
var _shipper = require('./models/shipper');
var _supplier = require('./models/supplier');
var _allowOnlyForLocalhost = require('./auth/allowOnlyForLocalhost');var _allowOnlyForLocalhost2 = _interopRequireDefault(_allowOnlyForLocalhost);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}var GQC = new _graphqlCompose.ComposeStorage();

(0, _graphqlComposeRelay2.default)(GQC.rootQuery());

var ViewerTC = GQC.get('Viewer');
GQC.rootQuery().addFields({
  viewer: {
    type: ViewerTC.getType(),
    description: 'Data under client context',
    resolve: function resolve() {return {};} } });



var fields = {
  category: _category.CategoryTC.getResolver('findOne'),
  categoryList: _category.CategoryTC.getResolver('findMany'),

  customer: _cutomer.CustomerTC.getResolver('findOne'),
  customerConnection: _cutomer.CustomerTC.getResolver('connection'),

  employee: _employee.EmployeeTC.getResolver('findOne'),
  employeeList: _employee.EmployeeTC.getResolver('findMany'),

  order: _order.OrderTC.getResolver('findOne'),
  orderConnection: _order.OrderTC.getResolver('connection'),

  product: _product.ProductTC.getResolver('findOne'),
  productList: _product.ProductTC.getResolver('findMany'),
  productConnection: _product.ProductTC.getResolver('connection'),

  region: _region.RegionTC.getResolver('findOne'),
  regionList: _region.RegionTC.getResolver('findMany'),

  shipper: _shipper.ShipperTC.getResolver('findOne'),
  shipperList: _shipper.ShipperTC.getResolver('findMany'),

  supplier: _supplier.SupplierTC.getResolver('findOne'),
  supplierConnection: _supplier.SupplierTC.getResolver('connection') };


ViewerTC.addFields(fields);

GQC.rootMutation().addFields(_extends({},
(0, _allowOnlyForLocalhost2.default)({
  createProduct: _product.ProductTC.get('$createOne'),
  removeProductById: _product.ProductTC.get('$removeById') })));exports.default =



GQC.buildSchema();