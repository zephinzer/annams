const express = require('express');

const utility = require('../utility');

module.exports = livenessRouteHandler;

/**
 * @param {String} endpointPath
 * @param {String} options.basicAuthUsername
 * @param {String} options.basicAuthPassword
 * @param {Object} options
 *
 * @return {express.Router}
 */
function livenessRouteHandler(
  endpointPath,
  {
    basicAuthUsername = null,
    basicAuthPassword = null,
  }
) {
  const livenessRoute = new express.Router();
  livenessRoute.get(
    endpointPath,
    (basicAuthUsername === null || basicAuthPassword === null) ?
      (req, res, next) => next()
      : utility.getAuth(
      config.authn.healthcheck.username,
      config.authn.healthcheck.password
    ),
    (req, res) => {
      res
        .type('application/json')
        .status(200)
        .json('ok');
    }
  );
  return livenessRoute;
};
