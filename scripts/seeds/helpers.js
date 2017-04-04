require('dotenv/config');
const casual = require('casual');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

require('./casual-config');

const url = process.env.URL_FOR_SEED;

function urlToImageObj(fromUrl) {
  return {
    id: null,
    secure_url: fromUrl,
    url: fromUrl,
    public_id: null,
    width: 100,
    height: 100,
  };
}

function loadSeed(type) {
  try {
    const data = fs.readFileSync(path.resolve(__dirname, 'data', `${type}.json`));
    return JSON.parse(data);
  } catch (error) {
    throw new Error(`cant load seed on type ${type}`);
  }
}

module.exports.loadSeed = loadSeed;

module.exports.loadSeedId = function loadSeedId(type) {
  return loadSeed(type).map(obj => obj._id);
}

module.exports.profile = async () => {
  return urlToImageObj(`${url}${await casual.profilePicture}`);
};

module.exports.preview = async () => {
  const uri = await casual.clog_preview;
  if (!uri) {
    return null;
  }
  return urlToImageObj(`${url}${uri}`);
};

module.exports.cover = async () => {
  const uri = await casual.clog_cover;
  if (!uri) {
    return null;
  }
  return urlToImageObj(`${url}${uri}`);
};

module.exports.genArray = function genArray(array, maxSize) {
  return _.uniqWith(_.range(casual.integer(0, maxSize)).map(() => array[casual.integer(0, array.length - 1)]));
}

module.exports.genFixArray = function genFixArray(array, size) {
  return _.uniqWith(_.range(size).map(() => array[casual.integer(0, array.length - 1)]));
}

module.exports.writeSeed = function writeSeed(fileName, json) {
  fs.writeFileSync(path.resolve(__dirname, 'data', `${fileName}.json`), JSON.stringify(json, null, 2));
}

module.exports.casual = casual;
