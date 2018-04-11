const express = require('express');
const supertest = require('supertest');

const config = require('../../config')();

const cors = require('./cors');

describe('server/utility/cors', () => {
  it('exports a function', () => {
    expect(cors).to.be.a('function');
  });

  it('has the correct keys', () => {
    expect(cors).to.have.keys([
      'corsHandler',
      'initialize',
    ]);
  });

  describe('.constructor()', () => {
    let originalCorsHandler;

    before(() => {
      originalCorsHandler = cors.corsHandler;
      cors.corsHandler = '_test_corsHandler';
    });

    after(() => {
      cors.corsHandler = originalCorsHandler;
    });

    it('returns a singleton instance', () => {
      expect(cors()).to.eql('_test_corsHandler');
    });
  });

  describe('.initialize()', () => {
    context('allowed hosts were set', () => {
      let originalAllowedHosts;
      let server;

      before(() => {
        originalAllowedHosts = config.server.cors.allowed.hosts;
        config.server.cors.allowed.hosts = 'a, b';
        cors.initialize();
        server = express();
        sinon.stub(global.console, 'error');
      });

      after(() => {
        config.server.cors.allowed.hosts = originalAllowedHosts;
        global.console.error.restore();
      });

      it('returns an express compatible middleware', () => {
        expect(() => {
          server.use(cors());
        }).to.not.throw();
      });

      describe('origin possibilities', () => {
        before(() => {
          server.use((req, res) => res.json('ok'));
        });

        context('origin is in the specified allowed hosts', () => {
          it('returns a HTTP 200 OK response', () =>
            Promise.all([
              supertest(server)
                .get('/')
                .set('Origin', 'a')
                .expect(200)
                .expect('"ok"'),
              supertest(server)
                .get('/')
                .set('Origin', 'b')
                .expect(200)
                .expect('"ok"'),
            ])
          );
        });
        context('origin is not defined', () => {
          it('returns a HTTP 200 OK response', () =>
            supertest(server)
              .get('/')
              .expect(200)
              .expect('"ok"')
          );
        });
        context('origin is not in the specified allowed hosts', () => {
          it('returns a HTTP 401 Unauthorized response', () =>
            Promise.all([
              supertest(server)
                .get('/')
                .set('Origin', 'c')
                .expect(401),
              supertest(server)
                .get('/')
                .set('Origin', 'd')
                .expect(401),
            ])
          );
        });
        context('origin is defined but empty', () => {
          it('returns a HTTP 401 Unauthorized response', () =>
            supertest(server)
              .get('/')
              .set('Origin', '')
              .expect(401)
          );
        });
      });
    });

    context('allowed hosts were not set', () => {
      let originalAllowedHosts;
      let server;

      before(() => {
        originalAllowedHosts = config.server.cors.allowed.hosts;
        config.server.cors.allowed.hosts = '';
        cors.initialize();
        server = express();
        sinon.stub(global.console, 'error');
        server.use(cors());
        server.use((req, res) => res.json('ok'));
      });

      after(() => {
        config.server.cors.allowed.hosts = originalAllowedHosts;
        global.console.error.restore();
      });

      it('allows requests from all origins', () =>
        Promise.all([
          supertest(server)
            .get('/')
            .expect(200),
          supertest(server)
            .get('/')
            .set('Origin', '')
            .expect(200),
          supertest(server)
            .get('/')
            .set('Origin', 'http://google.com')
            .expect(200),
        ])
      );
    });
  });
});
