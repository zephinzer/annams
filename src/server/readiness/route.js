const express = require('express');

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
    basicAuthUsername = null,
    basicAuthPassword = null,
  }
) {
  const readinessRoute = new express.Router();
  readinessRoute.get(
    endpointPath,
    (basicAuthUsername === null || basicAuthPassword === null) ?
      (req, res, next) => next()
      : utility.getAuth(basicAuthUsername, basicAuthPassword),
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
