const DEFAULT_CORS_ALLOWED_HOSTS = [];
const DEFAULT_CORS_ALLOWED_METHODS = [];
const DEFAULT_LOG_LEVEL = 'info';
const DEFAULT_PORT = 10000;
const DEFAULT_BIND_ADDRESS = '127.0.0.1';

module.exports = {
  cors: {
    allowed: {
      hosts: (typeof process.env.SERVER_CORS_ALLOWED_HOSTS === 'string') ? process.env.SERVER_CORS_ALLOWED_HOSTS.split(',') : DEFAULT_CORS_ALLOWED_HOSTS,
      methods: (typeof process.env.SERVER_CORS_ALLOWED_METHODS === 'string') ? process.env.SERVER_CORS_ALLOWED_METHODS.split(',') : DEFAULT_CORS_ALLOWED_METHODS,
    },
  },
  log: {
    level: process.env.SERVER_LOG_LEVEL || DEFAULT_LOG_LEVEL,
  },
  port: process.env.SERVER_PORT || DEFAULT_PORT,
  bind: {
    address: process.env.SERVER_BIND_ADDRESS || DEFAULT_BIND_ADDRESS,
  }
};

console.info(`SERVER_CORS_ALLOWED_HOSTS: "${process.env.SERVER_CORS_ALLOWED_HOSTS}" (= "${module.exports.cors.allowed.hosts}")`);
console.info(`SERVER_CORS_ALLOWED_METHODS: "${process.env.SERVER_CORS_ALLOWED_METHODS}" (= "${module.exports.cors.allowed.methods}")`);
console.info(`SERVER_LOG_LEVEL: "${process.env.SERVER_LOG_LEVEL}" (= "${module.exports.log.level}")`);
console.info(`SERVER_PORT: "${process.env.SERVER_PORT}" (= "${module.exports.port}")`);
console.info(`SERVER_BIND_ADDRESS: "${process.env.SERVER_BIND_ADDRESS}" (= "${module.exports.bind.address}")`);