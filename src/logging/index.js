const config = require('../config')();

module.exports = initializeApplicationLogging;

/**
 * Stub function for initialising the logging
 *
 * @return {Object}
 */
function initializeApplicationLogging() {
  if (initializeApplicationLogging._console === null) {
    initializeApplicationLogging._console = {};
    const pino = require('pino')({
      level: config.server.log.level,
      prettyPrint: config.server.log.pretty,
      enabled: config.server.log.enabled,
      safe: true,
      stream: process.stdout,
    });
    initializeApplicationLogging._console.silent = global.console.silent;
    global.console.silent = pino.silent.bind(pino);
    initializeApplicationLogging._console.trace = global.console.trace;
    global.console.trace = pino.trace.bind(pino);
    initializeApplicationLogging._console.log = global.console.log;
    global.console.log = pino.debug.bind(pino);
    initializeApplicationLogging._console.info = global.console.info;
    global.console.info = pino.info.bind(pino);
    initializeApplicationLogging._console.warn = global.console.warn;
    global.console.warn = pino.warn.bind(pino);
    initializeApplicationLogging._console.error = global.console.error;
    global.console.error = pino.error.bind(pino);
    initializeApplicationLogging._console.reset = () => {
      global.console.silent = initializeApplicationLogging._console.silent;
      global.console.trace = initializeApplicationLogging._console.trace;
      global.console.log = initializeApplicationLogging._console.log;
      global.console.info = initializeApplicationLogging._console.info;
      global.console.warn = initializeApplicationLogging._console.warn;
      global.console.error = initializeApplicationLogging._console.error;
    };
  }
  return initializeApplicationLogging._console;
};

initializeApplicationLogging._console = null;
