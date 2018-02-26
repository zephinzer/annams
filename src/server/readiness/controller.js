const mysql = require('mysql2');
const redis = require('redis');
const config = require('../../config')();
module.exports = {
  status: {
    database: null,
    cache: null,
  },
  error: {
    database: null,
    cache: null,
  },
  getStatus,
};

function getStatus() {
  return Promise.all([
    new Promise((resolve, reject) => {
      const connectionTest = redis.createClient({
        host: config.cache.host,
        port: config.cache.port,
      })
      connectionTest.on('error', (err) => {
        module.exports.status.cache = false;
        module.exports.error.cache = err;
        connectionTest.quit();
        connectionTest.unref();
        reject(err);
      }).on('connect', () => {
        module.exports.status.cache = true;
        module.exports.error.cache = false;
        connectionTest.quit();
        connectionTest.unref();
        resolve();
      })
    }),
    new Promise((resolve, reject) => {
      const connectionTest = mysql.createConnection({
        host: config.database.host,
        port: config.database.port,
        user: config.database.auth.username,
        password: config.database.auth.password,
        database: config.database.name,
      });
      connectionTest.execute('SELECT 1+1;', (err, res, fields) => {
        module.exports.status.database = (err == null);
        module.exports.error.database = err ? err : false;
        connectionTest.close();
        (err) && reject(err) || resolve();
      });
    }),
  ].map(
    (promise) => promise.then(() => true).catch(err => err)
  )).then((res) => res.reduce((prev, curr) => prev && (curr === true), true));
};
