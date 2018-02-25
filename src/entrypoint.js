try { // should only succeed in development
  require('dotenv').config();
} catch (ex) { }

const config = require('./config')();
const logging = require('./logging')();
const server = require('./server')();

initializeServer(server, {
  port: config.server.port,
  addrTakenTtl: config.error.addrinuse.ttl,
  addrTakenInterval: config.error.addrinuse.interval,
});

console.info('---');
function initializeServer(
  server,
  {
    port,
    addrTakenTtl,
    addrTakenInterval,
  },
  addressInUseErrorCounter = 0
) {
  server.listen(port, (err) => {
    if (err) {
      if (err.code === 'EADDRINUSE') {
        if (addressInUseErrorCounter++ < addrTakenTtl) {
          console.error(`Port ${port} is in use. Retrying in ${addrTakenInterval}ms...`);
          server.reset();
          server = require('./server')();
          setTimeout(
            initializeServer.bind(
              this, server, {
              port,
              addrTakenTtl,
              addrTakenInterval,
            }, addressInUseErrorCounter),
            addrTakenInterval
          );
        } else {
          throw new Error(`Port ${port} is still in use. Exiting with status code 1.`);
          // console.error(`Port ${port} is still in use. Exiting with status code 1.`);
          // process.exit(1);
        }
      }
    } else {
      console.info(`Server listening on port ${port} > http://127.0.0.1:${port}`);
    }
  });
};

process.on('error', () => {
  console.info('hi');
});
