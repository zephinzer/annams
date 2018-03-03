const express = require('express');

const config = require('../../config')();

const collector = require('./collector');
const utility = require('../utility');

module.exports = metricsRouteHandler;

/**
 * Factory method that generates a route handler for the Prometheus metrics.
 *
 * @param {String} [options.endpointPath]
 * @param {String} [options.basicAuthUsername]
 * @param {String} [options.basicAuthPassword]
 * @param {Object} [options]
 *
 * @return {express.Router}
 */
function metricsRouteHandler({
    endpointPath = config.endpoint.metrics,
    basicAuthUsername = config.authn.metrics.username,
    basicAuthPassword = config.authn.metrics.password,
} = {}) {
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
