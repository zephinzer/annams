const expressPromBundle = require('express-prom-bundle');

let _metrics = null;

module.exports = () => {
  if (_metrics === null) {
    _metrics = expressPromBundle({
      autoregister: false,
      includeMethod: true,
      includePath: true,
    });
  }
  return _metrics;
};
