'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.CategoryTC = exports.Category = exports.CategorySchema = undefined;var _mongoose = require('mongoose');var _mongoose2 = _interopRequireDefault(_mongoose);
var _graphqlComposeMongoose = require('graphql-compose-mongoose');var _graphqlComposeMongoose2 = _interopRequireDefault(_graphqlComposeMongoose);
var _graphqlComposeRelay = require('graphql-compose-relay');var _graphqlComposeRelay2 = _interopRequireDefault(_graphqlComposeRelay);

var _product = require('./product');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}

var CategorySchema = exports.CategorySchema = new _mongoose.Schema({
  categoryID: {
    type: Number,
    description: 'Category unique ID',
    unique: true },

  name: {
    type: String,
    unique: true },

  description: String },
{
  collection: 'northwind_categories' });


var Category = exports.Category = _mongoose2.default.model('Category', CategorySchema);

var CategoryTC = exports.CategoryTC = (0, _graphqlComposeRelay2.default)((0, _graphqlComposeMongoose2.default)(Category));

CategoryTC.addRelation(
'productConnection',
function () {return {
    resolver: _product.ProductTC.getResolver('connection'),
    args: {
      filter: function filter(source) {return { categoryID: source.categoryID };} },

    projection: { categoryID: true } };});