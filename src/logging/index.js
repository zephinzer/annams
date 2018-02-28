const config = require('../config')();
module.exports = init;

/**
 * Stub function for initialising the logging
 *
 * @return {Object}
 */
function init() {
  if (init._console === null) {
    init._console = {};
    const pino = require('pino')({
      level: config.server.log.level,
      prettyPrint: config.server.log.pretty,
      enabled: config.server.log.enabled,
      safe: true,
      stream: process.stdout,
    });
    init._console.silent = global.console.silent;
    global.console.silent = pino.silent.bind(pino);
    init._console.trace = global.console.trace;
    global.console.trace = pino.trace.bind(pino);
    init._console.log = global.console.log;
    global.console.log = pino.debug.bind(pino);
    init._console.info = global.console.info;
    global.console.info = pino.info.bind(pino);
    init._console.warn = global.console.warn;
    global.console.warn = pino.warn.bind(pino);
    init._console.error = global.console.error;
    global.console.error = pino.error.bind(pino);
    init._console.reset = () => {
      global.console.silent = init._console.silent;
      global.console.trace = init._console.trace;
      global.console.log = init._console.log;
      global.console.info = init._console.info;
      global.console.warn = init._console.warn;
      global.console.error = init._console.error;
    };
  }
  return init._console;
};

init._console = null;
