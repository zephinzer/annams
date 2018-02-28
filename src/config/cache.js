const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = '6379';

module.exports = () => ({
  host: process.env.CACHE_HOST || DEFAULT_HOST,
  port: process.env.CACHE_PORT || DEFAULT_PORT,
});

console.info(`CACHE_HOST: "${process.env.CACHE_HOST}" (= "${module.exports().host}")`); // eslint-disable-line max-len
console.info(`CACHE_PORT: "${process.env.CACHE_PORT}" (= "${module.exports().port}")`); // eslint-disable-line max-len
