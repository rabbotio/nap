const result = {};
let startGet = false;

const getModel = (name) => {
  startGet = true;
  if (result[name]) {
    return result[name];
  }
  result[name] = require(`./${name}`)();
  return result[name];
}

module.exports = () => {
  return Object.assign(
   getModel('User'),
   getModel('Installation'),
   getModel('Authen'),
   getModel('Error')
  );
};

module.exports.extendModel = (name, schema) => {
  if (result[name]) {
    throw new Error(`duplicate extendModel ${name}`);
  }
  if (startGet) {
    throw new Error(`extendModel cant call after start geting model`);
  }
  result[name] = require(`./${name}`)({
    extendSchema: schema,
  });
  return result[name];
}

module.exports.getModel = getModel;