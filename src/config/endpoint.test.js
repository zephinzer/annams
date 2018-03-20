const endpoint = require('./endpoint');

describe('config/endpoint', () => {
  let config = null;

  before(() => {
    config = endpoint();
  });

  it('has the correct keys', () => {
    expect(config).to.have.keys([
      'live',
      'ready',
      'metrics',
    ]);
  });

  describe('.live', () => {
    context('default value', () => {
      before(() => {
        config = endpoint();
      });

      it('retrieves the correct value', () => {
        expect(config.live).to.eql('/healthz');
      });
    });
    
    context('environment variable set', () => {
      before(() => {
        process.env.ENDPOINT_LIVE = '/__test_endpoint_live';
        config = endpoint();
      });

      after(() => {
        delete process.env.ENDPOINT_LIVE;
      })

      it('retrieves the correct value', () => {
        expect(config.live).to.eql('/__test_endpoint_live');
      });
    });
  });
  
  describe('.ready', () => {
    context('default value', () => {
      before(() => {
        config = endpoint();
      });

      it('retrieves the correct value', () => {
        expect(config.ready).to.eql('/readyz');
      });
    });
    
    context('environment variable set', () => {
      before(() => {
        process.env.ENDPOINT_READY = '/__test_endpoint_ready';
        config = endpoint();
      });

      after(() => {
        delete process.env.ENDPOINT_READY;
      });
      
      it('retrieves the correct value', () => {
        expect(config.ready).to.eql('/__test_endpoint_ready');
      });
    });
  });
  
  describe('.metrics', () => {
    context('default value', () => {
      before(() => {
        config = endpoint();
      });

      it('retrieves the correct value', () => {
        expect(config.metrics).to.eql('/metrics');
      });
    });
    
    context('environment variable set', () => {
      before(() => {
        process.env.ENDPOINT_METRICS = '/__test_endpoint_metrics';
        config = endpoint();
      });

      after(() => {
        delete process.env.ENDPOINT_METRICS;
      });

      it('retrieves the correct value', () => {
        expect(config.metrics).to.eql('/__test_endpoint_metrics');
      });
    });
  });
});
