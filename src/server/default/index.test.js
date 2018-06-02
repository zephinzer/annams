const serverDefault = require('./index');

const expressMock = require('../../../test/mocks/express');

describe('server/default', () => {
  it('exports an object', () => {
    expect(serverDefault).to.be.an('object');
  });

  it('has the "connect" key', () => {
    expect(serverDefault).to.have.key('connect');
  });

  describe('.connect()', () => {
    let get;
    before(() => {
      get = sinon.spy();
    });

    it('adds a GET / which returns HTTP 200 and "ok"', () => {
      serverDefault.connect({
        get,
      });
      expect(get).to.be.calledOnce;
      expect(get).to.be.calledWith('/');
      get.args[0][1](expressMock.request, expressMock.response);
      expect(expressMock.response.type.spy)
        .to.be.calledWithExactly('application/json');
      expect(expressMock.response.status.spy)
        .to.be.calledWithExactly(200);
      expect(expressMock.response.json.spy)
        .to.be.calledWithExactly('ok');
    });
  });
});
