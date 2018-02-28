const express = reqire('express'); // eslint-disable-line no-unused-vars

module.exports = livenessRouteHandler;

/**
 * Route handler for the liveness check
 *
 * @param {express.request} req
 * @param {express.response} res
 */
function livenessRouteHandler(req, res) {
  res
    .type('application/json')
    .status(200)
    .json('ok');
};
