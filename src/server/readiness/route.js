const express = require('express'); // eslint-disable-line no-unused-vars

const readiness = require('./controller');

/**
 * Route handler for the liveness check
 *
 * @param {express.request} req
 * @param {express.response} res
 */
async function readinessRouteHandler(req, res) {
  const status = await readiness.getStatus();
  (!status) && console.error(readiness.error);
  res
    .type('application/json')
    .status(status ? 200 : 503)
    .json(status ? 'ok' : {
      database: readiness.status.database,
      cache: readiness.status.cache,
    });
};

module.exports = readinessRouteHandler;
