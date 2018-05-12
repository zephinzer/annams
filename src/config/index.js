const fs = require('fs');
const path = require('path');

const utility = require('./utility');

const DEFAULT_ENVIRONMENT = 'development';
const DEFAULT_SERVICE_NAME = 'annams';

module.exports = initializeConfiguration;

/**
 * Returns an instance of the configuration at the current point in time
 *
 * @param {Boolean} force - if enabled, forces a reload of the configuration
 *
 * @return {Object}
 */
function initializeConfiguration(force = false) {
  if (initializeConfiguration.config === null || force === true) {
    console.info('#> Initializing configuration');
    console.info('#> Config report format: (envvar):"(provided value)"="(evaulated value)":(typeof value))'); // eslint-disable-line max-len
    console.info('---\n\`\`\`');
    initializeConfiguration.config = initializeConfiguration.loadConfiguration(); // eslint-disable-line max-len
    initializeConfiguration.config.environment = utility.stringFromEnv('NODE_ENV', DEFAULT_ENVIRONMENT); // eslint-disable-line max-len
    initializeConfiguration.config.service = {
      name: utility.stringFromEnv('SERVICE_NAME', DEFAULT_SERVICE_NAME),
    };
    utility.reportStatus('NODE_ENV', initializeConfiguration.config.environment); // eslint-disable-line max-len
    initializeConfiguration.config.reset = initializeConfiguration.bind(null, true); // eslint-disable-line max-len
    initializeConfiguration.config.__timestamp = (new Date()).getTime();
    console.info('\`\`\`\n---');
    console.info('#/ Configuration initialized\n');
  }
  return initializeConfiguration.config;
};

initializeConfiguration.config = null;
initializeConfiguration.loadConfiguration = loadConfiguration;

/**
 * @return {Object} storing the configuration
 */
function loadConfiguration() {
  let config = {};
  const configurationListing = fs.readdirSync(__dirname);
  for (let i = 0; i < configurationListing.length; ++i) {
    const configurationListingPath =
      path.join(__dirname, configurationListing[i]);
    if (
      (configurationListing[i].indexOf('index.js') !== 0)
      && (configurationListing[i].indexOf('.test.js') === -1)
      && (!fs.lstatSync(configurationListingPath).isDirectory())
    ) {
      const configKey = configurationListing[i].substr(
        0, configurationListing[i].lastIndexOf('.')
      );
      const configValue = require(configurationListingPath)(config);
      config[configKey] = configValue;
    }
  }
  return config;
};
