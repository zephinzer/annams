const express = require('express');
const supertest = require('supertest');

const serverApiAccount = require('./index');

describe('server/api/v1/account', () => {
  it('exports a function', () => {
    expect(serverApiAccount).to.be.a('function');
  });

  it('returns an express compatible middleware', () => {
    const server = express();
    expect(() => {
      server.use(serverApiAccount());
    }).to.not.throw();
    return supertest(server)
      .head('/_account')
      .expect(418);
  });

  describe('routes', () => {
    let serverApiAccountInstance;

    before(() => {
      serverApiAccountInstance = serverApiAccount();
    });

    it('handles POST /account', () => {
      expect(serverApiAccountInstance.stack.find((endpoint) => {
        return endpoint.route.path === '/account'
          && endpoint.route.methods.post === true;
      })).to.not.be.undefined;
    });

    it('handles DELETE /account/:uuid', () => {
      expect(serverApiAccountInstance.stack.find((endpoint) => {
        return endpoint.route.path === '/account/:uuid'
          && endpoint.route.methods.delete === true;
      })).to.not.be.undefined;
    });

    it('handles GET /accounts', () => {
      expect(serverApiAccountInstance.stack.find((endpoint) => {
        return endpoint.route.path === '/accounts'
          && endpoint.route.methods.get === true;
      })).to.not.be.undefined;
    });

    it('handles GET /account/:identifier', () => {
      expect(serverApiAccountInstance.stack.find((endpoint) => {
        return endpoint.route.path === '/account/:identifier'
          && endpoint.route.methods.get === true;
      })).to.not.be.undefined;
    });

    it('handles PUT /account/:uuid', () => {
      expect(serverApiAccountInstance.stack.find((endpoint) => {
        return endpoint.route.path === '/account/:uuid'
          && endpoint.route.methods.put === true;
      })).to.not.be.undefined;
    });

    it('handles PATCH /account/:accountId', () => {
      expect(serverApiAccountInstance.stack.find((endpoint) => {
        return endpoint.route.path === '/account/:accountId'
          && endpoint.route.methods.patch === true;
      })).to.not.be.undefined;
    });
  });
});
