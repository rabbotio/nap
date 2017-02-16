'use strict';var _index = require('../index');var _index2 = _interopRequireDefault(_index);
var _graphqlSchema = require('../graphqlSchema');var _graphqlSchema2 = _interopRequireDefault(_graphqlSchema);
var _graphql = require('graphql');function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { default: obj };}function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}

describe('nortwind > queries', function () {
  _index2.default.queries.forEach(function (_ref) {var query = _ref.query,title = _ref.title;
    it(title, _asyncToGenerator(regeneratorRuntime.mark(function _callee() {var result;return regeneratorRuntime.wrap(function _callee$(_context) {while (1) {switch (_context.prev = _context.next) {case 0:_context.next = 2;return (
                (0, _graphql.graphql)(_index2.default.schema, query));case 2:result = _context.sent;
              expect(result).toMatchSnapshot();case 4:case 'end':return _context.stop();}}}, _callee, undefined);})));

  });
});

describe('nortwind > mutations', function () {

});