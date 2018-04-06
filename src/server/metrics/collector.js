const expressPromBundle = require('express-prom-bundle');

module.exports = metricsCollector;

/**
 * Returns an express-prom-bundle instance
 *
 * @return {Function}
 */
function metricsCollector() {
  if (metricsCollector._metrics === null) {
    metricsCollector._metrics = expressPromBundle(
      metricsCollector.options.expressPromBundle
    );
  }
  return metricsCollector._metrics;
}

metricsCollector._metrics = null;

metricsCollector.clear = () => {
  metricsCollector._metrics = null;
};

metricsCollector.options = {
  expressPromBundle: {
    autoregister: false,
    includeMethod: true,
    includePath: true,
  },
};
