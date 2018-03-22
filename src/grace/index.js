module.exports = grace;

/**
 * Creates process hooks to gracefully shutdown
 */
function grace() {
  process.on('uncaughtException',
    grace.fatalErrorHandler.bind(this, 'UNCAUGHT_EXCEPTION')
  );
  process.on('unhandledRejection',
    grace.fatalErrorHandler.bind(this, 'UNHANDLED_REJECTION')
  );
  process.on('SIGINT', (code) => {
    console.warn(`SIGINT received (code: ${code}). Exiting with code 127.`);
    process.exit(127);
  });
  process.on('SIGTERM', (code) => {
    console.warn(`SIGTERM received (code: ${code}). Exiting with code 127.`);
    process.exit(127);
  });
  process.on('exit', (code) => {
    if (code === 0) {
      console.info(`Exiting with status code ${code}.`);
    } else {
      console.error(`Exiting with status code ${code}.`);
    }
  });
}

/**
 * Handles a fatal error
 *
 * @param {String} code
 * @param {Error} [ex={}] exception or error
 */
grace.fatalErrorHandler = (code, ex = {}) => {
  (ex.message) && console.error(`${code}:`, ex.message);
  console.error(`${code}:`, ex.stack);
  process.exit(1);
};
