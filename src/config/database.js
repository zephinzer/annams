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

const databaseAuthUsernameFromEnvironmentHash = require('crypto').createHash('md5').update(process.env.DATABASE_AUTH_USERNAME || '').digest("hex");
const databaseAuthUsernameHash = require('crypto').createHash('md5').update(module.exports.auth.username || '').digest("hex");
const databaseAuthPasswordFromEnvironmentHash = require('crypto').createHash('md5').update(process.env.DATABASE_AUTH_PASSWORD || '').digest("hex");
const databaseAuthPasswordHash = require('crypto').createHash('md5').update(module.exports.auth.password || '').digest("hex");
console.info(`DATABASE_AUTH_USERNAME: "md5:${databaseAuthUsernameFromEnvironmentHash}" (= "md5:${databaseAuthUsernameHash}")`);
console.info(`DATABASE_AUTH_PASSWORD: "md5:${databaseAuthPasswordFromEnvironmentHash}" (= "md5:${databaseAuthPasswordHash}")`);
console.info(`DATABASE_HOST: "${process.env.DATABASE_HOST}" (= "${module.exports.host}")`);
console.info(`DATABASE_NAME: "${process.env.DATABASE_NAME}" (= "${module.exports.name}")`);
console.info(`DATABASE_PORT: "${process.env.DATABASE_PORT}" (= "${module.exports.port}")`);