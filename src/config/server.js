const DEFAULT_CORS_ALLOWED_HOSTS = [];
const DEFAULT_CORS_ALLOWED_METHODS = [];
const DEFAULT_LOG_ENABLED = true;
const DEFAULT_LOG_LEVEL = 'trace';
const DEFAULT_LOG_PRETTY = true;
const DEFAULT_PORT = 10000;
const DEFAULT_BIND_ADDRESS = '127.0.0.1';

module.exports = () => ({
  cors: {
    allowed: {
      hosts: (typeof process.env.SERVER_CORS_ALLOWED_HOSTS === 'string') ?
        process.env.SERVER_CORS_ALLOWED_HOSTS.split(',')
        : DEFAULT_CORS_ALLOWED_HOSTS,
      methods: (typeof process.env.SERVER_CORS_ALLOWED_METHODS === 'string') ?
        process.env.SERVER_CORS_ALLOWED_METHODS.split(',')
        : DEFAULT_CORS_ALLOWED_METHODS,
    },
  },
  log: {
    enabled: process.env.SERVER_LOG_ENABLED ?
      (['true', '1'].indexOf(process.env.SERVER_LOG_ENABLED) !== -1)
        : DEFAULT_LOG_ENABLED,
    level: process.env.SERVER_LOG_LEVEL || DEFAULT_LOG_LEVEL,
    pretty: process.env.SERVER_LOG_PRETTY ?
      (['true', '1'].indexOf(process.env.SERVER_LOG_PRETTY) !== -1)
        : DEFAULT_LOG_PRETTY,
  },
  port: process.env.SERVER_PORT || DEFAULT_PORT,
  bind: {
    address: process.env.SERVER_BIND_ADDRESS || DEFAULT_BIND_ADDRESS,
  },
});

console.info(`SERVER_CORS_ALLOWED_HOSTS: "${process.env.SERVER_CORS_ALLOWED_HOSTS}" (= "${module.exports().cors.allowed.hosts}")`); // eslint-disable-line max-len
console.info(`SERVER_CORS_ALLOWED_METHODS: "${process.env.SERVER_CORS_ALLOWED_METHODS}" (= "${module.exports().cors.allowed.methods}")`); // eslint-disable-line max-len
console.info(`SERVER_LOG_ENABLED: "${process.env.SERVER_LOG_ENABLED}" (= "${module.exports().log.enabled}")`); // eslint-disable-line max-len
console.info(`SERVER_LOG_LEVEL: "${process.env.SERVER_LOG_LEVEL}" (= "${module.exports().log.level}")`); // eslint-disable-line max-len
console.info(`SERVER_LOG_PRETTY: "${process.env.SERVER_LOG_PRETTY}" (= "${module.exports().log.pretty}")`); // eslint-disable-line max-len
console.info(`SERVER_PORT: "${process.env.SERVER_PORT}" (= "${module.exports().port}")`); // eslint-disable-line max-len
console.info(`SERVER_BIND_ADDRESS: "${process.env.SERVER_BIND_ADDRESS}" (= "${module.exports().bind.address}")`); // eslint-disable-line max-len
