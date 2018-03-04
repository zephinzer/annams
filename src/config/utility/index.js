const crypto = require('crypto');

const TRUTHY = ['true', 'TRUE', '1', 'yes', 'YES', 'y', 'Y']; // eslint-disable-line no-unused-vars,max-len
const FALSEY = ['false', 'FALSE', '0', 'no', 'NO', 'n', 'N']; // eslint-disable-line no-unused-vars,max-len

const generateMD5Hash = (data) =>
  crypto.createHash('md5').update(data).digest('hex');

module.exports = {
  nullableFromEnv: (environmentVariableName, defaultValue) =>
    process.env[environmentVariableName] ?
      process.env[environmentVariableName]
      : defaultValue,
  stringFromEnv: (environmentVariableName, defaultValue) =>
    process.env[environmentVariableName]
    || defaultValue,
  arrayFromEnv: (environmentVariableName, defaultValue) =>
    (typeof process.env[environmentVariableName] === 'string') ?
      process.env[environmentVariableName].split(',')
      : defaultValue,
  booleanFromEnv: (environmentVariableName, defaultValue) =>
    process.env[environmentVariableName] ?
      (TRUTHY.indexOf(process.env[environmentVariableName]) !== -1)
      : defaultValue,
  reportStatus: (environmentVariableName, finalValue, redacted = false) => {
    const envVar = process.env[environmentVariableName];
    const reportedEnvironmentValue = (redacted) ? `*${generateMD5Hash(envVar || '')}` : envVar; // eslint-disable-line max-len
    const reportedFinalValue = (redacted) ? `#_${generateMD5Hash(finalValue || '')}` : finalValue; // eslint-disable-line max-len
    console.info(`${environmentVariableName}:"${reportedEnvironmentValue}"="${reportedFinalValue}":${typeof finalValue}`); // eslint-disable-line max-len
  },
};
