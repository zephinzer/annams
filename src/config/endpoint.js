const utility = require('./utility');

const DEFAULT_LIVE = '/healthz';
const DEFAULT_READY = '/readyz';
const DEFAULT_METRICS = '/metrics';

module.exports = () => ({
  live: utility.stringFromEnv('ENDPOINT_LIVE', DEFAULT_LIVE),
  ready: utility.stringFromEnv('ENDPOINT_READY', DEFAULT_READY),
  metrics: utility.stringFromEnv('ENDPOINT_METRICS', DEFAULT_METRICS),
});

utility.reportStatus('ENDPOINT_LIVE', module.exports().live); // eslint-disable-line max-len
utility.reportStatus('ENDPOINT_READY', module.exports().ready); // eslint-disable-line max-len
utility.reportStatus('ENDPOINT_METRICS', module.exports().metrics); // eslint-disable-line max-len
