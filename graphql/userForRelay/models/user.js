'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.UserTC = exports.User = exports.UserSchema = undefined;var _mongoose = require('mongoose');var _mongoose2 = _interopRequireDefault(_mongoose);
var _graphqlComposeMongoose = require('graphql-compose-mongoose');var _graphqlComposeMongoose2 = _interopRequireDefault(_graphqlComposeMongoose);
var _graphqlComposeRelay = require('graphql-compose-relay');var _graphqlComposeRelay2 = _interopRequireDefault(_graphqlComposeRelay);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}


var LanguagesSchema = new _mongoose2.default.Schema({
  language: String,
  skill: {
    type: String,
    enum: ['basic', 'fluent', 'native'] } },


{
  _id: false });


var UserSchema = exports.UserSchema = new _mongoose2.default.Schema({
  name: String,
  age: {
    type: Number,
    index: true },

  languages: {
    type: [LanguagesSchema],
    default: [] },

  contacts: {
    email: String,
    phones: [String] },

  gender: {
    type: String,
    enum: ['male', 'female', 'ladyboy'] } },

{
  collection: 'userForRelay_users' });


var User = exports.User = _mongoose2.default.model('UserRelay', UserSchema);

var UserTC = exports.UserTC = (0, _graphqlComposeRelay2.default)((0, _graphqlComposeMongoose2.default)(User));