module.exports.buildMongooseSchema = (baseSchema, config) => Object.assign(baseSchema, config ? config.extendSchema || {} : {});
