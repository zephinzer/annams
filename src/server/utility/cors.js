const cors = require('cors');

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
  const config = require('../../config')();
  const allowedHosts = config.server.cors.allowed.hosts;
  const corsOptions = (allowedHosts.length > 0) ? {
    origin: (origin, callback) => {
      if (
        (allowedHosts.indexOf(origin) !== -1)
        || (origin === undefined)
      ) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} is not allowed.`));
    },
  } : undefined;
  corsMiddleware.corsHandler =
    cors(corsOptions);
};
