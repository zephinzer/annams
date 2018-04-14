const express = require('express');
const supertest = require('supertest');

const apiUtility = require('./');

describe('server/api/utility', () => {
  it('has the correct keys', () => {
    expect(apiUtility).to.have.keys([
      'initializeRouter',
      'Route',
    ]);
  });

  describe('.initializeRouter()', () => {
    let testRoutes;

    before(() => {
      sinon.stub(global.console, 'info');
      testRoutes = [
        new apiUtility.Route('GET', '/', (_, r) => r.json(1)),
        new apiUtility.Route('GET', '/2', (_, r) => r.json(2)),
        new apiUtility.Route('POST', '/3', (_, r) => r.json(3)),
        new apiUtility.Route('PUT', '/4', (_, r) => r.json(4)),
        new apiUtility.Route('PATCH', '/5', (_, r) => r.json(5)),
        new apiUtility.Route('DELETE', '/6', (_, r) => r.json(6)),
      ];
    });

    after(() => {
      global.console.info.restore();
    });

    it('returns an express compatible middleware', () => {
      const server = express();
      const router = apiUtility.initializeRouter();
      expect(() => server.use(router)).to.not.throw();
    });

    it('works as expected', () => {
      const server = express();
      server.use(apiUtility.initializeRouter(testRoutes));
      return Promise.all([
        supertest(server)
          .get('/').expect(200).then((r) => expect(r.body).to.eql(1)),
        supertest(server)
          .get('/2').expect(200).then((r) => expect(r.body).to.eql(2)),
        supertest(server)
          .post('/3').expect(200).then((r) => expect(r.body).to.eql(3)),
        supertest(server)
          .put('/4').expect(200).then((r) => expect(r.body).to.eql(4)),
        supertest(server)
          .patch('/5').expect(200).then((r) => expect(r.body).to.eql(5)),
        supertest(server)
          .delete('/6').expect(200).then((r) => expect(r.body).to.eql(6)),
      ]);
    });
  });

  describe('.Route()', () => {
    it('returns a Route instance', () => {
      const route = new apiUtility.Route();
      expect(route).to.be.instanceOf(apiUtility.Route);
    });

    it('has the correct properties', () => {
      const route = new apiUtility.Route();
      expect(route).to.have.keys([
        'handler',
        'method',
        'path',
      ]);
    });

    it('has the correct defaults', () => {
      const route = new apiUtility.Route();
      expect(route.handler()).to.eql(null);
      expect(route.method).to.eql('GET');
      expect(route.path).to.eql('/');
    });
  });
});
