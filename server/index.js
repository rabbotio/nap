require('./debug')
const config = require('./config');

const start = () => {
  // Next
  global.NAP = {};
  const nextjs = require('next')({ dev: config.dev })

  // Will apply middleware
  const initializer = require('./initializer')
  return nextjs.prepare().then(() => initializer(config, nextjs)).catch(console.log)
}

module.exports = {
  start,
  extendModel: require('./graphql/models').extendModel,
};
