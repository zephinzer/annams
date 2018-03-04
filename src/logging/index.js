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
    initializeApplicationLogging.overrideDefaultConsoleWith(pino);
    initializeApplicationLogging._console.reset =
      initializeApplicationLogging.resetToDefaultConsole;
  }
  return initializeApplicationLogging._console;
};

initializeApplicationLogging.DEFAULT_OVERRIDE_KEYS = [
  {pino: 'silent', console: 'silent'},
  {pino: 'trace', console: 'trace'},
  {pino: 'debug', console: 'log'},
  {pino: 'info', console: 'info'},
  {pino: 'warn', console: 'warn'},
  {pino: 'error', console: 'error'},
];

initializeApplicationLogging.overrideDefaultConsoleWith = (pinoInstance) => {
  for (let i = 0; i < initializeApplicationLogging.DEFAULT_OVERRIDE_KEYS.length; ++i) {
    const key = initializeApplicationLogging.DEFAULT_OVERRIDE_KEYS[i];
    initializeApplicationLogging._console[key.console] = global.console[key.console];
    global.console[key.console] = pinoInstance[key.pino].bind(pinoInstance);
  }
};

initializeApplicationLogging.resetToDefaultConsole = () => {
  for (let i = 0; i < initializeApplicationLogging.DEFAULT_OVERRIDE_KEYS.length; ++i) {
    const key = initializeApplicationLogging.DEFAULT_OVERRIDE_KEYS[i];
    global.console[key.console] = initializeApplicationLogging._console[key.console];
  }
};

initializeApplicationLogging._console = null;
