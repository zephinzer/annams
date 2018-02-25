const fastify = require('fastify');
const config = require('../config')();
let serverInstance = null;

module.exports = server;

/**
 * Creates a server instance for accessing the API
 */
function server() {
  if (serverInstance === null) {
    serverInstance = fastify({
      logging: config.server.log,
    });
    serverInstance.get('/', async (req, res) => {
      res.type('application/json').code(200);
      return 'ok';
    });
    serverInstance.reset = reset;
  }
  return serverInstance;
};

/**
 * Resets the server
 */
function reset() {
  serverInstance = null;
};
