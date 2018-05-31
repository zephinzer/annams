const express = require('express'); // eslint-disable-line no-unused-vars

module.exports = serverError;

/**
 * @param {String} [options.endpointPath]
 * @param {String} [options.basicAuthUsername]
 * @param {String} [options.basicAuthPassword]
 * @param {Object} [options]
 *
 * @return {Object} serverErrors
 * @return {Function} serverErrors.notFound
 * @return {Function} serverErrors.serverError
 */
function serverError() {
  if (serverError.instance === null) {
    serverError.instance = {
      notFound: notFoundHandler,
      serverError: serverErrorHandler,
    };
  }
  return serverError.instance;
};

serverError.instance = null;
serverError.generateErrorResponse = (code, message, requestId) => {
  const timestamp = (new Date()).getTime();
  console.error(`${code} @ ${timestamp} - ${message}`);
  return {
    requestId,
    code,
    message,
    timestamp,
  };
};

serverError.trigger = {
  badRequest: (message) => {
    const error = new Error(
      message ?
        `Bad request : ${message}`
        : `Bad request`
    );
    error.code = 'ERROR_BAD_REQUEST';
    error.status = 400;
    throw error;
  },
};

/**
 * An Express.js compatible middleware for handling requests
 * whose paths were not registered.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
function notFoundHandler(req, res, next) {
  const code = 'ERROR_ROUTE_NOT_FOUND';
  const message =
    `The requested route (${req.method} ${req.path}) could not be found.`;
  const status = 404;
  next({code, message, status});
};

/**
 * An Express.js compatible middleware for handling server errors.
 *
 * @param {Error|*} err - error object
 * @param {String} [err.code='ERROR_GENERIC'] - error code in string
 * @param {String} [err.message='unknown'] - message to be returned to user
 * @param {Number} [err.status=500] - HTTP status code to be returned
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {Function} next
 */
function serverErrorHandler(err, req, res, next) {
  if (err && typeof err.stack !== 'undefined') {
    console.error(req.id, '|', err.stack);
  }
  const status = (err && typeof err.status === 'number')
    ? err.status : 500;
  const code = (err && typeof err.code === 'string')
    ? err.code : 'ERROR_GENERIC';
  const message = (err && typeof err.message === 'string')
    ? err.message : 'An unknown error occurred.';
  const requestId = (req && typeof req.id === 'string')
    ? req.id : '---';
  const errorResponseObject =
    serverError.generateErrorResponse(code, message, requestId);
  res.status(status).json(errorResponseObject);
};
