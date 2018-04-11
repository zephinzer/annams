const express = require('express');
const compression = require('compression');

const liveness = require('./liveness');
const logger = require('./logger');
const metrics = require('./metrics');
const readiness = require('./readiness');
const security = require('./security');
const tracer = require('./tracer');
const utility = require('./utility');

module.exports = server;

/**
 * Creates a server instance for accessing the API
 * @param {Boolean} asMiddleware?
 * @return {Object}
 */
function server(asMiddleware = false) {
  if (server.instance === null) {
    const app = asMiddleware ? new express.Router() : express();
    security.connect(app);
    app.use(tracer());
    app.use(logger.requestId(tracer));
    app.use(logger.incoming());
    app.use(logger.outgoing());
    if (!asMiddleware) {
      app.use(metrics.collector());
      app.use(metrics.route());
    }
    app.use(compression());
    app.use(utility.cors());
    app.use(readiness());
    app.use(liveness());
    app.get('/', (req, res) => res
      .type('application/json')
      .status(200)
      .json('ok'));
    server.instance = app;
  }
  return server.instance;
};

server.instance = null;

server.start = (
  {
    port, bindAddress, addrInUseTTL, addrInUseInterval,
  },
  addressInUseErrorCounter = 0
) => {
  (server.instance === null) && server();
  server.instance.listen(port, bindAddress, (err) => {
    if (!err) {
      console.info(`Server listening on port ${port} > http://${bindAddress}:${port}`);
    }
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      if (addressInUseErrorCounter++ < addrInUseTTL) {
        console.error(`Port ${port} is in use. Retrying in ${addrInUseInterval}ms... (${addressInUseErrorCounter}/${addrInUseTTL} tries)`); // eslint-disable-line max-len
        server();
        setTimeout(
          server.start.bind(
            null,
            {
              port,
              bindAddress,
              addrInUseTTL,
              addrInUseInterval,
            },
            addressInUseErrorCounter
          ),
          addrInUseInterval
        );
      } else {
        console.error(`Port ${port} is still in use. Exiting with status code 1.`); // eslint-disable-line max-len
        process.exit(1);
      }
    } else {
      console.error(err.stack);
      throw new Error(err);
    }
  });
};
