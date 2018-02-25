const DEFAULT_ADDRINUSE_TTL = 5;
const DEFAULT_ADDRINUSE_INTERVAL = 5000;
const DEFAULT_DBNOTFOUND_TTL = 15;
const DEFAULT_DBNOTFOUND_INTERVAL = 5000;

module.exports = {
  addrinuse: {
    ttl: process.env.ERROR_ADDRINUSE_TTL || DEFAULT_ADDRINUSE_TTL,
    interval: process.env.ERROR_ADDRINUSE_INTERVAL || DEFAULT_ADDRINUSE_INTERVAL,
  },
  dbnotfound: {
    ttl: process.env.ERROR_DBNOTFOUND_TTL || DEFAULT_DBNOTFOUND_TTL,
    interval: process.env.ERROR_DBNOTFOUND_INTERVAL || DEFAULT_DBNOTFOUND_INTERVAL,
  },
};

console.info(`ERROR_ADDRINUSE_TTL: "${process.env.ERROR_ADDRINUSE_TTL}" (= "${module.exports.addrinuse.ttl}")`)
console.info(`ERROR_ADDRINUSE_INTERVAL: "${process.env.ERROR_ADDRINUSE_INTERVAL}" (= "${module.exports.addrinuse.interval}")`)
console.info(`ERROR_DBNOTFOUND_TTL: "${process.env.ERROR_DBNOTFOUND_TTL}" (= "${module.exports.dbnotfound.ttl}")`)
console.info(`ERROR_DBNOTFOUND_INTERVAL: "${process.env.ERROR_DBNOTFOUND_INTERVAL}" (= "${module.exports.dbnotfound.interval}")`)
