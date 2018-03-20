const metrics = require('./metrics');

describe('config/metrics', () => {
  let config = null;

  before(() => {
    config = metrics();
  });

  it('has the correct keys', () => {
    expect(config).to.have.keys([
      'interval',
      'pushgateway',
    ]);
  });

  describe('.interval', () => {
    context('default values', () => {
      before(() => {
        config = metrics();
      });

      it('has the correct values', () => {
        expect(config.interval).to.eql(5000);
      });
    });

    context('environment variables set', () => {
      before(() => {
        process.env.METRICS_INTERVAL = -5000;
        config = metrics();
      });

      after(() => {
        delete process.env.METRICS_INTERVAL;
      });

      it('has the corect values', () => {
        expect(config.interval).to.eql(-5000);
      });
    });
  });

  describe('.pushgateway', () => {
    it('has the correct keys', () => {
      expect(config.pushgateway).to.have.keys([
        'host',
        'port',
        'timeout',
        'interval',
      ]);
    });

    describe('.host', () => {
      context('default values', () => {
        before(() => {
          config = metrics();
        });

        it('has the correct values', () => {
          expect(config.pushgateway.host).to.eql('http://localhost');
        });
      });

      context('environment variables set', () => {
        before(() => {
          process.env.METRICS_PUSHGATEWAY_HOST = 'unknown://host';
          config = metrics();
        });

        after(() => {
          delete process.env.METRICS_PUSHGATEWAY_HOST;
        });

        it('has the corect values', () => {
          expect(config.pushgateway.host).to.eql('unknown://host');
        });
      });
    });

    describe('.port', () => {
      context('default values', () => {
        before(() => {
          config = metrics();
        });

        it('has the correct values', () => {
          expect(config.pushgateway.port).to.eql('19091');
        });
      });

      context('environment variables set', () => {
        before(() => {
          process.env.METRICS_PUSHGATEWAY_PORT = '987654321';
          config = metrics();
        });

        after(() => {
          delete process.env.METRICS_PUSHGATEWAY_PORT;
        });

        it('has the corect values', () => {
          expect(config.pushgateway.port).to.eql('987654321');
        });
      });
    });

    describe('.timeout', () => {
      context('default values', () => {
        before(() => {
          config = metrics();
        });

        it('has the correct values', () => {
          expect(config.pushgateway.timeout).to.eql(10000);
        });
      });

      context('environment variables set', () => {
        before(() => {
          process.env.METRICS_PUSHGATEWAY_TIMEOUT = -10000;
          config = metrics();
        });

        after(() => {
          delete process.env.METRICS_PUSHGATEWAY_TIMEOUT;
        });

        it('has the corect values', () => {
          expect(config.pushgateway.timeout).to.eql(-10000);
        });
      });
    });

    describe('.interval', () => {
      context('default values', () => {
        before(() => {
          config = metrics();
        });

        it('has the correct values', () => {
          expect(config.pushgateway.interval).to.eql(5000);
        });
      });

      context('environment variables set', () => {
        before(() => {
          process.env.METRICS_PUSHGATEWAY_INTERVAL = -5000;
          config = metrics();
        });

        after(() => {
          delete process.env.METRICS_PUSHGATEWAY_INTERVAL;
        });

        it('has the corect values', () => {
          expect(config.pushgateway.interval).to.eql(-5000);
        });
      });
    });
  });
});
