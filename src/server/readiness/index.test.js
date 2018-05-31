const express = require('express');
const supertest = require('supertest');

const config = require('../../config')();
const readiness = require('./');

const expressMock = require('../../../test/mocks/express');

describe('server/readiness', () => {
  it('exports a function', () => {
    expect(readiness).to.be.a('function');
  });

  it('has the correct keys', () => {
    expect(readiness).to.have.keys([
      'createMiddleware',
      'createErrorResponse',
    ]);
  });

  describe('.constructor()', () => {
    const testResponse = '_test_readiness_endpoint_response';

    let readinessInstance = null;
    let readinessCreateMiddleware = null;
    let readinessCreateMiddlewareSpy = null;

    before(() => {
      readinessCreateMiddleware = readiness.createMiddleware;
      readinessCreateMiddlewareSpy = sinon.spy();
      readiness.createMiddleware = (...args) => {
        readinessCreateMiddlewareSpy.apply(null, [...args]);
        return (req, res) => res.json(testResponse);
      };
    });

    after(() => {
      readiness.createMiddleware = readinessCreateMiddleware;
    });

    afterEach(() => {
      readinessCreateMiddlewareSpy.resetHistory();
    });

    context('custom endpoint is set', () => {
      const customEndpoint = '/_test_readiness_endpoint_path';

      before(() => {
        readinessInstance = readiness({
          endpointPath: customEndpoint,
        });
      });

      it('works as expected', () => {
        const server = express();
        server.use(readinessInstance);
        return supertest(server)
          .get(customEndpoint)
          .expect(200)
          .then((res) => {
            expect(res.body).to.eql(testResponse);
          });
      });
    });

    context('basic authentication credentials are set', () => {
      let basicAuthPassword = null;
      let basicAuthUsername = null;

      before(() => {
        basicAuthPassword = '_test_readiness_basic_auth_password';
        basicAuthUsername = '_test_readiness_basic_auth_username';
        readinessInstance = readiness({
          basicAuthPassword,
          basicAuthUsername,
        });
      });

      it('rejects requests without basic authentication credentials', () => {
        const server = express();
        server.use(readinessInstance);
        return supertest(server)
          .get(config.endpoint.ready)
          .expect(401);
      });

      it('works as expected', () => {
        const server = express();
        server.use(readinessInstance);
        return supertest(server)
          .get(config.endpoint.ready)
          .auth(basicAuthUsername, basicAuthPassword)
          .expect(200);
      });
    });
  });

  describe('.createMiddleware()', () => {
    let middleware = null;
    let readinessMock = null;
    let readinessSpy = null;

    before(() => {
      sinon.stub(global.console, 'error');
      readinessSpy = {
        getStatus: sinon.spy(),
      };
      readinessMock = {
        getStatus: async (...args) => {
          readinessSpy.getStatus.apply(null, [...args]);
          return new Promise((resolve, reject) => {
            resolve(readinessMock.status);
          });
        },
      };
      middleware = readiness.createMiddleware(readinessMock);
    });

    after(() => {
      global.console.error.restore();
    });

    afterEach(() => {
      global.console.error.resetHistory();
    });

    it('returns a function', () => {
      expect(middleware).to.be.a('function');
    });

    context('errors exist', () => {
      let error = null;
      let status = null;
      let statusProperties = null;

      before(() => {
        error = {
          cache: '_test_cache_error',
          database: '_test_database_error',
          pushGateway: null,
        };
        status = false;
        statusProperties = {error, warning: {}, status};
        Object.assign(readinessMock, statusProperties);
      });

      afterEach(() => {
        expressMock.response._.reset();
      });

      it('logs the correct output to the console', async () => {
        await middleware(expressMock.request, expressMock.response);
        expect(global.console.error).to.be.calledWith(error);
      });

      it('returns the correct headers', async () => {
        await middleware(expressMock.request, expressMock.response);
        expect(expressMock.response.type.spy)
          .to.be.calledWith('application/json');
      });

      it('responds with the correct status code', async () => {
        await middleware(expressMock.request, expressMock.response);
        expect(expressMock.response.status.spy).to.be.calledWith(503);
      });

      it('responds with the correct output', async () => {
        await middleware(expressMock.request, expressMock.response);
        expect(expressMock.response.json.spy)
          .to.be.calledWith({
            cache: {data: '_test_cache_error', status: undefined},
            database: {data: '_test_database_error', status: undefined},
            pushGateway: {data: undefined, status: undefined},
          });
        return true;
      });
    });

    context('warnings exist', () => {
      let statusProperties = null;
      let warning = null;

      before(() => {
        warning = {cache: '_test_cache_warning'};
        statusProperties = {error: {}, warning, status: true};
        Object.assign(readinessMock, statusProperties);
      });

      afterEach(() => {
        expressMock.response._.reset();
      });

      it('returns the correct headers', async () => {
        await middleware(expressMock.request, expressMock.response);
        expect(expressMock.response.type.spy)
          .to.be.calledWith('application/json');
      });

      it('responds with the correct status code', async () => {
        await middleware(expressMock.request, expressMock.response);
        expect(expressMock.response.status.spy).to.be.calledWith(200);
      });

      it('responds with the correct output', async () => {
        await middleware(expressMock.request, expressMock.response);
        expect(expressMock.response.json.spy).to.be.calledWith(warning);
      });
    });

    context('all okay', () => {
      let statusProperties = null;

      before(() => {
        statusProperties = {error: {}, warning: {}, status: true};
        Object.assign(readinessMock, statusProperties);
      });

      afterEach(() => {
        expressMock.response._.reset();
      });

      it('returns the correct headers', async () => {
        await middleware(expressMock.request, expressMock.response);
        expect(expressMock.response.type.spy)
          .to.be.calledWith('application/json');
      });

      it('responds with the correct status code', async () => {
        await middleware(expressMock.request, expressMock.response);
        expect(expressMock.response.status.spy).to.be.calledWith(200);
      });

      it('responds with the correct output', async () => {
        await middleware(expressMock.request, expressMock.response);
        expect(expressMock.response.json.spy).to.be.calledWith('ok');
        return true;
      });
    });
  });

  describe('.createErrorResponse()', () => {
    let readinessProperties = null;

    before(() => {
      readinessProperties = {
        status: {
          cache: false,
          database: false,
          pushGateway: true,
        },
        error: {
          database: '_test_error_database',
          cache: '_test_error_cache',
        },
        warning: {
          pushGateway: '_test_warning_pushGateway',
        },
      };
    });

    it('works as expected', () => {
      const errorResponse = readiness.createErrorResponse(
        readinessProperties
      );
      expect(errorResponse).to.eql({
        cache: {
          status: readinessProperties.status.cache,
          data: readinessProperties.error.cache,
        },
        database: {
          status: readinessProperties.status.database,
          data: readinessProperties.error.database,
        },
        pushGateway: {
          status: readinessProperties.status.pushGateway,
          data: readinessProperties.warning.pushGateway,
        },
      });
    });
  });
});
