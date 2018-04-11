const uuid = require('uuid/v4');

module.exports = requestIdLogger;

/**
 * Returns an Express middleware that adds a UUID to every request if not
 * already found. The provided :tracer should implement a getTraceId()
 * method that returns a trace. When :tracer argument is not provided, a
 * UUID is generated.
 *
 * @param {Function} tracer.traceId
 * @param {Object} [tracer={}]
 *
 * @return {Function}
 */
function requestIdLogger(tracer = {}) {
  return (req, res, next) => {
    req.headers.id = (!tracer.getTraceId) ? uuid() : tracer.getTraceId();
    next();
  };
};
