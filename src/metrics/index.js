const Prometheus = require('prom-client');
const osUtils = require('os-utils');
const config = require('../config')();

module.exports = metrics;

function metrics() {
  Prometheus.register.clear();
  metrics.os = {
    cpuUsage: new Prometheus.Gauge({
      name: 'process_cpu_usage',
      help: 'CPU usage percentage',
    }),
    freeMemory: new Prometheus.Gauge({
      name: 'process_free_memory_percentage',
      help: 'Free memory by percentage',
    }),
    loadAvg15: new Prometheus.Gauge({
      name: 'process_load_avg_15',
      help: 'CPU load average (15)',
    }),
    loadAvg5: new Prometheus.Gauge({
      name: 'process_load_avg_5',
      help: 'CPU load average (5)',
    }),
    loadAvg1: new Prometheus.Gauge({
      name: 'process_load_avg_1',
      help: 'CPU load average (1)',
    }),
    processUptime: new Prometheus.Gauge({
      name: 'process_uptime',
      help: 'Uptime of the process',
    }),
    systemUptime: new Prometheus.Gauge({
      name: 'process_system_uptime',
      help: 'Uptime of the system',
    }),
  };
  Prometheus.collectDefaultMetrics({
    register: metrics.register,
    timeout: config.metrics.interval,
  });
  if (metrics._harvestOperatingSystemMetrics !== null) {
    clearTimeout(metrics._harvestOperatingSystemMetrics());
  }
  metrics.harvestOperatingSystemMetrics();
  return Prometheus.register;
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
