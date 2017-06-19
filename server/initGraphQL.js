const fs = require('fs')
const path = require('path')

const init = ({ graphiql_enabled: graphiql, port }, app) => {
  // Custom GraphQL
  NAP.expose = {
    extendModel: require('./graphql').extendModel,
    setBuildGraphqlSchema: require('./graphql').setBuildGraphqlSchema,
    FileType: require('./graphql/types/File'),
    getFile: require('./graphql').getFile,
  }

  if (fs.existsSync(path.resolve(__dirname, '../graphql/setup.js'))) {
    require('../graphql/setup')
  }

  // Upload
  const multer = require('multer')
  const upload = multer({ dest: './.tmp' })

  // CORS
  const cors = require('cors')
  app.use(cors())

  // Helmet
  const helmet = require('helmet')
  app.use(helmet())

  // GraphQL
  const graphqlHTTP = require('express-graphql')

  const { buildSchema } = require('./graphql')
  const { authenticate } = require('./jwt-token')
  const schema = buildSchema()
  app.use('/graphql',
    upload.array('files'),
    authenticate,
    graphqlHTTP(() => ({
      schema,
      graphiql,
      formatError: ({ message, stack }) => ({
        message: message,
        stack: !message.match(/[NOSTACK]/i) ? stack.split('\n') : null,
      }),
    }))
  )

  // Status  
  debug.info(`GraphQL :`, graphiql ? `http://localhost:${port}/graphql` : 'N/A')
}

module.exports = init
