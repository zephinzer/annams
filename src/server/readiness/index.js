const express = require('express');

const config = require('../../config')();

const readiness = require('./controller');
const utility = require('../utility');

module.exports = readinessRouteHandler;

/**
 * Factory function for an express.Router that handles the readiness check.
 *
 * @param {String} options.endpointPath
 * @param {String} options.basicAuthUsername
 * @param {String} options.basicAuthPassword
 * @param {Object} options
 *
 * @return {express.Router}
 */
function readinessRouteHandler({
  endpointPath = config.endpoint.ready,
  basicAuthUsername = config.authn.healthcheck.username,
  basicAuthPassword = config.authn.healthcheck.password,
} = {}) {
  const readinessRoute = new express.Router();
  readinessRoute.get(
    endpointPath,
    utility.basicAuth(basicAuthUsername, basicAuthPassword),
    async (req, res) => {
      const status = await readiness.getStatus();
      (!status) && console.error(readiness.error);
      const alerts = Object.keys(readiness.warning).reduce((prev, curr) => {
        return Object.assign(prev, {[curr]: readiness.warning[curr]});
      }, {});
      res
        .type('application/json')
        .status(status ? 200 : 503)
        .json(status ? (alerts ? alerts :'ok') : {
          database: {
            status: readiness.status.database,
            data: readiness.error.database,
          },
          cache: {
            status: readiness.status.cache,
            data: readiness.error.cache,
          },
          pushGateway: {
            status: readiness.status.pushGateway,
            data: readiness.warning.pushGateway,
          },
        });
    }
  );
  return readinessRoute;
};
