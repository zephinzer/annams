const express = require('express');
const supertest = require('supertest');
const basicAuth = require('./basic-auth');

describe('server/utility/basic-auth', () => {
  it('exports a function', () => {
    expect(basicAuth).to.be.a('function');
  });

  describe('.constructor()', () => {
    context('no arguments provided', () => {
      it('returns an express compatible middleware that does no authentication', () => { // eslint-disable-line max-len
        const server = express();
        server.use(basicAuth());
        server.use((req, res) => res.json('ok'));
        return supertest(server)
          .get('/')
          .expect(200)
          .then((res) => {
            expect(res.body).to.eql('ok');
          });
      });
    });

    context('arguments are provided', () => {
      it('returns an express compatible middleware that implements basic auth', () => { // eslint-disable-line max-len
        const server = express();
        server.use(basicAuth('a', 'b'));
        server.use((req, res) => res.json('ok'));
        return Promise.all([
          supertest(server)
            .get('/')
            .expect(401),
          supertest(server)
            .get('/')
            .auth('a', 'b')
            .expect(200)
            .then((res) => expect(res.body).to.eql('ok')),
        ]);
      });
    });
  });
});
