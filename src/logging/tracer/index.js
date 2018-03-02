const {
  BatchRecorder,
  ConsoleRecorder,
  ExplicitContext,
  jsonEncoder,
  Tracer,
} = require('zipkin');
const {HttpLogger} = require('zipkin-transport-http');
const zipkinMiddleware =
  require('zipkin-instrumentation-express').expressMiddleware;

module.exports = ((
  localServiceName,
  useHttpRecorder = false
) => {
  const ctxImpl = new ExplicitContext();
  const recorder = (useHttpRecorder) ?
    new BatchRecorder({
      logger: new HttpLogger({
        endpoint: 'http://localhost:9411/api/v2/spans',
        jsonEncoder: jsonEncoder.JSON_V2,
      }),
    }) : new ConsoleRecorder(console.trace);
  return zipkinMiddleware({
    tracer: new Tracer({
      ctxImpl,
      recorder,
      localServiceName,
    }),
  });
});
