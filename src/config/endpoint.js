const DEFAULT_LIVE = '/healthz';
const DEFAULT_READY = '/readyz';
const DEFAULT_METRICS = '/metrics';

module.exports = () => ({
  live: process.env.ENDPOINT_LIVE || DEFAULT_LIVE,
  ready: process.env.ENDPOINT_READY || DEFAULT_READY,
  metrics: process.env.ENDPOINT_METRICS || DEFAULT_METRICS,
});

console.info(`ENDPOINT_LIVE: "${process.env.ENDPOINT_LIVE}" (= "${module.exports().live}")`); // eslint-disable-line max-len
console.info(`ENDPOINT_READY: "${process.env.ENDPOINT_READY}" (= "${module.exports().ready}")`); // eslint-disable-line max-len
console.info(`ENDPOINT_METRICS: "${process.env.ENDPOINT_METRICS}" (= "${module.exports().metrics}")`); // eslint-disable-line max-len
