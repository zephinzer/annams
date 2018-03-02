const {
  BatchRecorder,
  ConsoleRecorder,
  jsonEncoder,
  Tracer,
} = require('zipkin');
const CLSContext = require('zipkin-context-cls');
const {HttpLogger} = require('zipkin-transport-http');
const zipkinMiddleware =
  require('zipkin-instrumentation-express').expressMiddleware;

const config = require('../../config')();

module.exports = {
  _recorder: null,
  recorder: () => module.exports._recorder,
  _context: null,
  context: () => module.exports._context.getContext(),
  middleware: ((
    localServiceName,
  ) => {
    module.exports._context = new CLSContext(localServiceName);
    module.exports._recorder = (config.server.tracing.zipkin.use.http) ?
      new BatchRecorder({
        logger: new HttpLogger({
          endpoint:
            config.server.tracing.zipkin.hostname
              + config.server.tracing.zipkin.path,
          jsonEncoder: jsonEncoder.JSON_V2,
        }),
      }) : new ConsoleRecorder(console.trace);
    return zipkinMiddleware({
      tracer: new Tracer({
        ctxImpl: module.exports._context,
        recorder: module.exports._recorder,
        localServiceName,
      }),
      serviceName: localServiceName,
    });
  }),
};
