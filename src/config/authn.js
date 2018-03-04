const utility = require('./utility');

const DEFAULT_HEALTHCHECK_USERNAME = null;
const DEFAULT_HEALTHCHECK_PASSWORD = null;
const DEFAULT_METRICS_USERNAME = null;
const DEFAULT_METRICS_PASSWORD = null;
const DEFAULT_JWT_KEY_PRIVATE = null;
const DEFAULT_JWT_KEY_PUBLIC = null;

module.exports = () => ({
  healthcheck: {
    username: utility.nullableFromEnv('AUTHN_HEALTHCHECK_USERNAME', DEFAULT_HEALTHCHECK_USERNAME), // eslint-disable-line max-len
    password: utility.nullableFromEnv('AUTHN_HEALTHCHECK_PASSWORD', DEFAULT_HEALTHCHECK_PASSWORD), // eslint-disable-line max-len
  },
  metrics: {
    username: utility.nullableFromEnv('AUTHN_METRICS_USERNAME', DEFAULT_METRICS_USERNAME), // eslint-disable-line max-len
    password: utility.nullableFromEnv('AUTHN_METRICS_PASSWORD', DEFAULT_METRICS_PASSWORD), // eslint-disable-line max-len
  },
  jwt: {
    key: {
      private: utility.nullableFromEnv('AUTHN_JWT_KEY_PRIVATE', DEFAULT_JWT_KEY_PRIVATE), // eslint-disable-line max-len
      public: utility.nullableFromEnv('AUTHN_JWT_KEY_PUBLIC', DEFAULT_JWT_KEY_PUBLIC), // eslint-disable-line max-len
    },
  },
});

utility.reportStatus('AUTHN_HEALTHCHECK_USERNAME', module.exports().healthcheck.username); // eslint-disable-line max-len
utility.reportStatus('AUTHN_HEALTHCHECK_PASSWORD', module.exports().healthcheck.password, true); // eslint-disable-line max-len
utility.reportStatus('AUTHN_METRICS_USERNAME', module.exports().metrics.username); // eslint-disable-line max-len
utility.reportStatus('AUTHN_METRICS_PASSWORD', module.exports().metrics.password, true); // eslint-disable-line max-len
utility.reportStatus('AUTHN_JWT_KEY_PRIVATE', module.exports().jwt.key.private, true); // eslint-disable-line max-len
utility.reportStatus('AUTHN_JWT_KEY_PUBLIC', module.exports().jwt.key.public, true); // eslint-disable-line max-len
