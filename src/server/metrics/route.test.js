const express = require('express');
const Prometheus = require('prom-client');
const supertest = require('supertest');

const config = require('../../config');

const route = require('./route');

describe('server/metrics/route', () => {
  let routeInstance = null;

  before(() => {
    Prometheus.register.clear();
    routeInstance = route();
  });

  it('returns an express-compatible middleware', () => {
    const server = express();
    expect(() => {
      server.use(routeInstance);
    }).to.not.throw();
    return supertest(server)
      .get(config().endpoint.metrics)
      .expect('Content-Type', 'text/plain')
      .expect(200);
  });

  context('custom endpoint set', () => {
    const customEndpoint = '/_test_metrics_route_custom_endpoint';

    before(() => {
      routeInstance = route({
        endpointPath: customEndpoint,
      });
    });

    it('rejects requests without basic authentication credentials', () => {
      const server = express();
      server.use(routeInstance);
      return supertest(server)
        .get(config().endpoint.metrics)
        .expect(404);
    });

    it('works as expected', () => {
      const server = express();
      server.use(routeInstance);
      return supertest(server)
        .get('/_test_metrics_route_custom_endpoint')
        .expect(200);
    });
  });

  context('basic auth set', () => {
    const basicAuthUsername = '_test_basic_auth_username';
    const basicAuthPassword = '_test_basic_auth_password';

    before(() => {
      routeInstance = route({
        basicAuthUsername,
        basicAuthPassword,
      });
    });

    it('works as expected', () => {
      const server = express();
      server.use(routeInstance);
      return Promise.all([
        supertest(server)
          .get(config().endpoint.metrics)
          .expect(401),
        supertest(server)
          .get(config().endpoint.metrics)
          .auth(basicAuthUsername, basicAuthPassword)
          .expect(200),
      ]);
    });
  });
});
