const uuid = require('uuid/v4');

module.exports = requestIdLogger;

/**
 * Returns an Express middleware that adds a UUID to every
 * request if not already found.
 *
 * @param {Object} tracer
 *
 * @return {Function}
 */
function requestIdLogger(tracer = null) {
  return (req, res, next) => {
    if (tracer !== null && tracer.context) {
      req.headers.id = tracer.context().traceId;
    } else {
      req.headers.id = uuid();
    }
    next();
  };
};
