'use strict';var _index = require('../index');var _index2 = _interopRequireDefault(_index);
var _graphqlSchema = require('../graphqlSchema');var _graphqlSchema2 = _interopRequireDefault(_graphqlSchema);
var _graphql = require('graphql');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}

function findQueryByTitle(str) {
  var queryConfig = _index2.default.queries.find(function (o) {return o.title === str;});
  if (queryConfig && queryConfig.query) {
    return queryConfig.query;
  }
  return 'query not found';
}

describe('userForRelay > queries', function () {
  var alwaysSameResultTitles = [
  'Relay node',
  'Relay Connection'];

  alwaysSameResultTitles.forEach(function (title) {
    it(title, _asyncToGenerator(regeneratorRuntime.mark(function _callee() {var result;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (
                (0, _graphql.graphql)(_index2.default.schema, findQueryByTitle(title)));case 2:result = _context.sent;
              expect(result).toMatchSnapshot();case 4:case 'end':return _context.stop();}}}, _callee, undefined);})));

  });

  {
    var title = 'Create user mutation';
    it(title, _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {var result;return regeneratorRuntime.wrap(function _callee2$(_context2) {while (1) {switch (_context2.prev = _context2.next) {case 0:_context2.next = 2;return (
                (0, _graphql.graphql)(_index2.default.schema, findQueryByTitle(title)));case 2:result = _context2.sent;
              expect(result.data.userCreate.record).toMatchSnapshot();
              expect(result.data.userCreate.clientMutationId).toMatchSnapshot();case 5:case 'end':return _context2.stop();}}}, _callee2, undefined);})));

  }
});