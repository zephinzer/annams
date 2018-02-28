try {
  require('dotenv').config();
} catch (ex) {}

const config = require('./config')();
const server = require('./server');
require('./metrics')();
require('./logging')();

const fatalErrorHandler = (ex) => {
  console.error(ex.stack);
  console.info(ex.message);
  process.exit(1);
};

process.on('uncaughtException', fatalErrorHandler);
process.on('unhandledRejection', fatalErrorHandler);

server.start({
  port: config.server.port,
  bindAddress: config.server.bind.address,
  addrInUseTTL: config.error.addrinuse.ttl,
  addrInUseInterval: config.error.addrinuse.interval,
});
