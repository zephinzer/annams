const mysql = require('mysql2');
const redis = require('redis');
const config = require('../../config')();

const readinessController = {
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

module.exports = readinessController;

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
    const connectionTest = getRedisStatus.getClient();
    connectionTest
      .on('error', getRedisStatus.getErrorHandler(connectionTest, reject))
      .on('connect', getRedisStatus.getSuccessHandler(connectionTest, resolve));
  });
};

getRedisStatus.options =
  () => ({
    host: config.cache.host,
    port: config.cache.port,
  });

getRedisStatus.getClient =
  () => (redis.createClient(getRedisStatus.options()));

getRedisStatus.getErrorHandler =
  (connectionTest, callback) => (
    (err) => {
      module.exports.status.cache = false;
      module.exports.error.cache = err;
      connectionTest.quit();
      connectionTest.unref();
      callback({
        level: 'error',
        data: err,
      });
    }
  );

getRedisStatus.getSuccessHandler =
  (connectionTest, callback) => (
    () => {
      module.exports.status.cache = true;
      module.exports.error.cache = false;
      connectionTest.quit();
      connectionTest.unref();
      callback();
    }
  );

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
    const connectionTest = getMySqlStatus.getClient();
    connectionTest.execute(
      getMySqlStatus.testCommand,
      getMySqlStatus.getHandler(connectionTest, resolve, reject)
    );
  });
};

getMySqlStatus.getClient =
  () => mysql.createConnection(getMySqlStatus.options());

getMySqlStatus.getHandler =
  (connectionTest, resolve, reject) => (
    (err, res, fields) => {
      module.exports.status.database = (!err);
      module.exports.error.database = err ? err : false;
      connectionTest.close();
      (err) && reject({
        level: 'error',
        data: err,
      }) || resolve();
    }
  );

getMySqlStatus.options =
  () => ({
    host: config.database.host,
    port: config.database.port,
    user: config.database.auth.username,
    password: config.database.auth.password,
    database: config.database.name,
  });

getMySqlStatus.testCommand = 'SELECT 1+1;';

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
    const metrics = getPrometheusPushGatewayStatus.getMetrics();
    const err = metrics.error.pushGateway;
    module.exports.status.pushGateway = (err == null);
    module.exports.warning.pushGateway = err ? err : false;
    (err) && reject({
      level: 'warning',
      data: metrics.error.pushGateway,
    }) || resolve();
  });
};

getPrometheusPushGatewayStatus.getMetrics = () => require('../../metrics');

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
    readinessController.getRedisStatus(),
    readinessController.getMySqlStatus(),
    readinessController.getPrometheusPushGatewayStatus(),
  ];
  return Promise.all(
    statusMap.map(
      (promise) =>
        promise
          .then(() => true)
          .catch((err) => (err.level === 'error') ? err.data : true)
  )).then((res) => res.reduce((prev, curr) => prev && (curr === true), true));
};
