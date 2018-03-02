const express = require('express');

const collector = require('./collector');
const utility = require('../utility');

module.exports = metricsRouteHandler;

/**
 * @param {String} endpointPath
 * @param {String} options.basicAuthUsername
 * @param {String} options.basicAuthPassword
 * @param {Object} options
 *
 * @return {express.Router}
 */
function metricsRouteHandler(
  endpointPath,
  {
    basicAuthUsername,
    basicAuthPassword,
  }
) {
  const metricsRoute = new express.Router();
  metricsRoute.get(
    endpointPath,
    (basicAuthUsername === null || basicAuthPassword === null) ?
      (req, res, next) => next()
      : utility.getAuth(basicAuthUsername, basicAuthPassword),
    collector().metricsMiddleware
  );
  return metricsRoute;
};
