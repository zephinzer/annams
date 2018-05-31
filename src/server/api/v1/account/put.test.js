const express = require('express');

const apiAccountPut = require('./put');

const expressMock = require('../../../../../test/mocks/express');

describe.only('server/api/v1/account/put', () => {
  afterEach(() => {
    expressMock.request._.reset();
    expressMock.response._.reset();
    expressMock.next._.reset();
  });

  it('exports a function', () => {
    expect(apiAccountPut).to.be.a('function');
  });

  it('has the corect keys', () => {
    expect(apiAccountPut).to.have.keys([
      'account',
      'constant',
    ]);
  });

  it('exports an express.js compatible middleware', () => {
    const server = express();
    expect(() => {
      server.use(apiAccountPut);
    }).to.not.throw();
  });

  describe('.constant', () => {
    it('has the correct keys', () => {
      expect(apiAccountPut.constant).to.have.keys(['error']);
    });

    describe('.uuidNotFound', () => {
      it('has the correct keys', () => {
        expect(apiAccountPut.constant.error).to.have.keys(['uuidNotFound']);
      });
    });
  });

  context('request does not have body data', () => {
    it('throws an error', () => {
      expect(() => {
        apiAccountPut(expressMock.request, expressMock.response);
      }).to.throw();
      try {
        apiAccountPut(expressMock.request, expressMock.response);
      } catch (ex) {
        expect(ex.code).to.deep.equal('ERROR_BAD_REQUEST');
      }
    });
  });

  context('request does not have params data', () => {
    before(() => {
      expressMock.request.body = {_test: 'a'};
    });

    it('throws an error', () => {
      expect(() => {
        apiAccountPut(expressMock.request, expressMock.response);
      }).to.throw();
      try {
        apiAccountPut(expressMock.request, expressMock.response);
      } catch (ex) {
        expect(ex.code).to.deep.equal('ERROR_BAD_REQUEST');
      }
    });
  });

  context('request does not have uuid data in params', () => {
    before(() => {
      expressMock.request.body = {_test: 'a'};
      expressMock.request.params = {_test_params: 'b'};
    });

    it('throws an error', () => {
      expect(() => {
        apiAccountPut(expressMock.request, expressMock.response);
      }).to.throw();
      try {
        apiAccountPut(expressMock.request, expressMock.response);
      } catch (ex) {
        expect(ex.code).to.deep.equal('ERROR_BAD_REQUEST');
      }
    });
  });

  context('all validations passed', () => {
    let originalAccount;
    let updateSpy;
    let thenSpy;
    let catchSpy;

    before(() => {
      updateSpy = sinon.spy();
      thenSpy = sinon.spy();
      catchSpy = sinon.spy();
      originalAccount = apiAccountPut.account;
      apiAccountPut.account = {
        update: (...args) => {
          updateSpy.apply(null, [...args]);
          return apiAccountPut.account;
        },
        then: (...args) => {
          thenSpy.apply(null, [...args]);
          return apiAccountPut.account;
        },
        catch: (...args) => {
          catchSpy.apply(null, [...args]);
          return apiAccountPut.account;
        },
      };
    });

    beforeEach(() => {
      expressMock.request.body = {email: 'a', username: 'b', password: 'c'};
      expressMock.request.params = {uuid: 'd'};
    });

    after(() => {
      apiAccountPut.account = originalAccount;
    });

    afterEach(() => {
      updateSpy.resetHistory();
      thenSpy.resetHistory();
      catchSpy.resetHistory();
    });

    it('works as expected', () => {
      expect(() => {
        apiAccountPut(expressMock.request, expressMock.response);
      }).to.not.throw();
      expect(updateSpy).to.be.calledOnce;
      expect(updateSpy).to.be.calledWithExactly(
        expressMock.request.params.uuid,
        expressMock.request.body
      );
      expect(thenSpy).to.be.calledOnce;
      thenSpy.args[0][0]('_test_results');
      expect(expressMock.response.json.spy).to.be.calledOnce;
      expect(expressMock.response.json.spy).to.be.calledWithExactly(
        '_test_results'
      );
    });

    it('handles errors correctly', () => {
      expect(() => {
        apiAccountPut(
          expressMock.request,
          expressMock.response,
          expressMock.next
        );
      }).to.not.throw();
      expect(catchSpy).to.be.calledOnce;
      catchSpy.args[0][0]({message: '_error_message'});
      expect(expressMock.next.spy).to.be.calledOnce;
      expect(expressMock.next.spy.args[0][0].message)
        .to.contain('_error_message');
    });

    context('account model fails', () => {
      let mockedAccount;

      before(() => {
        mockedAccount = apiAccountPut.account;
        apiAccountPut.account = {
          update: () => {
            throw new Error('_account_error_message');
          },
        };
      });

      after(() => {
        apiAccountPut.account = mockedAccount;
      });

      it('throws an error', () => {
        expect(() => {
          apiAccountPut(expressMock.request, expressMock.response);
        }).to.throw();
        try {
          apiAccountPut(expressMock.request, expressMock.response);
        } catch (ex) {
          expect(ex.message).to.contain('_account_error_message');
        }
      });
    });
  });
});
