const express = require('express');

const supertest = require('supertest');

const security = require('./');

describe('server/security', () => {
  it('has the correct keys', () => {
    expect(security).have.keys([
      'connect',
    ]);
  });

  describe('.constructor(:serverInstance)', () => {
    it('works as expected', () => {
      const secureServer = security(); // security();
      secureServer.use('/', (req, res) => res.json('ok'));
      return supertest(secureServer)
        .get('/')
        .then((res) => {
          console.info(res.headers);
          expect(res.headers['x-powered-by']).to.be.undefined;
          expect(res.headers['x-dns-prefetch-control']).to.eql('off');
          expect(res.headers['x-xss-protection']).to.eql('1; mode=block');
          expect(res.headers['x-content-type-options']).to.eql('nosniff');
          expect(res.headers['cache-control']).to.eql('no-store, no-cache, must-revalidate, proxy-revalidate'); // eslint-disable-line max-len
          expect(res.headers['x-download-options']).to.eql('noopen');
          expect(res.headers['strict-transport-security']).to.contain('includeSubDomains'); // eslint-disable-line max-len
          expect(res.headers['x-frame-options']).to.eql('SAMEORIGIN');
        });
    });

    context(':serverInstance specified', () => {
      before(() => {
        sinon.stub(security, 'connect');
      });

      after(() => {
        security.connect.restore();
      });

      it('uses the provided server instance', () => {
        security('_serverInstance');
        expect(security.connect).to.be.calledWith('_serverInstance');
      });
    });

    context('no :serverInstance specified', () => {
      it('instantiates a new express instance', () => {
        let securityInstance;
        expect(() => {
          securityInstance = security();
        }).to.not.throw();
        expect(Object.getPrototypeOf(securityInstance))
          .to.eql(Object.getPrototypeOf(express()));
      });
    });
  });
});
