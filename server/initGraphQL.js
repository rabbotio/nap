const fs = require('fs')
const path = require('path')

const init = (config, app) => {
  NAP.expose = {
    extendModel: require('./graphql').extendModel,
    setBuildGraphqlSchema: require('./graphql').setBuildGraphqlSchema,
    FileType: require('./graphql/types/File'),
    getFile: require('./graphql').getFile,
  }

  if (fs.existsSync(path.resolve(__dirname, '../graphql/setup.js'))) {
    require('../graphql/setup')
  }
  const cors = require('cors')
  const multer = require('multer')
  const upload = multer({ dest: './.tmp' })
  app.use(cors())

  // Helmet
  const helmet = require('helmet')
  app.use(helmet())

  // GraphQL
  const graphqlHTTP = require('express-graphql')

  const { buildSchema } = require('./graphql')
  const { authenticate } = require('./authen')
  const schema = buildSchema()
  app.use('/graphql', upload.array('files'), authenticate, graphqlHTTP(() => {
    return {
      schema,
      graphiql: config.graphiql_enabled,
      formatError: (error) => ({
        message: error.message,
        stack: !error.message.match(/[NOSTACK]/i) ? error.stack.split('\n') : null,
      }),
    }
  }))
}

module.exports = init
