const utility = require('./utility');

const DEFAULT_INTERVAL = 5000;
const DEFAULT_PUSHGATEWAY_HOST = 'http://localhost';
const DEFAULT_PUSHGATEWAY_PORT = '19091';
const DEFAULT_PUSHGATEWAY_TIMEOUT = 10 * 1000; // 10 seconds
const DEFAULT_PUSHGATEWAY_INTERVAL = 5 * 1000; // 5 seconds

module.exports = () => ({
  interval: utility.integerFromEnv('METRICS_INTERVAL', DEFAULT_INTERVAL),
  pushgateway: {
    host: utility.stringFromEnv('METRICS_PUSHGATEWAY_HOST', DEFAULT_PUSHGATEWAY_HOST), // eslint-disable-line max-len
    port: utility.stringFromEnv('METRICS_PUSHGATEWAY_PORT', DEFAULT_PUSHGATEWAY_PORT), // eslint-disable-line max-len
    timeout: utility.integerFromEnv('METRICS_PUSHGATEWAY_TIMEOUT', DEFAULT_PUSHGATEWAY_TIMEOUT), // eslint-disable-line max-len
    interval: utility.integerFromEnv('METRICS_PUSHGATEWAY_INTERVAL', DEFAULT_PUSHGATEWAY_INTERVAL), // eslint-disable-line max-len
  },
});

utility.reportStatus('METRICS_INTERVAL', module.exports().interval); // eslint-disable-line max-len
utility.reportStatus('METRICS_PUSHGATEWAY_HOST', module.exports().pushgateway.host); // eslint-disable-line max-len
utility.reportStatus('METRICS_PUSHGATEWAY_PORT', module.exports().pushgateway.port); // eslint-disable-line max-len
utility.reportStatus('METRICS_PUSHGATEWAY_TIMEOUT', module.exports().pushgateway.timeout); // eslint-disable-line max-len
utility.reportStatus('METRICS_PUSHGATEWAY_INTERVAL', module.exports().pushgateway.interval); // eslint-disable-line max-len
