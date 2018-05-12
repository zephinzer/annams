const express = require('express');

const v1 = require('./');

describe('server/api/v1', () => {
  it('has the correct keys', () => {
    expect(v1).to.have.keys([
      'instance',
      'restfulEntities',
      'getApiComponent',
    ]);
  });

  describe('constructor()', () => {
    context('first call', () => {
      let v1instance;
      let v1restfulEntites;
      let v1getApiComponent;
      let v1getApiComponentMock;
      let v1getApiComponentSpy;

      before(() => {
        v1instance = v1.instance;
        v1restfulEntites = v1.restfulEntities;
        v1getApiComponent = v1.getApiComponent;
        v1getApiComponentSpy = sinon.spy();
        v1getApiComponentMock = (...args) => {
          v1getApiComponentSpy.apply(null, [...args]);
          return ((req, res) => res.json(args[0]));
        };
        sinon.stub(global.console, 'info');
      });

      beforeEach(() => {
        v1.instance = null;
        v1.restfulEntities = ['account'];
        v1.getApiComponent = v1getApiComponentMock;
      });

      after(() => {
        v1.instance = v1instance;
        v1.restfulEntities = v1restfulEntites;
        v1.getApiComponent = v1getApiComponent;
        global.console.info.restore();
      });

      afterEach(() => {
        v1getApiComponentSpy.resetHistory();
      });

      it('returns an Express compatible middleware', () => {
        const server = express();
        const v1router = v1();
        expect(() => server.use(v1router)).to.not.throw();
      });

      it('sets the .instance property', () => {
        expect(v1.instance).to.eql(null);
        v1();
        expect(v1.instance).to.not.eql(null);
      });

      it('calls getApiComponent() correctly', () => {
        v1();
        v1restfulEntites.forEach((v1restfulEntity) => {
          expect(v1getApiComponentSpy).to.be.calledWith(v1restfulEntity);
        });
      });
    });

    context('subsequent calls', () => {
      let v1instance;

      before(() => {
        v1instance = v1.instance;
        v1.instance = '_test_v1_instance';
      });

      after(() => {
        v1.instance = v1instance;
      });

      it('returns the value stored in the .instance property', () => {
        expect(v1()).to.eql(v1.instance);
      });
    });
  });

  describe('.restfulEntities', () => {
    it('contains the correct entities', () => {
      expect(v1.restfulEntities).to.contain('account');
    });
  });

  describe('.getApiComponent', () => {
    before(() => {
      sinon.stub(global.console, 'info');
    });

    after(() => {
      global.console.info.restore();
    });

    it('interfaces with v1 modules in a standardised way', () => {
      expect(() => v1.getApiComponent('account')).to.not.throw();
    });
  });
});
