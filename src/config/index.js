module.exports = init;

const fs = require('fs');
const path = require('path');

let config = {};

init();

function init() {
  const configurationListing = fs.readdirSync(path.join(__dirname));
  for (let i = 0; i < configurationListing.length; ++i) {
    if (configurationListing[i].indexOf('index.js') !== 0) {
      const configKey = configurationListing[i].substr(0, configurationListing[i].lastIndexOf('.'));
      const configValue = require(path.join(__dirname, `/${configurationListing[i]}`));
      config[configKey] = configValue;
    }
  }
  config.reset = reset;
  config.__timestamp = (new Date()).getTime();
  return config;
};

function reset() {
  init();
};
