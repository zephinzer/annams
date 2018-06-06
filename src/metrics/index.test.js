const metrics = require('./');

describe('metrics', () => {
  it('has the correct keys', () => {
    expect(metrics).to.include.keys([
      'prometheus',
      'createGauge',
      'harvestOperatingSystemMetrics',
      'initializePushGateway',
      'pushGatewayResponseHandler',
      'registerOperatingSystemMetrics',
      'status',
      'error',
    ]);
  });

  describe('constructor()', () => {
    const original = {};
    const spy = {};
    const mock = {};

    before(() => {
      original.prometheus = metrics.prometheus;
      original._harvestOperatingSystemMetrics =
        metrics._harvestOperatingSystemMetrics;
      sinon.stub(metrics, 'registerOperatingSystemMetrics');
      sinon.stub(metrics, 'harvestOperatingSystemMetrics');
      spy.clear = sinon.spy();
      spy.collectDefaultMetrics = sinon.spy();
      mock.register = {
        clear: spy.clear,
      };
      metrics.prometheus = {
        collectDefaultMetrics: spy.collectDefaultMetrics,
        register: mock.register,
      };
    });

    beforeEach(() => {
      metrics();
    });

    after(() => {
      metrics.prometheus = original.prometheus;
      metrics._harvestOperatingSystemMetrics =
        original._harvestOperatingSystemMetrics;
      metrics.registerOperatingSystemMetrics.restore();
      metrics.harvestOperatingSystemMetrics.restore();
    });

    afterEach(() => {
      spy.clear.resetHistory();
      spy.collectDefaultMetrics.resetHistory();
      metrics.registerOperatingSystemMetrics.resetHistory();
      metrics.harvestOperatingSystemMetrics.resetHistory();
    });

    it('clears the prometheus register', () => {
      expect(spy.clear).to.be.calledOnce;
    });

    it('collects default metrics', () => {
      expect(spy.collectDefaultMetrics).to.be.calledOnce;
      expect(spy.collectDefaultMetrics).to.be.calledWith({
        register: mock.register,
        timeout: require('../config')().metrics.interval,
      });
    });

    it('registers operating system metrics', () => {
      expect(metrics.registerOperatingSystemMetrics).to.be.calledOnce;
    });

    it('harvests operating system metrics', () => {
      expect(metrics.harvestOperatingSystemMetrics).to.be.calledOnce;
    });

    context('operating system metrics already being harvested', () => {
      const original = {};

      before(() => {
        original._harvestOperatingSystemMetrics =
          metrics._harvestOperatingSystemMetrics;
        metrics._harvestOperatingSystemMetrics = setTimeout(() => {
          throw new Error('this timeout was not cleared ):');
        }, 10000); // unrealistically long number
        console.info(metrics._harvestOperatingSystemMetrics);
      });

      after(() => {
        metrics._harvestOperatingSystemMetrics =
          original._harvestOperatingSystemMetrics;
      });

      it('clears the timeout for the harvest cycle', () => {
        console.info(metrics._harvestOperatingSystemMetrics);
        expect(metrics._harvestOperatingSystemMetrics._onTimeout)
          .to.equal(null);
      });
    });

    context('NODE_ENV is "development"', () => {
      const original = {};

      before(() => {
        const config = require('../config')();
        original.config = {
          environment: config.environment,
        };
        config.environment = 'development';
        sinon.stub(metrics, 'initializePushGateway');
      });

      after(() => {
        const config = require('../config')();
        config.environment = original.config.environment;
        metrics.initializePushGateway.restore();
      });

      afterEach(() => {
        metrics.initializePushGateway.resetHistory();
      });

      it('initialies the push gateway', () => {
        expect(metrics.initializePushGateway).to.be.calledOnce;
      });
    });

    context('enablePushGateway flag is set to `true`', () => {
      const original = {};

      before(() => {
        const config = require('../config')();
        original.config = {
          environment: config.environment,
        };
        config.environment = 'not-development';
        sinon.stub(metrics, 'initializePushGateway');
      });

      beforeEach(() => {
        metrics({
          enablePushGateway: true,
        });
      });

      after(() => {
        const config = require('../config')();
        config.environment = original.config.environment;
        metrics.initializePushGateway.restore();
      });

      afterEach(() => {
        metrics.initializePushGateway.resetHistory();
      });

      it('initialies the push gateway', () => {
        expect(metrics.initializePushGateway).to.be.calledOnce;
      });
    });
  });

  describe('.prometheus', () => {
    it('exports an object', () => {
      expect(metrics.prometheus).to.be.an('object');
    });
  });

  describe('.createGauge()', () => {
    const Prometheus = require('prom-client');
    let promGaugeStub = null;

    before(() => {
      Prometheus.register.clear();
    });

    after(() => {
      Prometheus.register.clear();
    });

    it('returns a Prometheus.Gauge', () => {
      expect(
        metrics.createGauge('_test_name', '_test_help')
      ).to.be.instanceOf(Prometheus.Gauge);
    });

    it('calls Prometheus Gauge correctly', () => {
      promGaugeStub = sinon.stub(Prometheus, 'Gauge');
      metrics.createGauge('_test_name', '_test_help');
      expect(Prometheus.Gauge).to.be.calledOnce;
      expect(Prometheus.Gauge).to.be.calledWith({
        name: '_test_name',
        help: '_test_help',
      });
      promGaugeStub.restore();
    });
  });

  describe('.harvestOperatingSystemMetrics()', () => {
    let originalMetricsOs = null;
    let originalGlobalTimeout = null;

    before(() => {
      originalGlobalTimeout = global.setTimeout;
      global.setTimeout = sinon.spy();
      originalMetricsOs = metrics.os;
      metrics.os = {
        cpuUsage: {set: sinon.spy()},
        systemUptime: {set: sinon.spy()},
        processUptime: {set: sinon.spy()},
        freeMemory: {set: sinon.spy()},
        loadAvg15: {set: sinon.spy()},
        loadAvg5: {set: sinon.spy()},
        loadAvg1: {set: sinon.spy()},
      };
    });

    after(() => {
      metrics.os = originalMetricsOs;
      global.setTimeout = originalGlobalTimeout;
    });

    it('sets the correct registers', () => {
      metrics.harvestOperatingSystemMetrics();
      return new Promise((resolve, reject) => {
        try {
          expect(metrics.os.loadAvg1.set).to.be.calledOnce;
          expect(metrics.os.loadAvg5.set).to.be.calledOnce;
          expect(metrics.os.loadAvg15.set).to.be.calledOnce;
          expect(metrics.os.freeMemory.set).to.be.calledOnce;
          expect(metrics.os.processUptime.set).to.be.calledOnce;
          expect(metrics.os.systemUptime.set).to.be.calledOnce;
          resolve();
        } catch (ex) {
          reject(ex);
        }
      });
    });

    it('calls itself via a timeout', () => {
      // calledTwice because osUtils@0.0.14 uses setTimeout too
      expect(global.setTimeout).to.be.calledTwice;
    });
  });

  describe('.initializePushGateway', () => {
    context('reset === true || push gateway not initialised', () => {
      const Prometheus = require('prom-client');

      let originalGlobalClearTimeout = null;
      let originalGlobalSetTimeout = null;
      let originalPrometheusPushgateway = null;
      let clearTimeoutSpy = null;
      let setTimeoutSpy = null;
      let pushGatewaySpy = null;
      let pushGatewayPushSpy = null;

      before(() => {
        originalGlobalSetTimeout = global.setTimeout;
        setTimeoutSpy = sinon.spy();
        global.setTimeout = setTimeoutSpy;

        originalGlobalClearTimeout = global.clearTimeout;
        clearTimeoutSpy = sinon.spy();
        global.clearTimeout = clearTimeoutSpy;

        originalPrometheusPushgateway = Prometheus.Pushgateway;
        pushGatewayPushSpy = sinon.spy();
        pushGatewaySpy = sinon.spy();
        Prometheus.Pushgateway = function(...args) {
          pushGatewaySpy.apply(null, [...args]);
          return {
            push: pushGatewayPushSpy,
          };
        };
      });

      after(() => {
        global.setTimeout = originalGlobalSetTimeout;
        global.clearTimeout = originalGlobalClearTimeout;
        Prometheus.Pushgateway = originalPrometheusPushgateway;
      });

      afterEach(() => {
        clearTimeoutSpy.resetHistory();
        setTimeoutSpy.resetHistory();
        pushGatewaySpy.resetHistory();
        pushGatewayPushSpy.resetHistory();
      });

      context('a push gateway exists', () => {
        const pushGatewayTimeoutObject = {
          test: 'timeoutObject',
        };
        before(() => {
          metrics._pushGatewayTimeoutObject = pushGatewayTimeoutObject;
        });

        it('works as expected', () => {
          metrics.initializePushGateway(true);
          expect(clearTimeoutSpy).to.be.calledOnce;
          expect(clearTimeoutSpy).to.be.calledWith(pushGatewayTimeoutObject);
          expect(pushGatewaySpy).to.be.calledOnce;
          expect(pushGatewaySpy).to.be.calledWith(
            metrics._pushGatewayUrl,
            {timeout: metrics._pushGatewayResponseTimeout}
          );
          expect(pushGatewayPushSpy).to.be.calledOnce;
          expect(pushGatewayPushSpy).to.be.calledWith(
            {jobName: 'annams'},
            metrics.pushGatewayResponseHandler
          );
          expect(setTimeoutSpy).to.be.calledOnce;
          expect(setTimeoutSpy).to.be.calledWith(
            metrics.initializePushGateway,
            metrics._pushGatewayPushInterval
          );
        });
      });
      context('a push gateway doesn\'t exist', () => {
        const pushGatewayTimeoutObject = null;

        before(() => {
          metrics._pushGatewayTimeoutObject = pushGatewayTimeoutObject;
        });

        it('works as expected', () => {
          metrics.initializePushGateway(true);
          expect(clearTimeoutSpy).to.not.be.called;
          expect(pushGatewaySpy).to.be.calledOnce;
          expect(pushGatewayPushSpy).to.be.calledOnce;
          expect(setTimeoutSpy).to.be.calledOnce;
        });
      });
    });

    context('reset !== true || push gateway already initialised', () => {
      let originalPushGateway = null;
      let originalGlobalSetTimeout = null;
      let pushGatewaySpy = null;
      let setTimeoutSpy = null;

      before(() => {
        originalPushGateway = metrics._pushGateway;
        pushGatewaySpy = sinon.spy();
        metrics._pushGateway = {
          push: pushGatewaySpy,
        };

        originalGlobalSetTimeout = global.setTimeout;
        setTimeoutSpy = sinon.spy();
        global.setTimeout = setTimeoutSpy;
      });

      after(() => {
        metrics._pushGateway = originalPushGateway;
        global.setTimeout = originalGlobalSetTimeout;
      });

      afterEach(() => {
        pushGatewaySpy.resetHistory();
        setTimeoutSpy.resetHistory();
      });

      it('works as expected', () => {
        metrics.initializePushGateway(false);
        expect(metrics._pushGateway.push).to.be.calledOnce;
        expect(metrics._pushGateway.push).to.be.calledWith(
          {jobName: 'annams'},
          metrics.pushGatewayResponseHandler
        );
        expect(setTimeoutSpy).to.be.calledOnce;
        expect(setTimeoutSpy).to.be.calledWith(
          metrics.initializePushGateway,
          metrics._pushGatewayPushInterval,
        );
      });
    });
  });

  describe('.pushGatewayResponseHandler', () => {
    context('error response', () => {
      let originalMetricsPushgatewayStatus = null;
      let originalMetricsPushgatewayError = null;

      before(() => {
        originalMetricsPushgatewayStatus = metrics.status.pushGateway;
        metrics.status.pushGateway = null;

        originalMetricsPushgatewayError = metrics.error.pushGateway;
        metrics.error.pushGateway = null;
      });

      after(() => {
        metrics.status.pushGateway = originalMetricsPushgatewayStatus;
        metrics.error.pushGateway = originalMetricsPushgatewayError;
      });

      it('works as expected', () => {
        metrics.pushGatewayResponseHandler({
          message: '_test_error',
        }, null, null);
        expect(metrics.status.pushGateway).to.eql(false);
        expect(metrics.error.pushGateway).to.eql({
          message: '_test_error',
        });
      });
    });

    context('success response', () => {
      let originalMetricsPushgatewayStatus = null;
      let originalMetricsPushgatewayError = null;
      before(() => {
        originalMetricsPushgatewayStatus = metrics.status.pushGateway;
        metrics.status.pushGateway = null;

        originalMetricsPushgatewayError = metrics.error.pushGateway;
        metrics.error.pushGateway = null;
      });

      after(() => {
        metrics.status.pushGateway = originalMetricsPushgatewayStatus;
        metrics.error.pushGateway = originalMetricsPushgatewayError;
      });

      it('works as expected', () => {
        metrics.pushGatewayResponseHandler();
        expect(metrics.status.pushGateway).to.eql(true);
        expect(metrics.error.pushGateway).to.eql(false);
      });
    });
  });

  describe('.registerOperatingSystemMetrics()', () => {
    let metricsCreateGaugeStub = null;
    let originalMetricsOs = null;

    before(() => {
      metricsCreateGaugeStub = sinon.stub(metrics, 'createGauge');
      originalMetricsOs = metrics.os;
      metrics.os = null;
    });

    after(() => {
      metricsCreateGaugeStub.restore();
      metrics.os = originalMetricsOs;
    });

    it('sets the .os property correctly', () => {
      metrics.registerOperatingSystemMetrics();
      expect(metrics.os).to.not.be.null;
      expect(metrics.os).to.have.keys([
        'cpuUsage',
        'freeMemory',
        'loadAvg15',
        'loadAvg5',
        'loadAvg1',
        'processUptime',
        'systemUptime',
      ]);
    });
  });
});
