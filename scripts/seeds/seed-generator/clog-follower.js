const { writeSeed, loadSeedId, genArray, casual } = require('../helpers');

module.exports = async function generate() {
  const userIds = loadSeedId('user');
  const clogIds = loadSeedId('clog');
  let result = [];
  for (let i = 0; i < clogIds.length; i += 1) {
    const clogId = clogIds[i];
    result = [...result, ...genArray(userIds, 1000).map(userId => ({
      _id: casual.objectId,
      userId,
      clogId,
    }))];
  }
  writeSeed('clog-follower', result);
}
