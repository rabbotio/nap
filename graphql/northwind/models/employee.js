'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.EmployeeTC = exports.Employee = exports.EmployeeSchema = undefined;var _mongoose = require('mongoose');var _mongoose2 = _interopRequireDefault(_mongoose);
var _graphqlComposeMongoose = require('graphql-compose-mongoose');var _graphqlComposeMongoose2 = _interopRequireDefault(_graphqlComposeMongoose);
var _graphqlComposeRelay = require('graphql-compose-relay');var _graphqlComposeRelay2 = _interopRequireDefault(_graphqlComposeRelay);
var _addressSchema = require('./addressSchema');
var _order = require('./order');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var EmployeeSchema = exports.EmployeeSchema = new _mongoose.Schema({
  employeeID: {
    type: Number,
    description: 'Category unique ID',
    index: true },

  lastName: String,
  firstName: String,
  title: String,
  titleOfCourtesy: String,
  birthDate: Date,
  hireDate: Date,
  address: _addressSchema.AddressSchema,
  notes: String,
  reportsTo: {
    type: Number,
    description: 'ID of chief' },

  territoryIDs: {
    type: [Number],
    index: true,
    description: 'Attached territory ID from region collection' } },

{
  collection: 'northwind_employees' });


EmployeeSchema.index({ lastName: 1, firstName: 1 }, { unique: true });
EmployeeSchema.index({
  lastName: 'text',
  firstName: 'text',
  title: 'text',
  notes: 'text',
  'address.street': 'text',
  'address.city': 'text',
  'address.region': 'text',
  'address.postalCode': 'text',
  'address.country': 'text',
  'address.phone': 'text' },
{
  name: 'EmployeesTextIndex',
  default_language: 'english',
  weights: {
    lastName: 10,
    firstName: 10,
    title: 5 } });




var Employee = exports.Employee = _mongoose2.default.model('Employee', EmployeeSchema);

var EmployeeTC = exports.EmployeeTC = (0, _graphqlComposeRelay2.default)((0, _graphqlComposeMongoose2.default)(Employee));

var findManyResolver = EmployeeTC.getResolver('findMany').
addFilterArg({
  name: 'fullTextSearch',
  type: 'String',
  description: 'Fulltext search with mongodb stemming and weights',
  query: function query(_query, value, resolveParams) {
    resolveParams.args.sort = {
      score: { $meta: 'textScore' } };

    _query.$text = { $search: value, $language: 'ru' };
    resolveParams.projection.score = { $meta: 'textScore' };
  } });

EmployeeTC.setResolver('findMany', findManyResolver);

EmployeeTC.addRelation(
'chief',
function () {return {
    resolver: EmployeeTC.getResolver('findOne').
    wrapResolve(function (next) {return function (resolveParams) {

        return resolveParams.source.reportsTo ? next(resolveParams) : null;
      };}),
    args: {
      filter: function filter(source) {return { employeeID: source.reportsTo };},
      skip: null,
      sort: null },

    projection: { reportsTo: true } };});



EmployeeTC.addRelation(
'subordinates',
function () {return {
    resolver: EmployeeTC.getResolver('findMany'),
    args: {
      filter: function filter(source) {return { reportsTo: source.employeeID };} },

    projection: { employeeID: true } };});



EmployeeTC.addRelation(
'orderConnection',
function () {return {
    resolver: _order.OrderTC.getResolver('connection'),
    args: {
      filter: function filter(source) {return { employeeID: source.employeeID };} },

    projection: { employeeID: true } };});