const utility = require('./utility');

const DEFAULT_AUTH_USERNAME = 'annams_user';
const DEFAULT_AUTH_PASSWORD = 'annams_password';
const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_NAME = 'annams';
const DEFAULT_PORT = '3306';

module.exports = () => ({
  auth: {
    username: utility.stringFromEnv('DATABASE_AUTH_USERNAME', DEFAULT_AUTH_USERNAME), // eslint-disable-line max-len
    password: utility.stringFromEnv('DATABASE_AUTH_PASSWORD', DEFAULT_AUTH_PASSWORD), // eslint-disable-line max-len
  },
  host: utility.stringFromEnv('DATABASE_HOST', DEFAULT_HOST),
  name: utility.stringFromEnv('DATABASE_NAME', DEFAULT_NAME),
  port: utility.stringFromEnv('DATABASE_PORT', DEFAULT_PORT),
});

utility.reportStatus('DATABASE_AUTH_USERNAME', module.exports().auth.username, true); // eslint-disable-line max-len
utility.reportStatus('DATABASE_AUTH_PASSWORD', module.exports().auth.password, true); // eslint-disable-line max-len
utility.reportStatus('DATABASE_HOST', module.exports().host); // eslint-disable-line max-len
utility.reportStatus('DATABASE_NAME', module.exports().name); // eslint-disable-line max-len
utility.reportStatus('DATABASE_PORT', module.exports().port); // eslint-disable-line max-len
