'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.RegionTC = exports.Region = exports.RegionSchema = exports.TerritorySchema = undefined;var _mongoose = require('mongoose');var _mongoose2 = _interopRequireDefault(_mongoose);
var _graphqlComposeMongoose = require('graphql-compose-mongoose');var _graphqlComposeMongoose2 = _interopRequireDefault(_graphqlComposeMongoose);
var _graphqlComposeRelay = require('graphql-compose-relay');var _graphqlComposeRelay2 = _interopRequireDefault(_graphqlComposeRelay);

var _employee = require('./employee');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var TerritorySchema = exports.TerritorySchema = (0, _mongoose.Schema)({
  territoryID: Number,
  name: String },
{
  _id: false });


var RegionSchema = exports.RegionSchema = new _mongoose.Schema({
  regionID: {
    type: Number,
    description: 'Region unique ID',
    unique: true },

  name: String,
  territories: {
    type: [TerritorySchema] } },

{
  collection: 'northwind_regions' });


var Region = exports.Region = _mongoose2.default.model('Region', RegionSchema);

var RegionTC = exports.RegionTC = (0, _graphqlComposeRelay2.default)((0, _graphqlComposeMongoose2.default)(Region));

RegionTC.addRelation(
'employees',
function () {return {
    resolver: _employee.EmployeeTC.getResolver('findMany'),
    args: {
      filter: function filter(source) {return {
          _operators: {
            territoryIDs: {
              in: source.territories.map(function (t) {return t.territoryID;}) || [] } } };} },




    projection: { territories: { territoryID: true } } };});