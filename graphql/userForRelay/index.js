'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _express = require('express');var _express2 = _interopRequireDefault(_express);
var _graphqlSchema = require('./graphqlSchema');var _graphqlSchema2 = _interopRequireDefault(_graphqlSchema);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}exports.default =

{
  uri: '/userForRelay',
  schema: _graphqlSchema2.default,
  title: 'User for Relay: simple schema with one type.',
  description: 'This schema shows all available CRUD operations which are compatible with Relay.',
  github: 'https://github.com/nodkz/graphql-compose-examples/tree/master/examples/userForRelay',
  queries: [
  {
    title: 'Relay node',
    query: '\n{\n  node(id: "VXNlclJlbGF5OjU3YmI0NGRkMjFkMmJlZmI3Y2EzZjAxMA==") {\n    ...on UserRelay {\n      _id\n      id\n      name\n      age\n      gender\n    }\n  }\n}\n      ' },













  {
    title: 'Relay Connection',
    query: '\n{\n  userConnection(first:3, sort: _ID_ASC) {\n    edges {\n      cursor\n      node {\n        _id\n        id\n        name\n      }\n    }\n  }\n}\n      ' },














  {
    title: 'Create user mutation',
    query: '\nmutation {\n  userCreate(input: {\n    clientMutationId: "1",\n    record: {\n      name: "My Name",\n      age: 24,\n      gender: ladyboy,\n      contacts: {\n        email: "mail@example.com",\n        phones: [\n          "111-222-333-444",\n          "444-555-666-777"\n        ]\n      }\n    }\n  }) {\n    clientMutationId\n    nodeId\n    recordId\n    record {\n      name\n      age\n      gender\n      contacts {\n        email\n        phones\n      }\n    }\n  }\n}\n      ' }] };