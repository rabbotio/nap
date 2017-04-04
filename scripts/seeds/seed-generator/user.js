const _ = require('lodash');

const { writeSeed, casual, profile } = require('../helpers');

const sequential = require('promise-sequential');

module.exports = async function generate() {
  return sequential(_.range(20).map(() => async () => ({
    _id: casual.objectId,
    name: casual.name,
    profilePicture: await profile(),
    bookmarks: [],
  })))
  .then(users => writeSeed('user', users));
}
