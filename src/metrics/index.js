const Prometheus = require('prom-client');
const osUtils = require('os-utils');
const config = require('../config')();

module.exports = metrics;

/**
 * Initializes the metrics collection and returns the used register
 *
 * @return {Prometheus.Register}
 */
function metrics() {
  Prometheus.register.clear();
  metrics.registerOperatingSystemMetrics();
  Prometheus.collectDefaultMetrics({
    register: Prometheus.register,
    timeout: config.metrics.interval,
  });
  if (metrics._harvestOperatingSystemMetrics !== null) {
    clearTimeout(metrics._harvestOperatingSystemMetrics());
  }
  metrics.harvestOperatingSystemMetrics();
  if (config.environment === 'development') {
    metrics.initializePushGatewayForDevelopment(true);
  }
  return Prometheus.register;
};

metrics.createGauge = (name, help) => {
  return new Prometheus.Gauge({name, help});
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

metrics._pushGatewayForDevelopment = null;
metrics._pushGatewayForDevelopmentTimeout = null;
metrics._pushGatewayForDevelopmentHostname = 'http://localhost:19091';
metrics._pushGatewayResponseTimeout = 10 * 1000; // 10 seconds
metrics._pushGatewayPushInterval = 5 * 1000; // 5 seconds
metrics.initializePushGatewayForDevelopment = (reset = false) => {
  if (metrics._pushGatewayForDevelopment === null || reset) {
    (reset && (metrics._pushGatewayForDevelopmentTimeout !== null))
      && clearTimeout(metrics._pushGatewayForDevelopmentTimeout);
    metrics._pushGatewayForDevelopment = new Prometheus.Pushgateway(
      metrics._pushGatewayForDevelopmentHostname,
      {timeout: metrics._pushGatewayResponseTimeout}
    );
  }
  metrics._pushGatewayForDevelopment.push(
    {jobName: 'annams'},
    (err, res, body) => {
      (err) && console.error(err);
    }),
  metrics._pushGatewayForDevelopmentTimeout = setTimeout(
    metrics.initializePushGatewayForDevelopment,
    metrics._pushGatewayPushInterval
  );
};
