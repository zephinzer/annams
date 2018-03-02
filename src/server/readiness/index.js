const express = require('express');

const config = require('../../config')();

const readiness = require('./controller');
const utility = require('../utility');

module.exports = readinessRouteHandler;

/**
 * @param {String} endpointPath
 * @param {String} options.basicAuthUsername
 * @param {String} options.basicAuthPassword
 * @param {Object} options
 *
 * @return {express.Router}
 */
function readinessRouteHandler(
  endpointPath,
  {
    basicAuthUsername = config.authn.healthcheck.username,
    basicAuthPassword = config.authn.healthcheck.password,
  }
) {
  const readinessRoute = new express.Router();
  readinessRoute.get(
    endpointPath,
    utility.basicAuth(basicAuthUsername, basicAuthPassword),
    async (req, res) => {
      const status = await readiness.getStatus();
      (!status) && console.error(readiness.error);
      res
        .type('application/json')
        .status(status ? 200 : 503)
        .json(status ? 'ok' : {
          database: readiness.status.database,
          cache: readiness.status.cache,
        });
    }
  );
  return readinessRoute;
};
