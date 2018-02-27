const cors = require('cors');
const config = require('../../config')();

let corsHandler = null;

module.exports = () => {
  if (corsHandler === null) {
    if (config.server.cors.allowed.hosts.length === 0) {
      corsHandler = cors();
    } else {
      corsHandler = cors({
        origin: (origin, callback) => {
          const {hosts} = config.server.cors.allowed;
          if (hosts.indexOf(origin) !== -1 || origin === undefined) {
            return callback(null, true);
          }
          return callback(new Error(`Origin ${origin} is not allowed.`));
        },
      });
    }
  }
  return corsHandler;
};