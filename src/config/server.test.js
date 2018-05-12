const server = require('./server');

describe('config/server', () => {
  let config = null;

  before(() => {
    config = server();
  });

  it('has the correct keys', () => {
    expect(config).to.have.keys([
      'bind',
      'cors',
      'log',
      'port',
      'tracing',
    ]);
  });

  describe('.bind', () => {
    it('has the correct keys', () => {
      expect(config.bind).to.have.keys([
        'address',
      ]);
    });

    describe('.address', () => {
      context('default value', () => {
        before(() => {
          config = server();
        });

        it('has the correct value', () => {
          expect(config.bind.address).to.eql('0.0.0.0');
        });
      });

      context('environment variable set', () => {
        before(() => {
          process.env.SERVER_BIND_ADDRESS = '255.255.255.255';
          config = server();
        });

        after(() => {
          delete process.env.SERVER_BIND_ADDRESS;
        });

        it('has the correct value', () => {
          expect(config.bind.address).to.eql('255.255.255.255');
        });
      });
    });
  });

  describe('.cors', () => {
    it('has the correct keys', () => {
      expect(config.cors).to.have.keys([
        'allowed',
      ]);
    });

    describe('.allowed', () => {
      it('has the correct keys', () => {
        expect(config.cors.allowed).to.have.keys([
          'hosts',
          'methods',
        ]);
      });

      describe('.hosts', () => {
        context('default value', () => {
          before(() => {
            config = server();
          });

          it('has the correct value', () => {
            expect(config.cors.allowed.hosts).to.eql([]);
          });
        });

        context('environment variable set', () => {
          before(() => {
            process.env.SERVER_CORS_ALLOWED_HOSTS = '_a,_b,_c';
            config = server();
          });

          after(() => {
            delete process.env.SERVER_CORS_ALLOWED_HOSTS;
          });

          it('has the correct value', () => {
            expect(config.cors.allowed.hosts).to.eql(['_a', '_b', '_c']);
          });
        });
      });

      describe('.methods', () => {
        context('default value', () => {
          before(() => {
            config = server();
          });

          it('has the correct value', () => {
            expect(config.cors.allowed.methods).to.eql([]);
          });
        });

        context('environment variable set', () => {
          before(() => {
            process.env.SERVER_CORS_ALLOWED_METHODS = '_GET,_POST,_PUT';
            config = server();
          });

          after(() => {
            delete process.env.SERVER_CORS_ALLOWED_METHODS;
          });

          it('has the correct value', () => {
            expect(config.cors.allowed.methods)
              .to.eql(['_GET', '_POST', '_PUT']);
          });
        });
      });
    });
  });

  describe('.log', () => {
    it('has the correct keys', () => {
      expect(config.log).to.have.keys([
        'enabled',
        'level',
        'pretty',
      ]);
    });

    describe('.enabled', () => {
      context('default value', () => {
        before(() => {
          config = server();
        });

        it('has the correct value', () => {
          expect(config.log.enabled).to.eql(true);
        });
      });

      context('environment variable set', () => {
        before(() => {
          process.env.SERVER_LOG_ENABLED = '0';
          config = server();
        });

        after(() => {
          delete process.env.SERVER_LOG_ENABLED;
        });

        it('has the correct value', () => {
          expect(config.log.enabled).to.eql(false);
        });
      });
    });

    describe('.level', () => {
      context('default value', () => {
        before(() => {
          config = server();
        });

        it('has the correct value', () => {
          expect(config.log.level).to.eql('trace');
        });
      });

      context('environment variable set', () => {
        before(() => {
          process.env.SERVER_LOG_LEVEL = '_test_level';
          config = server();
        });

        after(() => {
          delete process.env.SERVER_LOG_LEVEL;
        });

        it('has the correct value', () => {
          expect(config.log.level).to.eql('_test_level');
        });
      });
    });

    describe('.pretty', () => {
      context('default value', () => {
        before(() => {
          config = server();
        });

        it('has the correct value', () => {
          expect(config.log.pretty).to.eql(true);
        });
      });

      context('environment variable set', () => {
        before(() => {
          process.env.SERVER_LOG_LEVEL = '1';
          config = server();
        });

        after(() => {
          delete process.env.SERVER_LOG_LEVEL;
        });

        it('has the correct value', () => {
          expect(config.log.pretty).to.eql(true);
        });
      });
    });
  });

  describe('.port', () => {
    context('default value', () => {
      before(() => {
        config = server();
      });

      it('has the correct value', () => {
        expect(config.port).to.eql(10000);
      });
    });

    context('environment variable set', () => {
      before(() => {
        process.env.SERVER_PORT = '87654321';
        config = server();
      });

      after(() => {
        delete process.env.SERVER_PORT;
      });

      it('has the correct value', () => {
        expect(config.port).to.eql('87654321');
      });
    });
  });

  describe('.tracing', () => {
    it('has the correct keys', () => {
      expect(config.tracing).to.have.keys('zipkin');
    });

    describe('.zipkin', () => {
      it('has the correct keys', () => {
        expect(config.tracing.zipkin).to.have.keys([
          'enabled',
          'hostname',
        ]);
      });

      describe('.enabled', () => {
        context('default value', () => {
          before(() => {
            config = server();
          });

          it('has the correct value', () => {
            expect(config.tracing.zipkin.enabled).to.eql(true);
          });
        });

        context('environment variable set', () => {
          before(() => {
            process.env.SERVER_TRACING_ZIPKIN_ENABLED = 'NO';
            config = server();
          });

          after(() => {
            delete process.env.SERVER_TRACING_ZIPKIN_ENABLED;
          });

          it('has the correct value', () => {
            expect(config.tracing.zipkin.enabled).to.eql(false);
          });
        });
      });

      describe('.hostname', () => {
        context('default value', () => {
          before(() => {
            config = server();
          });

          it('has the correct value', () => {
            expect(config.tracing.zipkin.hostname).to.eql('http://localhost:19411');
          });
        });

        context('environment variable set', () => {
          before(() => {
            process.env.SERVER_TRACING_ZIPKIN_HOSTNAME = 'protocol://test:12345';
            config = server();
          });

          after(() => {
            delete process.env.SERVER_TRACING_ZIPKIN_HOSTNAME;
          });

          it('has the correct value', () => {
            expect(config.tracing.zipkin.hostname).to.eql('protocol://test:12345');
          });
        });
      });
    });
  });
});
