const utility = require('./utility');

const DEFAULT_CORS_ALLOWED_HOSTS = [];
const DEFAULT_CORS_ALLOWED_METHODS = [];
const DEFAULT_LOG_ENABLED = true;
const DEFAULT_LOG_LEVEL = 'trace';
const DEFAULT_LOG_PRETTY = true;
const DEFAULT_PORT = 10000;
const DEFAULT_BIND_ADDRESS = '0.0.0.0';
const DEFAULT_TRACING_ZIPKIN_ENABLED = true;
const DEFAULT_TRACING_ZIPKIN_HOSTNAME = 'http://localhost:19411';

module.exports = () => ({
  bind: {
    address: utility.stringFromEnv('SERVER_BIND_ADDRESS', DEFAULT_BIND_ADDRESS),
  },
  cors: {
    allowed: {
      hosts: utility.arrayFromEnv('SERVER_CORS_ALLOWED_HOSTS', DEFAULT_CORS_ALLOWED_HOSTS), // eslint-disable-line max-len
      methods: utility.arrayFromEnv('SERVER_CORS_ALLOWED_METHODS', DEFAULT_CORS_ALLOWED_METHODS), // eslint-disable-line max-len
    },
  },
  log: {
    enabled: utility.booleanFromEnv('SERVER_LOG_ENABLED', DEFAULT_LOG_ENABLED),
    level: utility.stringFromEnv('SERVER_LOG_LEVEL', DEFAULT_LOG_LEVEL),
    pretty: utility.booleanFromEnv('SERVER_LOG_PRETTY', DEFAULT_LOG_PRETTY),
  },
  port: utility.stringFromEnv('SERVER_PORT', DEFAULT_PORT),
  tracing: {
    zipkin: {
      enabled: utility.booleanFromEnv('SERVER_TRACING_ZIPKIN_ENABLED', DEFAULT_TRACING_ZIPKIN_ENABLED), // eslint-disable-line max-len
      hostname: utility.stringFromEnv('SERVER_TRACING_ZIPKIN_HOSTNAME', DEFAULT_TRACING_ZIPKIN_HOSTNAME), // eslint-disable-line max-len
    },
  },
});

utility.reportStatus('SERVER_BIND_ADDRESS', module.exports().bind.address); // eslint-disable-line max-len
utility.reportStatus('SERVER_CORS_ALLOWED_HOSTS', module.exports().cors.allowed.hosts); // eslint-disable-line max-len
utility.reportStatus('SERVER_CORS_ALLOWED_METHODS', module.exports().cors.allowed.methods); // eslint-disable-line max-len
utility.reportStatus('SERVER_LOG_ENABLED', module.exports().log.enabled); // eslint-disable-line max-len
utility.reportStatus('SERVER_LOG_LEVEL', module.exports().log.level); // eslint-disable-line max-len
utility.reportStatus('SERVER_LOG_PRETTY', module.exports().log.pretty); // eslint-disable-line max-len
utility.reportStatus('SERVER_PORT', module.exports().port); // eslint-disable-line max-len
utility.reportStatus('SERVER_TRACING_ZIPKIN_ENABLED', module.exports().tracing.zipkin.enabled); // eslint-disable-line max-len
utility.reportStatus('SERVER_TRACING_ZIPKIN_HOSTNAME', module.exports().tracing.zipkin.hostname); // eslint-disable-line max-len
