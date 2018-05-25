const express = require('express');
const supertest = require('supertest');

const serverSerializer = require('./');

describe('server/serializer', () => {
  it('exports a function', () => {
    expect(serverSerializer).to.be.a('function');
  });

  it('has the correct keys', () => {
    expect(serverSerializer).to.have.keys([
      'instance',
      'options',
    ]);
  });

  it('returns an Express compatible middleware', () => {
    const server = express();
    expect(() => {
      server.use(serverSerializer());
    }).to.not.throw();
  });

  it('works as expected', (done) => {
    const expectedData = {
      just: 'a test',
      with: 123456789,
      and: true,
      or: 123.123,
      alsoWith: {
        objects: 'like this',
      },
    };
    const server = express();
    server.use(serverSerializer());
    server.post('/', (req, res) => {
      expect(req.body).to.eql(expectedData);
      res.status(200).end();
      done();
    });
    supertest(server)
      .post('/')
      .send(expectedData)
      .set('Content-Type', 'application/json')
      .expect(200)
      .end();
  });

  describe('.instance', () => {
    it('is populated on calling the function', () => {
      serverSerializer.instance = null;
      serverSerializer();
      expect(serverSerializer.instance).to.not.eql(null);
    });
  });

  describe('.options', () => {
    it('is correct', () => {
      expect(serverSerializer.options).to.have.keys([
        'type',
      ]);
    });
  });
});
