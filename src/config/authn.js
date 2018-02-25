const DEFAULT_HEALTHCHECK_USERNAME = null;
const DEFAULT_HEALTHCHECK_PASSWORD = null;
const DEFAULT_JWT_KEY_PRIVATE = null;
const DEFAULT_JWT_KEY_PUBLIC = null;

module.exports = {
  healthcheck: {
    username: process.env.AUTHN_HEALTHCHECK_USERNAME ?
      process.env.AUTHN_HEALTHCHECK_USERNAME : DEFAULT_HEALTHCHECK_USERNAME,
    password: process.env.AUTHN_HEALTHCHECK_PASSWORD ?
      process.env.AUTHN_HEALTHCHECK_PASSWORD : DEFAULT_HEALTHCHECK_PASSWORD,
  },
  jwt: {
    key: {
      private: process.env.AUTHN_JWT_KEY_PRIVATE ?
        process.env.AUTHN_JWT_KEY_PRIVATE : DEFAULT_JWT_KEY_PRIVATE,
      public: process.env.AUTHN_JWT_KEY_PUBLIC ?
        process.env.AUTHN_JWT_KEY_PUBLIC : DEFAULT_JWT_KEY_PUBLIC,
    }
  }
};

const healthcheckPasswordFromEnvironmentHash = require('crypto').createHash('md5').update(process.env.AUTHN_HEALTHCHECK_PASSWORD || '').digest("hex");
const healthcheckPasswordHash = require('crypto').createHash('md5').update(module.exports.healthcheck.password || '').digest("hex");
console.info(`AUTHN_HEALTHCHECK_USERNAME: "${process.env.AUTHN_HEALTHCHECK_USERNAME}" (= "${module.exports.healthcheck.username}")`);
console.info(`AUTHN_HEALTHCHECK_PASSWORD: "md5:${healthcheckPasswordFromEnvironmentHash}" (= "md5:${healthcheckPasswordHash}")`);
console.info(`AUTHN_JWT_KEY_PRIVATE: "${process.env.AUTHN_JWT_KEY_PRIVATE}" (= "${module.exports.jwt.key.private}")`);
console.info(`AUTHN_JWT_KEY_PUBLIC: "${process.env.AUTHN_JWT_KEY_PUBLIC}" (= "${module.exports.jwt.key.public}")`);
