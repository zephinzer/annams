const DEFAULT_LOG_LEVEL = 'info';
const DEFAULT_PORT = 10000;

module.exports = {
  log: {
    level: process.env.SERVER_LOG_LEVEL || DEFAULT_LOG_LEVEL,
  },
  port: process.env.SERVER_PORT || DEFAULT_PORT,
};

console.info(`SERVER_LOG_LEVEL: "${process.env.SERVER_LOG_LEVEL}" (= "${module.exports.log.level}")`);
console.info(`SERVER_PORT: "${process.env.SERVER_PORT}" (= "${module.exports.port}")`);