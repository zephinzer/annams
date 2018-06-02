const express = require('express');
const expressZipkinInstrumentation = require('express-zipkin-instrumentation');

const config = require('../../config')();

const expressMock = require('../../../test/mocks/express');

const serverTracer = require('./');

describe('server/tracer', () => {
  it('has the correct keys', () => {
    expect(serverTracer).to.have.keys([
      '_instance',
      'getTraceId',
    ]);
  });

  it('exports a function', () => {
    expect(serverTracer).to.be.a('function');
  });

  describe('.constructor()', () => {
    it('returns a singleton instance', () => {
      const originalInstance = serverTracer._instance;
      serverTracer._instance = '_test_instance';
      expect(serverTracer()).to.eql('_test_instance');
      serverTracer._instance = originalInstance;
    });

    context('zipkin is disabled via configuration', () => {
      let zipkinEnabledStatus;

      before(() => {
        zipkinEnabledStatus = config.server.tracing.zipkin.enabled;
        config.server.tracing.zipkin.enabled = false;
        expressMock.request._.reset();
        expressMock.response._.reset();
        expressMock.next._.reset();
      });

      after(() => {
        config.server.tracing.zipkin.enabled = zipkinEnabledStatus;
        expressMock.request._.reset();
        expressMock.response._.reset();
        expressMock.next._.reset();
      });

      it('returns a pass through express middleware', () => {
        const server = express();
        const middleware = serverTracer();
        expect(() => server.use(middleware)).to.not.throw();
        middleware(expressMock.request, expressMock.response, expressMock.next);
        expect(expressMock.next.spy).to.be.calledOnce;
      });
    });

    context('zipkin is enabled via configuration', () => {
      let zipkinEnabledStatus;

      before(() => {
        zipkinEnabledStatus = config.server.tracing.zipkin.enabled;
        config.server.tracing.zipkin.enabled = true;
      });

      after(() => {
        config.server.tracing.zipkin.enabled = zipkinEnabledStatus;
      });

      it('returns an express compatible middleware', () => {
        const server = express();
        const middleware = serverTracer();
        expect(() => server.use(middleware)).to.not.throw();
      });
    });
  });

  describe('.getTraceId()', () => {
    it('is an alias for the express-zipkin-instrumentation .getTraceId method', () => { // eslint-disable-line max-len
      expect(serverTracer.getTraceId)
        .to.eql(expressZipkinInstrumentation.getTraceId);
    });
  });
});
