const utility = require('./utility');

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = '6379';

module.exports = () => ({
  host: utility.stringFromEnv('CACHE_HOST', DEFAULT_HOST),
  port: utility.stringFromEnv('CACHE_PORT', DEFAULT_PORT),
});

utility.reportStatus('CACHE_HOST', module.exports().host); // eslint-disable-line max-len
utility.reportStatus('CACHE_PORT', module.exports().port); // eslint-disable-line max-len
