const TRUTHY = ['true', 'TRUE', '1', 'yes', 'YES', 'y', 'Y']; // eslint-disable-line no-unused-vars,max-len
const FALSEY = ['false', 'FALSE', '0', 'no', 'NO', 'n', 'N']; // eslint-disable-line no-unused-vars,max-len

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
};
