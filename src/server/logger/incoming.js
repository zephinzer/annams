const morgan = require('morgan');

module.exports = incomingLogger;

/**
 * Returns a Morgan instance for use with Express
 *
 * @return {Function}
 */
function incomingLogger() {
  return morgan(
    incomingLogger.formatter,
    incomingLogger.options
  );
};

incomingLogger.formatter = (tokens, req, res) => {
  return `< [${req.headers.id}] HTTP/${tokens['http-version'](req, res)} ${req.method} ${req.headers.host} ${tokens['url'](req, res)} ${tokens['remote-addr'](req, res)} ${req.header.origin || '-'} ${tokens['referrer'](req, res) || '-'} ${tokens['user-agent'](req, res) || '-'}`; // eslint-disable-line max-len
};

incomingLogger.options = {
  immediate: true,
  stream: {
    write: (content) => console.info(content.trim()),
  },
};
