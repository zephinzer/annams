const ExpressPrometheusBundle = require('express-prom-bundle');

let _metrics = null;

module.exports = () => {
  if (_metrics === null) {
    _metrics = ExpressPrometheusBundle({
      autoregister: false,
      includeMethod: true,
      includePath: true,
    });
  }
  return _metrics;
};
