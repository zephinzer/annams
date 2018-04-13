const express = require('express');

const api = require('./');

describe('server/api', () => {
  it('exports a function', () => {
    expect(api).to.be.a('function');
  });

  it('has the correct keys', () => {
    expect(api).to.have.keys([
      'middleware',
      'reset',
      'v1',
      'versionMatcher',
    ]);
  });

  it('returns an express compatible middleware', () => {
    const server = express();
    expect(() => server.use(api())).to.not.throw();
  });

  describe('.reset()', () => {
    let originalMiddleware;

    before(() => {
      originalMiddleware = api.middleware;
      api.middleware = '_test_api_middleware';
    });

    after(() => {
      api.middleware = originalMiddleware;
    });

    it('resets the middleware singleton instance', () => {
      expect(api.middleware).to.not.eql(null);
      api.reset();
      expect(api.middleware).to.eql(null);
    });
  });

  describe('.versionMatcher', () => {
    it('works as expected', () => {
      expect('v1'.match(api.versionMatcher)).to.not.eql(null);
      expect('v9'.match(api.versionMatcher)).to.not.eql(null);
      expect('v0'.match(api.versionMatcher)).to.not.eql(null);
      expect('v10'.match(api.versionMatcher)).to.not.eql(null);
      expect('v99'.match(api.versionMatcher)).to.not.eql(null);
      expect('v'.match(api.versionMatcher)).to.eql(null);
      expect('0'.match(api.versionMatcher)).to.eql(null);
      expect('va'.match(api.versionMatcher)).to.eql(null);
      expect('vA'.match(api.versionMatcher)).to.eql(null);
      expect('vz'.match(api.versionMatcher)).to.eql(null);
      expect('vZ'.match(api.versionMatcher)).to.eql(null);
      expect('v*'.match(api.versionMatcher)).to.eql(null);
      expect('v-'.match(api.versionMatcher)).to.eql(null);
    });
  });
});
