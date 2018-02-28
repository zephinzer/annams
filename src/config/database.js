const crypto = require('crypto');

const DEFAULT_AUTH_USERNAME = 'annams_user';
const DEFAULT_AUTH_PASSWORD = 'annams_password';
const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_NAME = 'annams';
const DEFAULT_PORT = '3306';

module.exports = {
  auth: {
    username: process.env.DATABASE_AUTH_USERNAME || DEFAULT_AUTH_USERNAME,
    password: process.env.DATABASE_AUTH_PASSWORD || DEFAULT_AUTH_PASSWORD,
  },
  host: process.env.DATABASE_HOST || DEFAULT_HOST,
  name: process.env.DATABASE_NAME || DEFAULT_NAME,
  port: process.env.DATABASE_PORT || DEFAULT_PORT,
};

const generateMD5Hash = (data) =>
  crypto.createHash('md5').update(data).digest('hex');
const databaseAuthUsernameFromEnvironmentHash =
  generateMD5Hash(process.env.DATABASE_AUTH_USERNAME || '');
const databaseAuthUsernameHash =
  generateMD5Hash(module.exports.auth.username || '');
const databaseAuthPasswordFromEnvironmentHash =
  generateMD5Hash(process.env.DATABASE_AUTH_PASSWORD || '');
const databaseAuthPasswordHash =
  generateMD5Hash(module.exports.auth.password || '');
console.info(`DATABASE_AUTH_USERNAME: "md5:${databaseAuthUsernameFromEnvironmentHash}" (= "md5:${databaseAuthUsernameHash}")`); // eslint-disable-line max-len
console.info(`DATABASE_AUTH_PASSWORD: "md5:${databaseAuthPasswordFromEnvironmentHash}" (= "md5:${databaseAuthPasswordHash}")`); // eslint-disable-line max-len
console.info(`DATABASE_HOST: "${process.env.DATABASE_HOST}" (= "${module.exports.host}")`); // eslint-disable-line max-len
console.info(`DATABASE_NAME: "${process.env.DATABASE_NAME}" (= "${module.exports.name}")`); // eslint-disable-line max-len
console.info(`DATABASE_PORT: "${process.env.DATABASE_PORT}" (= "${module.exports.port}")`); // eslint-disable-line max-len
