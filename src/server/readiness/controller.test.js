const config = require('../../config')();

const readinessController = require('./controller');

describe('server/readiness/controller', () => {
  it('exports the correct keys', () => {
    expect(readinessController).to.have.keys([
      'status',
      'error',
      'warning',
      'getStatus',
      'getRedisStatus',
      'getMySqlStatus',
      'getPrometheusPushGatewayStatus',
    ]);
  });

  describe('.status', () => {
    it('has the correct keys', () => {
      expect(readinessController.status).to.have.keys([
        'database',
        'cache',
        'pushGateway',
      ]);
    });
  });

  describe('.error', () => {
    it('has the correct keys', () => {
      expect(readinessController.error).to.have.keys([
        'database',
        'cache',
      ]);
    });
  });

  describe('.warning', () => {
    it('has the correct keys', () => {
      expect(readinessController.warning).to.have.keys([
        'pushGateway',
      ]);
    });
  });

  describe('.getStatus()', () => {
    let originalProperties = {};
    let originalPropertiesSpy = {};

    before(() => {
      originalProperties.getRedisStatus = readinessController.getRedisStatus;
      originalPropertiesSpy.getRedisStatus = sinon.spy();
      readinessController.getRedisStatus = (...args) => {
        originalPropertiesSpy.getRedisStatus
          .apply(null, [...args]);
        return new Promise((resolve, reject) => resolve());
      };

      originalProperties.getMySqlStatus = readinessController.getMySqlStatus;
      originalPropertiesSpy.getMySqlStatus = sinon.spy();
      readinessController.getMySqlStatus = (...args) => {
        originalPropertiesSpy.getMySqlStatus
          .apply(null, [...args]);
        return new Promise((resolve, reject) => resolve());
      };

      originalProperties.getPrometheusPushGatewayStatus =
        readinessController.getPrometheusPushGatewayStatus;
      originalPropertiesSpy.getPrometheusPushGatewayStatus = sinon.spy();
      readinessController.getPrometheusPushGatewayStatus = (...args) => {
        originalPropertiesSpy.getPrometheusPushGatewayStatus
          .apply(null, [...args]);
        return new Promise((resolve, reject) => resolve());
      };
    });

    after(() => {
      readinessController.getRedisStatus = originalProperties.getRedisStatus;
      readinessController.getMySqlStatus = originalProperties.getMySqlStatus;
      readinessController.getPrometheusPushGatewayStatus =
        originalProperties.getPrometheusPushGatewayStatus;
    });

    afterEach(() => {
      Object.keys(originalPropertiesSpy).forEach((key) => {
        originalPropertiesSpy[key].resetHistory();
      });
    });

    it('works as expected', () => {
      return readinessController
        .getStatus()
        .then((res) => {
          expect(res).to.eql(true);
          expect(originalPropertiesSpy.getMySqlStatus)
            .to.be.calledOnce;
          expect(originalPropertiesSpy.getRedisStatus)
            .to.be.calledOnce;
          expect(originalPropertiesSpy.getPrometheusPushGatewayStatus)
            .to.be.calledOnce;
        });
    });
  });

  describe('.getRedisStatus()', () => {
    const {getRedisStatus} = readinessController;

    it('has the correct keys', () => {
      expect(getRedisStatus).to.have.keys([
        'options',
        'getClient',
        'getErrorHandler',
        'getSuccessHandler',
      ]);
    });

    describe('.options', () => {
      it('is a function', () => {
        expect(getRedisStatus.options).to.be.a('function');
      });

      it('returns the correct object', () => {
        const options = getRedisStatus.options();
        expect(options).to.have.keys(['host', 'port']);
        expect(options.host).to.eql(config.cache.host);
        expect(options.port).to.eql(config.cache.port);
      });
    });

    describe('.getClient()', () => {
      before(() => {
        sinon.stub(getRedisStatus, 'options');
      });

      after(() => {
        getRedisStatus.options.restore();
      });

      it('is a function', () => {
        expect(getRedisStatus.getClient).to.be.a('function');
      });

      it('gets the correct options', () => {
        getRedisStatus.getClient();
        expect(getRedisStatus.options).to.be.calledOnce;
      });
    });

    describe('.getErrorHandler()', () => {
      let connectionTestMock = null;
      let callbackMock = null;

      before(() => {
        connectionTestMock = {
          quit: sinon.spy(),
          unref: sinon.spy(),
        };
        callbackMock = sinon.spy();
      });

      afterEach(() => {
        connectionTestMock.quit.resetHistory();
        connectionTestMock.unref.resetHistory();
        callbackMock.resetHistory();
      });

      it('is a function', () => {
        expect(getRedisStatus.getErrorHandler).to.be.a('function');
      });

      it('sets the correct status and error values', () => {
        const errorMock = '_test_cache_error';
        getRedisStatus
          .getErrorHandler(connectionTestMock, callbackMock)(errorMock);
        expect(readinessController.status.cache).to.eql(false);
        expect(readinessController.error.cache).to.eql(errorMock);
      });

      it('properly shuts down the test connection', () => {
        getRedisStatus.getErrorHandler(connectionTestMock, callbackMock)();
        expect(connectionTestMock.quit).to.be.calledOnce;
        expect(connectionTestMock.unref).to.be.calledOnce;
      });

      it('handles the callback correctly', () => {
        const errorMock = '_test_cache_error';
        getRedisStatus
          .getErrorHandler(connectionTestMock, callbackMock)(errorMock);
        expect(callbackMock).to.be.calledWith({
          level: 'error',
          data: errorMock,
        });
      });
    });

    describe('.getSuccessHandler()', () => {
      let connectionTestMock = null;
      let callbackMock = null;

      before(() => {
        connectionTestMock = {
          quit: sinon.spy(),
          unref: sinon.spy(),
        };
        callbackMock = sinon.spy();
      });

      afterEach(() => {
        connectionTestMock.quit.resetHistory();
        connectionTestMock.unref.resetHistory();
        callbackMock.resetHistory();
      });

      it('is a function', () => {
        expect(getRedisStatus.getSuccessHandler).to.be.a('function');
      });

      it('sets the correct status and error values', () => {
        getRedisStatus.getSuccessHandler(connectionTestMock, callbackMock)();
        expect(readinessController.status.cache).to.eql(true);
        expect(readinessController.error.cache).to.eql(false);
      });

      it('properly shuts down the test connection', () => {
        getRedisStatus.getSuccessHandler(connectionTestMock, callbackMock)();
        expect(connectionTestMock.quit).to.be.calledOnce;
        expect(connectionTestMock.unref).to.be.calledOnce;
      });

      it('handles the callback correctly', () => {
        getRedisStatus.getSuccessHandler(connectionTestMock, callbackMock)();
        expect(callbackMock).to.be.calledOnce;
      });
    });
  });

  describe('.getMySqlStatus()', () => {
    it('has the correct keys', () => {
      expect(readinessController.getMySqlStatus).to.have.keys([
        'testCommand',
        'getClient',
        'getHandler',
        'options',
      ]);
    });

    describe('.testCommand', () => {
      it('is correct', () => {
        expect(readinessController.getMySqlStatus.testCommand)
          .to.eql('SELECT 1+1;');
      });
    });

    describe('.getClient()', () => {
      before(() => {
        sinon.stub(readinessController.getMySqlStatus, 'options');
      });

      after(() => {
        readinessController.getMySqlStatus.options.restore();
      });

      it('gets the correct options', () => {
        expect(readinessController.getMySqlStatus.getClient).to.throw();
        expect(readinessController.getMySqlStatus.options)
          .to.be.calledOnce;
      });
    });

    describe('.getHandler()', () => {
      let connectionTestMock = null;
      let rejectMock = null;
      let resolveMock = null;

      before(() => {
        connectionTestMock = {
          close: sinon.spy(),
        };
        rejectMock = sinon.spy();
        resolveMock = sinon.spy();
      });

      it('returns a function', () => {
        expect(readinessController.getMySqlStatus.getHandler())
          .to.be.a('function');
      });

      context('when an error occurs', () => {
        const errorMock = {_test: '_error'};
        let handler = null;

        before(() => {
          handler =
            readinessController.getMySqlStatus.getHandler(
              connectionTestMock, resolveMock, rejectMock
            );
          handler(errorMock);
        });

        after(() => {
          connectionTestMock.close.resetHistory();
          rejectMock.resetHistory();
          resolveMock.resetHistory();
        });

        it('sets the state of the component correctly', () => {
          expect(readinessController.status.database).to.eql(false);
          expect(readinessController.error.database).to.eql(errorMock);
        });

        it('closes the test connection', () => {
          expect(connectionTestMock.close).to.be.calledOnce;
        });

        it('rejects the promise correctly', () => {
          expect(rejectMock).to.be.calledOnce;
          expect(rejectMock).to.be.calledWith({
            level: 'error',
            data: errorMock,
          });
        });
      });

      context('when no errors are reported', () => {
        let handler = null;

        before(() => {
          handler =
            readinessController.getMySqlStatus.getHandler(
              connectionTestMock, resolveMock, rejectMock
            );
          handler(null);
        });

        after(() => {
          connectionTestMock.close.resetHistory();
          rejectMock.resetHistory();
          resolveMock.resetHistory();
        });

        it('sets the state of the component correctly', () => {
          expect(readinessController.status.database).to.eql(true);
          expect(readinessController.error.database).to.eql(false);
        });

        it('closes the test connection', () => {
          expect(connectionTestMock.close).to.be.calledOnce;
        });

        it('resolves the promise correctly', () => {
          expect(resolveMock).to.be.calledOnce;
          expect(resolveMock).to.be.calledWith();
        });
      });
    });

    describe('.options()', () => {
      it('is a function', () => {
        expect(readinessController.getMySqlStatus.options)
          .to.be.a('function');
      });

      it('retrieves the correct values from the configuration', () => {
        const options = readinessController.getMySqlStatus.options();
        expect(options).to.have.keys([
          'host',
          'port',
          'user',
          'password',
          'database',
        ]);
        expect(options.host).to.eql(config.database.host);
        expect(options.port).to.eql(config.database.port);
        expect(options.user).to.eql(config.database.auth.username);
        expect(options.password).to.eql(config.database.auth.password);
        expect(options.database).to.eql(config.database.name);
      });
    });
  });

  describe('.getPrometheusPushGatewayStatus()', () => {
    it('is a function', () => {
      expect(readinessController.getPrometheusPushGatewayStatus)
        .to.be.a('function');
    });

    it('exports the correct keys', () => {
      expect(readinessController.getPrometheusPushGatewayStatus)
        .to.have.keys([
          'getMetrics',
        ]);
    });

    describe('.constructor()', () => {
      context('metrics component has errors', () => {
        let getMetrics = null;
        let getMetricsSpy = null;
        const error = {
          pushGateway: '_test_error_pushGateway',
        };

        before(() => {
          getMetricsSpy = sinon.spy();
          getMetrics =
            readinessController.getPrometheusPushGatewayStatus.getMetrics;
          readinessController.getPrometheusPushGatewayStatus.getMetrics
            = (...args) => {
              getMetricsSpy.apply(null, [...args]);
              return ({error});
            };
        });

        after(() => {
          readinessController.getPrometheusPushGatewayStatus.getMetrics
            = getMetrics;
        });

        afterEach(() => {
          getMetricsSpy.resetHistory();
        });

        it('sets the state correctly', () => {
          return readinessController.getPrometheusPushGatewayStatus()
            .catch(() => {
              expect(getMetricsSpy).to.be.calledOnce;
              expect(readinessController.status.pushGateway).to.eql(false);
              expect(readinessController.warning.pushGateway)
                .to.eql(error.pushGateway);
            });
        });

        it('rejects the promise with the correct parameters', () => {
          return readinessController.getPrometheusPushGatewayStatus()
            .catch((err) => {
              expect(getMetricsSpy).to.be.calledOnce;
              expect(err).to.eql({
                level: 'warning',
                data: error.pushGateway,
              });
            });
        });
      });

      context('metrics component has no errors', () => {
        let getMetrics = null;
        let getMetricsSpy = null;
        const successResponse = {
          error: {
            pushGateway: null,
          },
        };

        before(() => {
          getMetricsSpy = sinon.spy();
          getMetrics =
            readinessController.getPrometheusPushGatewayStatus.getMetrics;
          readinessController.getPrometheusPushGatewayStatus.getMetrics
            = (...args) => {
              getMetricsSpy.apply(null, [...args]);
              return (successResponse);
            };
        });

        after(() => {
          readinessController.getPrometheusPushGatewayStatus.getMetrics
            = getMetrics;
        });

        afterEach(() => {
          getMetricsSpy.resetHistory();
        });

        it('sets the state correctly', () => {
          return readinessController.getPrometheusPushGatewayStatus()
            .then(() => {
              expect(getMetricsSpy).to.be.calledOnce;
              expect(readinessController.status.pushGateway).to.eql(true);
              expect(readinessController.warning.pushGateway)
                .to.eql(false);
            });
        });

        it('rejects the promise with the correct parameters', () => {
          return readinessController.getPrometheusPushGatewayStatus()
            .then((res) => {
              expect(getMetricsSpy).to.be.calledOnce;
              expect(res).to.be.undefined;
            });
        });
      });
    });
  });
});
