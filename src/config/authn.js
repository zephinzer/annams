const crypto = require('crypto');

const DEFAULT_HEALTHCHECK_USERNAME = null;
const DEFAULT_HEALTHCHECK_PASSWORD = null;
const DEFAULT_METRICS_USERNAME = null;
const DEFAULT_METRICS_PASSWORD = null;
const DEFAULT_JWT_KEY_PRIVATE = null;
const DEFAULT_JWT_KEY_PUBLIC = null;

module.exports = () => ({
  healthcheck: {
    username: process.env.AUTHN_HEALTHCHECK_USERNAME ?
      process.env.AUTHN_HEALTHCHECK_USERNAME : DEFAULT_HEALTHCHECK_USERNAME,
    password: process.env.AUTHN_HEALTHCHECK_PASSWORD ?
      process.env.AUTHN_HEALTHCHECK_PASSWORD : DEFAULT_HEALTHCHECK_PASSWORD,
  },
  metrics: {
    username: process.env.AUTHN_METRICS_USERNAME ?
      process.env.AUTHN_METRICS_USERNAME : DEFAULT_METRICS_USERNAME,
    password: process.env.AUTHN_METRICS_PASSWORD ?
      process.env.AUTHN_METRICS_PASSWORD : DEFAULT_METRICS_PASSWORD,
  },
  jwt: {
    key: {
      private: process.env.AUTHN_JWT_KEY_PRIVATE ?
        process.env.AUTHN_JWT_KEY_PRIVATE : DEFAULT_JWT_KEY_PRIVATE,
      public: process.env.AUTHN_JWT_KEY_PUBLIC ?
        process.env.AUTHN_JWT_KEY_PUBLIC : DEFAULT_JWT_KEY_PUBLIC,
    },
  },
});

const generateMD5Hash = (data) =>
  crypto.createHash('md5').update(data).digest('hex');
const healthcheckPasswordFromEnvironmentHash =
  generateMD5Hash(process.env.AUTHN_HEALTHCHECK_PASSWORD || '');
const healthcheckPasswordHash =
  generateMD5Hash(module.exports().healthcheck.password || '');
const metricsPasswordFromEnvironmentHash =
  generateMD5Hash(process.env.AUTHN_METRICS_PASSWORD || '');
const metricsPasswordHash =
  generateMD5Hash(module.exports().metrics.password || '');
console.info(`AUTHN_HEALTHCHECK_USERNAME: "${process.env.AUTHN_HEALTHCHECK_USERNAME}" (= "${module.exports().healthcheck.username}")`); // eslint-disable-line max-len
console.info(`AUTHN_HEALTHCHECK_PASSWORD: "md5:${healthcheckPasswordFromEnvironmentHash}" (= "md5:${healthcheckPasswordHash}")`); // eslint-disable-line max-len
console.info(`AUTHN_METRICS_USERNAME: "${process.env.AUTHN_METRICS_USERNAME}" (= "${module.exports().healthcheck.username}")`); // eslint-disable-line max-len
console.info(`AUTHN_METRICS_PASSWORD: "md5:${metricsPasswordFromEnvironmentHash}" (= "md5:${metricsPasswordHash}")`); // eslint-disable-line max-len
console.info(`AUTHN_JWT_KEY_PRIVATE: "${process.env.AUTHN_JWT_KEY_PRIVATE}" (= "${module.exports().jwt.key.private}")`); // eslint-disable-line max-len
console.info(`AUTHN_JWT_KEY_PUBLIC: "${process.env.AUTHN_JWT_KEY_PUBLIC}" (= "${module.exports().jwt.key.public}")`); // eslint-disable-line max-len
