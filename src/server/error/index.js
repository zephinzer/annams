const express = require('express'); // eslint-disable-line no-unused-vars

module.exports = errorHandler;

/**
 * @param {String} [options.endpointPath]
 * @param {String} [options.basicAuthUsername]
 * @param {String} [options.basicAuthPassword]
 * @param {Object} [options]
 *
 * @return {Object} errorHandlers
 * @return {Function} errorHandlers.notFound
 * @return {Function} errorHandlers.serverError
 */
function errorHandler() {
  if (errorHandler.instance === null) {
    errorHandler.instance = {
      notFound: notFoundHandler,
      serverError: serverErrorHandler,
    };
  }
  return errorHandler.instance;
};

errorHandler.instance = null;
errorHandler.generateErrorResponse = (code, message) => ({
  code,
  message,
  timestamp: (new Date()).getTime(),
});

/**
 * An Express.js compatible middleware for handling requests
 * whose paths were not registered.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
function notFoundHandler(req, res, next) {
  res.status(404).json(
    errorHandler.generateErrorResponse(
      'ERROR_NOT_FOUND', 'not found'
    )
  );
};

/**
 * An Express.js compatible middleware for handling server errors.
 *
 * @param {Error|*} err
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
function serverErrorHandler(err, req, res, next) {
  console.error(err);
  const code = (err && typeof err.code !== 'undefined')
    ? err.code : 'ERROR_GENERIC';
  const message = (err && typeof err.message === 'string')
    ? err.message : 'unknown';
  res.status(500).json(
    errorHandler.generateErrorResponse(
      code,
      message,
    )
  );
};
