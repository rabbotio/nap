'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _express = require('express');var _express2 = _interopRequireDefault(_express);
var _graphqlSchema = require('./graphqlSchema');var _graphqlSchema2 = _interopRequireDefault(_graphqlSchema);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}exports.default =

{
  uri: '/user',
  schema: _graphqlSchema2.default,
  title: 'User: simple schema with one type.',
  description: 'This schema implements all 13 CRUD operations available in graphql-compose-mongoose.',
  github: 'https://github.com/nodkz/graphql-compose-examples/tree/master/examples/user',
  queries: [
  {
    title: 'Find by id',
    query: '\n{\n  userById(_id: "57bb44dd21d2befb7ca3f010") {\n    _id\n    name\n    languages {\n      language\n      skill\n    }\n    contacts {\n      email\n    }\n    gender\n    age\n  }\n}\n      ' },

















  {
    title: 'Find one User',
    query: '\n{\n  userOne(filter: { age: 18 }, sort: _ID_ASC) {\n    name\n    languages {\n      language\n      skill\n    }\n    contacts {\n      email\n    }\n    gender\n    age\n  }\n}\n      ' },
















  {
    title: 'Find many Users',
    query: '\n{\n  userMany(filter: { gender: male }, limit: 5, sort: _ID_ASC) {\n    name\n    languages {\n      language\n      skill\n    }\n    contacts {\n      email\n    }\n    gender\n    age\n  }\n}\n      ' },
















  {
    title: 'Find many Users (by geo distance)',
    query: '\n{\n  distance_5_km: userMany(filter: {\n    geoDistance: {\n      lng: 76.911982,\n      lat: 43.233893,\n      distance: 5000,\n    }\n  }) {\n    name\n    address {\n      geo\n    }\n  }\n\n  distance_100_km: userMany(filter: {\n    geoDistance: {\n      lng: 76.911982,\n      lat: 43.233893,\n      distance: 100000,\n    }\n  }) {\n    name\n    address {\n      geo\n    }\n  }\n}\n      ' },





























  {
    title: 'Find User with field of MIXED type',
    query: '\n{\n  userById(_id: "57bb44dd21d2befb7ca3f001") {\n    _id\n    name\n    someMixed\n  }\n}\n      ' },









  {
    title: 'Create user mutation (with arg of MIXED type)',
    query: '\nmutation {\n  userCreate(record: {\n    name: "My Name",\n    age: 24,\n    gender: ladyboy,\n    contacts: {\n      email: "mail@example.com",\n      phones: [\n        "111-222-333-444",\n        "444-555-666-777"\n      ]\n    },\n    someMixed: {\n      a: 1,\n      b: 2,\n      c: [ 1, 2, 3, true, false, { sub: 1 }]\n    }\n  }) {\n    recordId\n    record {\n      name\n      age\n      gender\n      contacts {\n        email\n        phones\n      }\n      someMixed\n    }\n  }\n}\n      ' }] };