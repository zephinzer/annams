const uuid = require('uuid/v4');

module.exports = (tracer = null) => (req, res, next) => {
  if (tracer !== null && tracer.context) {
    req.headers.id = tracer.context().traceId;
  } else {
    req.headers.id = uuid();
  }
  next();
};
