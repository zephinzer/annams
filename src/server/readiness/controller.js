const mysql = require('mysql2');
const redis = require('redis');
const config = require('../../config')();

module.exports = {
  status: {
    database: null,
    cache: null,
    pushGateway: null,
  },
  error: {
    database: null,
    cache: null,
  },
  warning: {
    pushGateway: null,
  },
  getStatus,
  getRedisStatus,
  getMySqlStatus,
  getPrometheusPushGatewayStatus,
};

/**
 * Gets the connection status of the Redis cache.
 *
 * Rejects with a data structure of:
 * {
 *  level : String [='error'],
 *  data : Object,
 * }
 * if a connection to the cache cannot be resolved.
 *
 * Resolves with no arguments if the connection is successful.
 *
 * @return {Promise}
 */
function getRedisStatus() {
  return new Promise((resolve, reject) => {
    const connectionTest = redis.createClient({
      host: config.cache.host,
      port: config.cache.port,
    });
    connectionTest.on('error', (err) => {
      module.exports.status.cache = false;
      module.exports.error.cache = err;
      connectionTest.quit();
      connectionTest.unref();
      reject({
        level: 'error',
        data: err,
      });
    }).on('connect', () => {
      module.exports.status.cache = true;
      module.exports.error.cache = false;
      connectionTest.quit();
      connectionTest.unref();
      resolve();
    });
  });
};

/**
 * Resolves the status of the MySQL database.
 *
 * Rejects with a data structure of:
 * {
 *  level : String [='error'],
 *  data : Object,
 * }
 * if a connection to the database cannot be resolved.
 *
 * Resolves with no arguments if the connection is successful.
 *
 * @return {Promise}
 */
function getMySqlStatus() {
  return new Promise((resolve, reject) => {
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
      (err) && reject({
        level: 'error',
        data: err,
      }) || resolve();
    });
  });
};

/**
 * Resolves the status of the Prometheus metrics system.
 *
 * Rejects with a data structure of:
 * {
 *  level : String [='warning'],
 *  data : Object,
 * }
 * if a connection to the push gateway cannot be resolved.
 *
 * Resolves with no arguments if the connection has been made.
 *
 * @return {Promise}
 */
function getPrometheusPushGatewayStatus() {
  return new Promise((resolve, reject) => {
    const metrics = require('../../metrics');
    module.exports.status.pushGateway = (metrics.error.pushGateway == null);
    module.exports.warning.pushGateway = metrics.error.pushGateway ?
      metrics.error.pushGateway : false;
    (err) && reject({
      level: 'warning',
      data: metrics.error.pushGateway,
    }) || resolve();
  });
};

/**
 * Retrieves the status of various third party services and resolves to `true`
 * if all services are working and can be connected to.
 *
 * Resolves to `false` otherwise.
 *
 * @return {Promise} that always resolves to a {Boolean}
 */
function getStatus() {
  let statusMap = [
    getRedisStatus(),
    getMySqlStatus(),
  ];
  if (config.environment === 'development') {
    statusMap.push(getPrometheusPushGatewayStatus());
  }
  return Promise.all(statusMap.map(
    (promise) => promise.then(() => true).catch((err) => {
      return (err.level === 'error') ? err.data : true;
    })
  )).then((res) => res.reduce((prev, curr) => prev && (curr === true), true));
};
