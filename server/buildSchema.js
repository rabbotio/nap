const fs = require( 'fs')
const path = require( 'path')
const { graphql } = require( 'graphql')
const { introspectionQuery, printSchema } = require( 'graphql/utilities')
const { getExampleNames, resolveExamplePath } = require( '../graphql')

async function buildSchema(schemaPath) {
  const Schema = require(`${schemaPath}/graphqlSchema`).default
  const result = await (graphql(Schema, introspectionQuery))
  if (result.errors) {
    debug.error(
      'ERROR introspecting schema: ',
      JSON.stringify(result.errors, null, 2)
    )
  } else {
    fs.writeFileSync(
      path.join(schemaPath, './data/schema.graphql.json'),
      JSON.stringify(result, null, 2)
    )
    debug.log(`  write file ${path.join(schemaPath, './data/schema.graphql.json')}`)
  }

  // Save user readable type system shorthand of schema
  fs.writeFileSync(
    path.join(schemaPath, './data/schema.graphql.txt'),
    printSchema(Schema)
  )
  debug.log(`  write file ${path.join(schemaPath, './data/schema.graphql.txt')}`)
}

async function run() {
  const exampleNames = getExampleNames()
  for (let name of exampleNames) {
    debug.log(`Building schema for '${name}'...`)
    await buildSchema(resolveExamplePath(name));
  }

  debug.log('Building schemas competed!')
}

run().catch(e => {
  debug.log(e)
  // process.exit(0)
})
