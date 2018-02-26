const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const config = require('../config')();
const utility = require('./utility');
const metrics = require('./metrics');

module.exports = server;

/**
 * Creates a server instance for accessing the API
 */
function server() {
  if (server.instance === null) {
    server.instance = express();
    server.instance.use(helmet());
    server.instance.use(compression());
    server.instance.use(cors());
    server.instance.use(metrics.getController());
    server.instance.get(config.endpoint.ready, utility.getAuth(), require('./readiness').getRoute());
    server.instance.get(config.endpoint.live, utility.getAuth(), require('./liveness').getRoute());
    server.instance.get(config.endpoint.metrics, metrics.getRoute());
    server.instance.get('/', (req, res) => res
      .type('application/json')
      .status(200)
      .json('ok'));
  }
  return server.instance;
};

server.instance = null;

server.start = ({port, bindAddress, addrInUseTTL, addrInUseInterval}, addressInUseErrorCounter = 0) => {
  (server.instance === null) && server();
  server.instance.listen(port, bindAddress, (err) => {
    if (!err) {
      console.info(`Server listening on port ${port} > http://${bindAddress}:${port}`);
    } 
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      if (addressInUseErrorCounter++ < addrInUseTTL) {
        console.error(`Port ${port} is in use. Retrying in ${addrInUseInterval}ms... (${addressInUseErrorCounter}/${addrInUseTTL} tries)`);
        server();
        setTimeout(
          server.start.bind(
            null,
            {
              port,
              bindAddress,
              addrInUseTTL,
              addrInUseInterval
            },
            addressInUseErrorCounter
          ),
          addrInUseInterval
        );
      } else {
        console.error(`Port ${port} is still in use. Exiting with status code 1.`);
        process.exit(1);
      }
    } else {
      console.error(err.stack);
      throw new Error(err);
    }
  });
};
