const fs = require('fs');
const path = require('path');

const utility = require('./utility');

const DEFAULT_VERSION = 'unknown';
const VERSION_FILE_PATH = path.join(process.cwd(), '/.version');

module.exports = () => {
  try {
    fs.lstatSync(VERSION_FILE_PATH);
    return fs.readFileSync(VERSION_FILE_PATH).toString();
  } catch (ex) {
    const package = require(path.join(process.cwd(), '/package.json'));
    if (package.version) {
      return package.version;
    }
    return DEFAULT_VERSION;
  }
};

utility.reportStatus('VERSION', module.exports());
