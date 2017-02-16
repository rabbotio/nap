'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.UserTC = exports.User = exports.UserSchema = undefined;var _mongoose = require('mongoose');var _mongoose2 = _interopRequireDefault(_mongoose);
var _graphqlComposeMongoose = require('graphql-compose-mongoose');var _graphqlComposeMongoose2 = _interopRequireDefault(_graphqlComposeMongoose);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}


var LanguagesSchema = new _mongoose2.default.Schema(
{
  language: String,
  skill: {
    type: String,
    enum: ['basic', 'fluent', 'native'] } },


{
  _id: false });



var AddressSchema = new _mongoose2.default.Schema(
{
  street: String,
  geo: {
    type: [Number],
    index: '2dsphere' } });




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
    enum: ['male', 'female', 'ladyboy'] },

  address: {
    type: AddressSchema },

  someMixed: {
    type: _mongoose2.default.Schema.Types.Mixed,
    description: 'Some dynamic data' } },

{
  collection: 'user_users' });


var User = exports.User = _mongoose2.default.model('User', UserSchema);

var UserTC = exports.UserTC = (0, _graphqlComposeMongoose2.default)(User);


UserTC.setResolver('findMany', UserTC.getResolver('findMany').
addFilterArg({
  name: 'geoDistance',
  type: 'input GeoDistance {\n      lng: Float!\n      lat: Float!\n      # Distance in meters\n      distance: Float!\n    }',





  description: 'Search by distance in meters',
  query: function query(rawQuery, value, resolveParams) {
    if (!value.lng || !value.lat || !value.distance) return;

    rawQuery['address.geo'] = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [value.lng, value.lat] },

        $maxDistance: value.distance } };


  } }));