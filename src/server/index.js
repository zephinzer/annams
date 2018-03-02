const express = require('express');
const helmet = require('helmet');
const compression = require('compression');

const config = require('../config')();
const logging = require('../logging');
const utility = require('./utility');
const metrics = require('./metrics');

module.exports = server;

/**
 * Creates a server instance for accessing the API
 * @param {Boolean} asMiddleware?
 * @return {Object}
 */
function server(asMiddleware = false) {
  if (server.instance === null) {
    server.instance = asMiddleware ? new express.Router() : express();
    server.instance.disable('x-powered-by');
    server.instance.use(helmet.dnsPrefetchControl());
    server.instance.use(helmet.xssFilter());
    server.instance.use(helmet.noSniff());
    server.instance.use(helmet.noCache());
    server.instance.use(helmet.ieNoOpen());
    server.instance.use(helmet.hsts({maxAge: 60 * 60 * 24 * 60}));
    server.instance.use(helmet.frameguard({action: 'sameorigin'}));
    server.instance.use(logging.request.insertRequestUuid());
    server.instance.use(logging.request.getIncoming());
    server.instance.use(logging.request.getOutgoing());
    if (!asMiddleware) {
      server.instance.use(metrics.getController());
      server.instance.use(logging.tracer(
        'annams',
        config.server.tracing.zipkin.use.http
      ));
    }
    server.instance.use(compression());
    server.instance.use(utility.getCors());
    server.instance.use(require('./readiness').getRoute(
      config.endpoint.ready, {
      basicAuthUsername: config.authn.healthcheck.username,
      basicAuthPassword: config.authn.healthcheck.password,
    }));
    server.instance.use(require('./liveness').getRoute(
      config.endpoint.live, {
        basicAuthUsername: config.authn.healthcheck.username,
        basicAuthPassword: config.authn.healthcheck.password,
      }));
    server.instance.use(metrics.getRoute(
      config.endpoint.metrics, {
        basicAuthUsername: config.authn.metrics.username,
        basicAuthPassword: config.authn.metrics.password,
      }));
    server.instance.get('/', (req, res) => res
      .type('application/json')
      .status(200)
      .json('ok'));
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
