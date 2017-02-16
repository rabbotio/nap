'use strict';Object.defineProperty(exports, "__esModule", { value: true });var _express = require('express');var _express2 = _interopRequireDefault(_express);
var _graphqlSchema = require('./graphqlSchema');var _graphqlSchema2 = _interopRequireDefault(_graphqlSchema);function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}exports.default =

{
  uri: '/northwind',
  schema: _graphqlSchema2.default,
  title: 'Northwind: complex schema with 8 models 🌶🌶🌶',
  description: 'This is a sample data of some trading company, which consists from 8 models. All models has cross-relations to each other. This schema used in <b><a href="https://nodkz.github.io/relay-northwind/" target="_blank">Relay example app <span class="glyphicon glyphicon-new-window"></span></a></b>',
  github: 'https://github.com/nodkz/graphql-compose-examples/tree/master/examples/northwind',
  queries: [
  {
    title: 'Self referenced Employee Type',
    query: '\n{\n  viewer {\n    employeeList {\n      firstName\n      subordinates {\n        firstName\n      }\n      chief {\n        firstName\n      }\n    }\n  }\n}\n      ' },















  {
    title: 'OrderConnection -> OrderDetails -> Product',
    query: '\n{\n  viewer {\n    orderConnection(first: 3) {\n      count\n      edges {\n        node {\n          orderID\n          customer {\n            companyName\n            contactName\n          }\n          details {\n            unitPrice\n            quantity\n            product {\n              name\n              unitsInStock\n              discontinued\n            }\n          }\n        }\n      }\n    }\n  }\n}\n      ' },



























  {
    title: 'Sorting on ConnectionType by unique indexed fields',
    query: '\n{\n  viewer {\n    asc: productConnection(\n      sort: PRODUCTID_ASC,\n      first: 3\n    ) {\n      edges {\n      \tnode {\n          productID\n          name\n        }\n    \t}\n    }\n    desc: productConnection(\n      sort: PRODUCTID_DESC,\n      first: 3\n    ) {\n      edges {\n      \tnode {\n          productID\n          name\n        }\n    \t}\n    }\n    ascComplex: productConnection(\n      sort: NAME__SUPPLIERID_ASC,\n      first: 3\n    ) {\n      edges {\n      \tnode {\n          name\n          supplierID\n        }\n    \t}\n    }\n    descComplex: productConnection(\n      sort: NAME__SUPPLIERID_DESC,\n      first: 3\n    ) {\n      edges {\n      \tnode {\n          name\n          supplierID\n        }\n    \t}\n    }\n  }\n}\n      ' },


















































  {
    title: 'Fulltext search with weights, negates term, phrase search',
    query: '\n{\n  viewer {\n    phraseSearch: employeeList(filter: {\n      fullTextSearch: "\\"fluent in French and German\\""\n    }) {\n      firstName\n      lastName\n      title\n      notes\n    }\n    negatesTerm: employeeList(filter: {\n      fullTextSearch: "French -German"\n    }) {\n      firstName\n      lastName\n      title\n      notes\n    }\n    wordSearch: employeeList(filter: {\n      fullTextSearch: "Vice Sale"\n    }) {\n      firstName\n      lastName\n      title\n      notes\n    }\n  }\n}\n      ' },






























  {
    title: 'Some crazy query',
    query: '\n{\n  viewer {\n    meatCategory: category(filter: {categoryID:6}) {\n      name\n      productConnection {\n        edges {\n          node {\n            name\n            supplier {\n              companyName\n              address {\n                street\n                country\n                city\n              }\n            }\n          }\n        }\n      }\n    }\n    supplier {\n      supplierID\n    \tcompanyName\n      contactName\n      productConnection {\n        count\n        edges {\n          node {\n            name\n            unitPrice\n            quantityPerUnit\n            category {\n              name\n              categoryID\n              productConnection {\n                count\n              }\n            }\n          }\n        }\n      }\n  \t}\n    p1: product {\n      name\n      productID\n    }\n    p2: product(skip: 2) {\n      name\n      productID\n      orderConnection {\n        count\n        edges {\n          node {\n            customer {\n              companyName\n              contactName\n        \t\t\tcontactTitle\n              orderConnection {\n                count\n                edges {\n                  node {\n                    shipVia\n                    shipper {\n                      companyName\n                      orderConnection(first: 1, sort: _ID_DESC) {\n                        count\n                        edges {\n                          node {\n                            freight\n                      \t  }\n                        }\n                      }\n                    }\n                  }\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n    p3: product(skip: 1) {\n      name\n      productID\n    }\n    categoryList(limit: 3) {\n      name\n      description\n      productConnection(first: 1) {\n        count\n        edges {\n          node {\n            name\n            unitPrice\n            discontinued\n          }\n        }\n      }\n    }\n  }\n}\n      ' },







































































































  {
    title: 'Mutation example (✋ 🛑 For security reason this operation is allowed only on localhost).',
    query: '\nmutation {\n  removeProductById(input: {\n    _id: "589d4a5fbd19c70027d2f9b8",\n  }) {\n    recordId\n  }\n}\n      ' }] };