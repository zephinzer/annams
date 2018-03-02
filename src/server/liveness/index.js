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
    basicAuthUsername = config.authn.healthcheck.username,
    basicAuthPassword = config.authn.healthcheck.password,
  }
) {
  const livenessRoute = new express.Router();
  livenessRoute.get(
    endpointPath,
    utility.basicAuth(basicAuthUsername, basicAuthPassword),
    (req, res) => {
      res
        .type('application/json')
        .status(200)
        .json('ok');
    }
  );
  return livenessRoute;
};
