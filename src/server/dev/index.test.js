const express = require('express');
const path = require('path');
const supertest = require('supertest');

const devMiddleware = require('./index');

describe('server/dev', () => {
  it('exports a function', () => {
    expect(devMiddleware).to.be.a('function');
  });

  it('has the right keys', () => {
    expect(devMiddleware).to.have.keys([
      'constant',
    ]);
  });

  describe('.constant', () => {
    it('has the right keys', () => {
      expect(devMiddleware.constant).to.have.keys([
        'coveragePath',
        'middlewarePath',
      ]);
    });
  });

  describe('constructor()', () => {
    it('returns an express router', () => {
      expect(Object.getPrototypeOf(devMiddleware()))
        .to.eql(Object.getPrototypeOf(new express.Router()));
    });

    context('.constant.coveragePath exists', () => {
      let originalCoveragePath;

      before(() => {
        originalCoveragePath = devMiddleware.constant.coveragePath;
        devMiddleware.constant.coveragePath = __filename;
      });

      after(() => {
        devMiddleware.constant.coveragePath = originalCoveragePath;
      });

      it('registers the .constant.middlewarePath', () => {
        const server = express();
        server.use(devMiddleware());
        return supertest(server)
          .get('/dev/coverage')
          .expect(200);
      });
    });

    context('.constant.coveragePath does not exist', () => {
      let originalCoveragePath;

      before(() => {
        originalCoveragePath = devMiddleware.constant.coveragePath;
        devMiddleware.constant.coveragePath = path.join('/nope/', __filename);
      });

      after(() => {
        devMiddleware.constant.coveragePath = originalCoveragePath;
      });

      it('does not register .constant.middlewarePath', () => {
        const server = express();
        server.use(devMiddleware());
        return supertest(server)
          .get('/dev/coverage')
          .expect(404);
      });
    });
  });
});
