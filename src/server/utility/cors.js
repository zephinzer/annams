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

/**
 * Initializes the CORS middleware
 */
function initialize() {
  const allowedHosts = config.server.cors.allowed.hosts;
  const corsOptions = (allowedHosts.length > 0) ? {
    origin: (origin, callback) => {
      if (
        (
          (allowedHosts.indexOf(origin) !== -1)
            || (typeof origin === 'undefined')
        )
        && origin !== ''
      ) {
        return callback(null, true);
      }
      const error =
        new Error(`Response from origin "${origin}" was denied access.`);
      error.status = 401;
      error.stack = error.stack.split('\n')[0];
      return callback(error);
    },
  } : undefined;
  corsMiddleware.corsHandler =
    cors(corsOptions);
};
