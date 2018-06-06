const Prometheus = require('prom-client');
const osUtils = require('os-utils');
const config = require('../config')();

module.exports = metrics;
metrics.status = {
  pushGateway: null,
  prometheus: null,
};

metrics.error = {
  pushGateway: null,
  prometheus: null,
};

/**
 * Initializes the metrics collection and returns the used register
 *
 * @return {Prometheus.Register}
 */
function metrics({
  enablePushGateway = false,
} = {}) {
  metrics.prometheus.register.clear();
  metrics.registerOperatingSystemMetrics();
  metrics.prometheus.collectDefaultMetrics({
    register: metrics.prometheus.register,
    timeout: config.metrics.interval,
  });
  if (metrics._harvestOperatingSystemMetrics !== null) {
    clearTimeout(metrics._harvestOperatingSystemMetrics);
  }
  metrics.harvestOperatingSystemMetrics();
  if (config.environment === 'development' || enablePushGateway) {
    metrics.initializePushGateway(true);
  }
  return metrics.prometheus.register;
};

metrics.prometheus = Prometheus;

metrics.createGauge = (name, help) => {
  return new Prometheus.Gauge({name, help});
};

metrics._harvestOperatingSystemMetrics = null;
metrics.harvestOperatingSystemMetrics = () => {
  osUtils.cpuUsage((usage) => metrics.os.cpuUsage.set(usage));
  metrics.os.systemUptime.set(osUtils.sysUptime());
  metrics.os.processUptime.set(osUtils.processUptime());
  metrics.os.freeMemory.set(osUtils.freememPercentage());
  metrics.os.loadAvg15.set(osUtils.loadavg(15));
  metrics.os.loadAvg5.set(osUtils.loadavg(5));
  metrics.os.loadAvg1.set(osUtils.loadavg(1));
  metrics._harvestOperatingSystemMetrics = setTimeout(
    metrics.harvestOperatingSystemMetrics,
    config.metrics.interval
  );
};

metrics.registerOperatingSystemMetrics = () => {
  metrics.os = {
    cpuUsage: metrics.createGauge('process_cpu_usage', 'CPU usage percentage'),
    freeMemory: metrics.createGauge('process_free_memory_percentage', 'Free memory by percentage'), // eslint-disable-line max-len
    loadAvg15: metrics.createGauge('process_load_avg_15', 'CPU load average (15)'), // eslint-disable-line max-len
    loadAvg5: metrics.createGauge('process_load_avg_5', 'CPU load average (5)'),
    loadAvg1: metrics.createGauge('process_load_avg_1', 'CPU load average (1)'),
    processUptime: metrics.createGauge('process_uptime', 'Uptime of the process'), // eslint-disable-line max-len
    systemUptime: metrics.createGauge('system_uptime', 'Uptime of the system'),
  };
};

metrics._pushGateway = null;
metrics._pushGatewayTimeoutObject = null;
metrics._pushGatewayUrl = `${config.metrics.pushgateway.host}:${config.metrics.pushgateway.port}`; // eslint-disable-line max-len
metrics._pushGatewayResponseTimeout = config.metrics.pushgateway.timeout;
metrics._pushGatewayPushInterval = config.metrics.pushgateway.interval;
metrics.pushGatewayResponseHandler = (err, res, body) => {
  if (err) {
    metrics.status.pushGateway = false;
    metrics.error.pushGateway = err;
    (err.message.indexOf('ECONNREFUSED') !== -1)
      && console.warn(`Prometheus PushGateway at ${metrics._pushGatewayUrl} is not available.`); // eslint-disable-line max-len
  } else {
    metrics.status.pushGateway = true;
    metrics.error.pushGateway = false;
  }
};
metrics.initializePushGateway = (reset = false) => {
  if (metrics._pushGateway === null || reset) {
    (reset && (metrics._pushGatewayTimeoutObject !== null))
      && clearTimeout(metrics._pushGatewayTimeoutObject);
    metrics._pushGateway = new Prometheus.Pushgateway(
      metrics._pushGatewayUrl,
      {timeout: metrics._pushGatewayResponseTimeout}
    );
  }
  metrics._pushGateway.push(
    {jobName: 'annams'},
    metrics.pushGatewayResponseHandler),
  metrics._pushGatewayTimeoutObject = setTimeout(
    metrics.initializePushGateway,
    metrics._pushGatewayPushInterval
  );
};
