const { GraphQLInputObjectType, GraphQLNonNull, GraphQLString } = require('graphql')
const { InputTypeComposer } = require('graphql-compose')
const InputType = new InputTypeComposer(
    new GraphQLInputObjectType({
      name: 'FileInput',
      fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        type: { type: new GraphQLNonNull(GraphQLString) },
        mapKey: { type: new GraphQLNonNull(GraphQLString) },
      },
    })
)

module.exports = {
  inputType: InputType,
}