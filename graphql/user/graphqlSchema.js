'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _user = require('./models/user');






var _graphqlCompose = require('graphql-compose');
var GQC = new _graphqlCompose.ComposeStorage();


GQC.rootQuery().addFields({
  userById: _user.UserTC.getResolver('findById'),
  userByIds: _user.UserTC.getResolver('findByIds'),
  userOne: _user.UserTC.getResolver('findOne'),
  userMany: _user.UserTC.getResolver('findMany'),
  userTotal: _user.UserTC.getResolver('count'),
  userConnection: _user.UserTC.getResolver('connection') });


GQC.rootMutation().addFields({
  userCreate: _user.UserTC.getResolver('createOne'),
  userUpdateById: _user.UserTC.getResolver('updateById'),
  userUpdateOne: _user.UserTC.getResolver('updateOne'),
  userUpdateMany: _user.UserTC.getResolver('updateMany'),
  userRemoveById: _user.UserTC.getResolver('removeById'),
  userRemoveOne: _user.UserTC.getResolver('removeOne'),
  userRemoveMany: _user.UserTC.getResolver('removeMany') });


var graphqlSchema = GQC.buildSchema();exports.default =
graphqlSchema;