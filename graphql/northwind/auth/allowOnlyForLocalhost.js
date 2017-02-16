'use strict';Object.defineProperty(exports, "__esModule", { value: true });exports.default = allowOnlyForLocalhost;function allowOnlyForLocalhost(resolvers) {
  var secureResolvers = {};
  Object.keys(resolvers).forEach(function (k) {
    secureResolvers[k] = resolvers[k].wrapResolve(function (next) {return function (rp) {
        if (rp.context.ip === '127.0.0.1' || rp.context.ip === '0:0:0:0:0:0:0:1' || rp.context.ip === '::1') {
          return next(rp);
        }
        throw new Error(
        '✋ 🛑 For security reason this operation is allowed only on localhost. ' +
        '🚀 Please clone https://github.com/nodkz/graphql-compose-examples repo. ' +
        '🚀 And start server locally.');
      };});
  });
  return secureResolvers;
}