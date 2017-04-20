const init = (config, app) => {
  const cors = require('cors')
  const multer = require('multer');
  const upload = multer({ dest: './.tmp' });
  app.use(cors())

  const graphqlHTTP = require('express-graphql')

  const { buildSchema } = require('./graphql')
  const { authenticate } = require('./authen')
  const schema = buildSchema();
  app.use('/graphql', upload.array('files'), authenticate, graphqlHTTP(() => {
    return {
      schema,
      graphiql: config.graphqliqlEnabled,
      formatError: (error) => ({
        message: error.message,
        stack: !error.message.match(/[NOSTACK]/i) ? error.stack.split('\n') : null,
      }),
    };
  }));
}

module.exports = init
