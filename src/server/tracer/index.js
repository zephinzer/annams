const express = require('express'); // eslint-disable-line no-unused-vars
const expressZipkinInstrumentation = require('express-zipkin-instrumentation');

const config = require('../../config')();

module.exports = tracer;

/**
 * Creates an instance of a Zipkin tracer middleware for use in Express.
 *
 * @return {Function} that is Express middleware compatible
 */
function tracer() {
  if (!tracer._instance) {
    tracer._instance = (config.server.tracing.zipkin.enabled) ?
      expressZipkinInstrumentation(
        config.service.name,
        config.server.tracing.zipkin.hostname,
        {
          serviceNamePostfix: config.environment,
        }
      ) : ((req, res, next) => next());
  }
  return tracer._instance;
};

tracer._instance = null;
tracer.getTraceId = expressZipkinInstrumentation.getTraceId;
