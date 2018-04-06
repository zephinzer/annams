const Prometheus = require('prom-client');
const expressPromBundle = require('express-prom-bundle');

const collector = require('./collector');

describe('server/metrics/collector', () => {
  beforeEach(() => {
    Prometheus.register.clear();
  });

  it('exports a function', () => {
    expect(collector).to.be.a('function');
  });

  it('has the correct keys', () => {
    expect(collector).to.have.keys([
      '_metrics',
      'clear',
      'options',
    ]);
  });

  it('returns an instance of a metrics collector', () => {
    const collectorInstance = collector();
    Prometheus.register.clear();
    const expressPromBundleInstance = expressPromBundle();
    expect(Object.keys(collectorInstance))
      .to.eql(Object.keys(expressPromBundleInstance));
  });

  describe('.constructor', () => {
    it('returns an object with the required keys', () => {
      const collectorInstance = collector();
      expect(collectorInstance).to.include.keys([
        'metricsMiddleware',
        'metrics',
      ]);
    });

    it('populates the _metrics property', () => {
      collector.clear();
      expect(collector._metrics).to.eql(null);
      collector();
      expect(collector._metrics).to.not.eql(null);
    });
  });

  describe('_metrics', () => {
    beforeEach(() => {
      collector.clear();
    });

    it('holds an instance of expressPromBundle', () => {
      collector();
      Prometheus.register.clear();
      expect(collector._metrics).to.have.keys(
        Object.keys(expressPromBundle())
      );
    });
  });

  describe('.clear()', () => {
    it('sets the _metrics property to null', () => {
      collector._metrics = 1;
      collector.clear();
      expect(collector._metrics).to.eql(null);
    });
  });

  describe('.options', () => {
    it('has the correct keys', () => {
      expect(collector.options).to.have.keys([
        'expressPromBundle',
      ]);
    });

    describe('.expressPrombundle', () => {
      it('has the correct keys and values', () => {
        expect(collector.options.expressPromBundle).to.have.keys([
          'autoregister',
          'includeMethod',
          'includePath',
        ]);
        expect(collector.options.expressPromBundle.autoregister)
          .to.eql(false);
        expect(collector.options.expressPromBundle.includeMethod)
          .to.eql(true);
        expect(collector.options.expressPromBundle.includePath)
          .to.eql(true);
      });
    });
  });
});
