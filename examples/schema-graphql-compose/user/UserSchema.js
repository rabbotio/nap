const mongoose = require('mongoose')
const { composeWithMongoose } = require('graphql-compose-mongoose')

const LanguagesSchema = new mongoose.Schema(
  {
    language: String,
    skill: {
      type: String,
      enum: ['basic', 'fluent', 'native'],
    },
  },
  {
    _id: false, // disable `_id` field for `Language` schema
  }
)

const UserSchema = new mongoose.Schema({
  name: String, // standard types
  age: {
    type: Number,
    index: true,
  },
  languages: {
    type: [LanguagesSchema], // you may include other schemas (here included as array of embedded documents)
    default: [],
  },
  contacts: { // another mongoose way for providing embedded documents
    email: String,
    phones: [String], // array of strings
  },
  gender: { // enum field with values
    type: String,
    enum: ['male', 'female', 'ladyboy'],
  },
})

const User = mongoose.model('User', UserSchema)
const UserTC = composeWithMongoose(User)

UserTC.setResolver('findMany', UserTC.getResolver('findMany')
  .addFilterArg({
    name: 'geoDistance',
    type: `input GeoDistance {
      lng: Float!
      lat: Float!
      # Distance in meters
      distance: Float!
    }`,
    description: 'Search by distance in meters',
    query: (rawQuery, value, resolveParams) => {
      if (!value.lng || !value.lat || !value.distance) return
      // read more https://docs.mongodb.com/manual/tutorial/query-a-2dsphere-index/
      rawQuery['address.geo'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [value.lng, value.lat],
          },
          $maxDistance: value.distance // <distance in meters>
        }
      }
    },
  })
  // /* FOR DEBUG */
  // .wrapResolve((next) => (rp) => {
  //   const res = next(rp)
  //   console.log(rp)
  //   return res
  // })
)

// Here's how to restrict access only for logged in users.
UserTC.extendField('contacts', {
  description: 'May see only admins',
  resolve: (source, args, context) => (context.user ? source.contacts : null),
})

module.exports = { User, UserTC }
