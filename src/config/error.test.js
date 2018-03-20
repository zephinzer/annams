const error = require('./error');

describe('config/error', () => {
  let config = null;

  before(() => {
    config = error();
  });

  it('has the correct keys', () => {
    expect(config).to.have.keys([
      'addrinuse',
      'dbnotfound',
    ]);
  });

  describe('.addrinuse', () => {
    it('has the correct keys', () => {
      expect(config.addrinuse).to.have.keys([
        'ttl',
        'interval',
      ]);
    });

    describe('.ttl', () => {
      context('default values', () => {
        before(() => {
          config = error();
        });

        it('has the correct values', () => {
          expect(config.addrinuse.ttl).to.eql(5);
        });
      });

      context('with environment variables', () => {
        before(() => {
          process.env.ERROR_ADDRINUSE_TTL = -5;
          config = error();
        });

        after(() => {
          delete process.env.ERROR_ADDRINUSE_TTL;
        });

        it('has the correct values', () => {
          expect(config.addrinuse.ttl).to.eql(-5);
        });
      });
    });

    describe('.interval', () => {
      context('default values', () => {
        before(() => {
          config = error();
        });

        it('has the correct values', () => {
          expect(config.addrinuse.interval).to.eql(5000);
        });
      });

      context('with environment variables', () => {
        before(() => {
          process.env.ERROR_ADDRINUSE_INTERVAL = -5000;
          config = error();
        });

        after(() => {
          delete process.env.ERROR_ADDRINUSE_INTERVAL;
        });

        it('has the correct values', () => {
          expect(config.addrinuse.interval).to.eql(-5000);
        });
      });
    });
  });

  describe('.dbnotfound', () => {
    it('has the correct keys', () => {
      expect(config.dbnotfound).to.have.keys([
        'ttl',
        'interval',
      ]);
    });

    describe('.ttl', () => {
      context('default values', () => {
        before(() => {
          config = error();
        });

        it('has the correct values', () => {
          expect(config.dbnotfound.ttl).to.eql(15);
        });
      });

      context('with environment variables', () => {
        before(() => {
          process.env.ERROR_DBNOTFOUND_TTL = -15;
          config = error();
        });

        after(() => {
          delete process.env.ERROR_DBNOTFOUND_TTL;
        });

        it('has the correct values', () => {
          expect(config.dbnotfound.ttl).to.eql(-15);
        });
      });
    });

    describe('.interval', () => {
      context('default values', () => {
        before(() => {
          config = error();
        });

        it('has the correct values', () => {
          expect(config.dbnotfound.interval).to.eql(5000);
        });
      });

      context('with environment variables', () => {
        before(() => {
          process.env.ERROR_DBNOTFOUND_INTERVAL = -5000;
          config = error();
        });

        after(() => {
          delete process.env.ERROR_DBNOTFOUND_INTERVAL;
        });

        it('has the correct values', () => {
          expect(config.dbnotfound.interval).to.eql(-5000);
        });
      });
    });
  });
});
