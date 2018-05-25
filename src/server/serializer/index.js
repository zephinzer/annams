const bodyParser = require('body-parser');

module.exports = serverSerializer;

/**
 * Returns an Express.js compatible middleware that helps with
 * serializing incoming data to a .body property on the
 * request parameter of downstream handlers
 *
 * @return {Function}
 */
function serverSerializer() {
  if (serverSerializer.instance === null) {
    serverSerializer.instance = bodyParser.json(serverSerializer.options);
  }
  return serverSerializer.instance;
};

serverSerializer.instance = null;
serverSerializer.options = {
  type: 'application/json',
};
