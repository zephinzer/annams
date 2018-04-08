const express = require('express');
const supertest = require('supertest');

const config = require('../../config')();

const liveness = require('./');

describe('server/liveness', () => {
  it('is a function', () => {
    expect(liveness).to.be.a('function');
  });

  it('returns an Express Router', () => {
    const livenessHandler = liveness(
      '/_test_liveness_endpoint',
      'username',
      'password',
    );
    expect(Object.getPrototypeOf(livenessHandler)
    ).to.eql(Object.getPrototypeOf(new express.Router()));
  });

  describe('.constructor()', () => {
    let livenessInstance = null;

    context('custom endpoint is set', () => {
      const customEndpoint = '/_test_liveness_endpoint_path';

      before(() => {
        livenessInstance = liveness({
          endpointPath: customEndpoint,
        });
      });

      it('works as expected', () => {
        const server = express();
        server.use(livenessInstance);
        return supertest(server)
          .get(customEndpoint)
          .expect(200)
          .then((res) => {
            expect(res.body).to.eql('ok');
          });
      });
    });

    context('basic authentication credentials are set', () => {
      let basicAuthPassword = null;
      let basicAuthUsername = null;

      before(() => {
        basicAuthPassword = '_test_liveness_basic_auth_password';
        basicAuthUsername = '_test_liveness_basic_auth_username';
        livenessInstance = liveness({
          basicAuthPassword,
          basicAuthUsername,
        });
      });

      it('rejects requests without basic authentication credentials', () => {
        const server = express();
        server.use(livenessInstance);
        return supertest(server)
          .get(config.endpoint.live)
          .expect(401);
      });

      it('works as expected', () => {
        const server = express();
        server.use(livenessInstance);
        return supertest(server)
          .get(config.endpoint.live)
          .auth(basicAuthUsername, basicAuthPassword)
          .expect(200);
      });
    });
  });
});
