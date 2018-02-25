const DEFAULT_LIVE = '/healthz';
const DEFAULT_READY = '/readyz';

module.exports = {
  live: process.env.ENDPOINT_LIVE || DEFAULT_LIVE,
  ready: process.env.ENDPOINT_READY || DEFAULT_READY,
};

console.info(`ENDPOINT_LIVE: "${process.env.ENDPOINT_LIVE}" (= "${module.exports.live}")`);
console.info(`ENDPOINT_READY: "${process.env.ENDPOINT_READY}" (= "${module.exports.ready}")`);
