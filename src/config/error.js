const utility = require('./utility');

const DEFAULT_ADDRINUSE_TTL = 5;
const DEFAULT_ADDRINUSE_INTERVAL = 5000;
const DEFAULT_DBNOTFOUND_TTL = 15;
const DEFAULT_DBNOTFOUND_INTERVAL = 5000;

module.exports = () => ({
  addrinuse: {
    ttl: utility.stringFromEnv('ERROR_ADDRINUSE_TTL', DEFAULT_ADDRINUSE_TTL), // eslint-disable-line max-len
    interval: utility.stringFromEnv('ERROR_ADDRINUSE_INTERVAL', DEFAULT_ADDRINUSE_INTERVAL), // eslint-disable-line max-len
  },
  dbnotfound: {
    ttl: utility.stringFromEnv('ERROR_DBNOTFOUND_TTL', DEFAULT_DBNOTFOUND_TTL), // eslint-disable-line max-len
    interval: utility.stringFromEnv('ERROR_DBNOTFOUND_INTERVAL', DEFAULT_DBNOTFOUND_INTERVAL), // eslint-disable-line max-len
  },
});

utility.reportStatus('ERROR_ADDRINUSE_TTL', module.exports().addrinuse.ttl); // eslint-disable-line max-len
utility.reportStatus('ERROR_ADDRINUSE_INTERVAL', module.exports().addrinuse.interval); // eslint-disable-line max-len
utility.reportStatus('ERROR_DBNOTFOUND_TTL', module.exports().dbnotfound.ttl); // eslint-disable-line max-len
utility.reportStatus('ERROR_DBNOTFOUND_INTERVAL', module.exports().dbnotfound.interval); // eslint-disable-line max-len
