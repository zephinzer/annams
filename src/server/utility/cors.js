const cors = require('cors');

const config = require('../../config')();

module.exports = corsMiddleware;

/**
 * @return {Function}
 */
function corsMiddleware() {
  if (corsMiddleware.corsHandler === null) {
    corsMiddleware.initialize();
  }
  return corsMiddleware.corsHandler;
};

corsMiddleware.corsHandler = null;
corsMiddleware.initialize = initialize;
corsMiddleware.originIsValid = originIsValid;
corsMiddleware.createInvalidOriginError = createInvalidOriginError;

/**
 * Initializes the CORS middleware
 */
function initialize() {
  const allowedOrigins = config.server.cors.allowed.hosts;
  const corsOptions = (allowedOrigins.length > 0) ? {
    origin: (origin, callback) =>
      (originIsValid(origin, allowedOrigins)) ?
        callback(null, true) : callback(createInvalidOriginError(origin)),
  } : undefined;
  corsMiddleware.corsHandler = cors(corsOptions);
};

/**
 * Returns true if the provided :origin is part of the list of allowed hosts.
 * Returns false otherwise.
 *
 * @param {String} origin
 * @param {Array<String>} allowedOrigins
 *
 * @return {Boolean}
 */
function originIsValid(origin, allowedOrigins) {
  return (
    (allowedOrigins.indexOf(origin) !== -1)
      || (typeof origin === 'undefined')
  )
  && origin !== '';
};

/**
 * Returns an Error object with a standardised error message and status code.
 *
 * @param {String} erroredOrigin
 * @return {Error}
 */
function createInvalidOriginError(erroredOrigin) {
    const error =
      new Error(`Response from origin "${erroredOrigin}" was denied access.`);
    error.status = 401;
    error.stack = error.stack.split('\n')[0];
    return error;
};
