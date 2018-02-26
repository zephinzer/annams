const route = require('./route');

module.exports = {
  getRoute: () => route().metricsMiddleware,
  getController: () => route(),
};
