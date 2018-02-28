try {
  require('dotenv').config();
} catch (ex) {}

const config = require('./config')();
const server = require('./server');
require('./metrics')();
require('./logging').initializeApplication();
require('./grace')();

server.start({
  port: config.server.port,
  bindAddress: config.server.bind.address,
  addrInUseTTL: config.error.addrinuse.ttl,
  addrInUseInterval: config.error.addrinuse.interval,
});
