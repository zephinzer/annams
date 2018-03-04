const utility = require('./utility');

const DEFAULT_INTERVAL = 5000;

module.exports = () => ({
  interval: utility.stringFromEnv('METRICS_INTERVAL', DEFAULT_INTERVAL),
});

console.info(`METRICS_INTERVAL: "${process.env.METRICS_INTERVAL}" (= "${module.exports().interval}")`); // eslint-disable-line max-len
