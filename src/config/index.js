const fs = require('fs');
const path = require('path');

let config = null;

module.exports = initializeConfiguration;

/**
 * Returns an instance of the configuration at the current point in time
 *
 * @param {Boolean} force - if enabled, forces a reload of the configuration
 *
 * @return {Object}
 */
function initializeConfiguration(force = false) {
  if (config === null || force === true) {
    config = {};
    const configurationPath = path.join(__dirname);
    console.info('> Initializing configuration (format: ENVVAR_NAME: "(provided value)" (= "[evaulated value]")'); // eslint-disable-line max-len
    const configurationListing = fs.readdirSync(configurationPath);
    for (let i = 0; i < configurationListing.length; ++i) {
      if (configurationListing[i].indexOf('index.js') !== 0) {
        const configKey =
          configurationListing[i].substr(
            0, configurationListing[i].lastIndexOf('.')
          );
        const configPath = path.join(__dirname, `/${configurationListing[i]}`);
        const configValue = require(configPath)();
        config[configKey] = configValue;
      }
    }
    config.reset = initializeConfiguration;
    config.__timestamp = (new Date()).getTime();
    console.info('/ Configuration initialized\n');
  }
  return config;
};
