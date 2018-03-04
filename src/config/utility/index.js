module.exports = {
  stringFromEnv: (environmentVariableName, defaultValue) =>
    process.env[environmentVariableName] ?
      process.env[environmentVariableName] : defaultValue,
};
