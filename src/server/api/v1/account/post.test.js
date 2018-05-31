const express = require('express');

const apiAccountPost = require('./post');

const expressMock = require('../../../../../test/mocks/express');

describe('server/api/v1/account/post', () => {
  afterEach(() => {
    expressMock.request._.reset();
    expressMock.response._.reset();
    expressMock.next._.reset();
  });

  it('exports a function', () => {
    expect(apiAccountPost).to.be.a('function');
  });

  it('has the corect keys', () => {
    expect(apiAccountPost).to.have.keys([
      'account',
      'constant',
    ]);
  });

  it('exports an express.js compatible middleware', () => {
    const server = express();
    expect(() => {
      server.use(apiAccountPost);
    }).to.not.throw();
  });

  describe('.constant', () => {
    it('has the correct keys', () => {
      expect(apiAccountPost.constant).to.have.keys(['error']);
    });

    describe('.emailNotFound', () => {
      it('has the correct keys', () => {
        expect(apiAccountPost.constant.error).to.have.keys(['emailNotFound']);
      });
    });
  });

  context('request does not have body data', () => {
    it('throws an error', () => {
      expect(() => {
        apiAccountPost(expressMock.request, expressMock.response);
      }).to.throw();
      try {
        apiAccountPost(expressMock.request, expressMock.response);
      } catch (ex) {
        expect(ex.code).to.deep.equal('ERROR_BAD_REQUEST');
      }
    });
  });

  context('body does not contain an "email" property.', () => {
    before(() => {
      expressMock.request.body = {_test: 'a'};
    });

    it('throws an error', () => {
      expect(() => {
        apiAccountPost(expressMock.request, expressMock.response);
      }).to.throw();
      try {
        apiAccountPost(expressMock.request, expressMock.response);
      } catch (ex) {
        expect(ex.code).to.deep.equal('ERROR_BAD_REQUEST');
        expect(ex.message)
          .to.contain(apiAccountPost.constant.error.emailNotFound);
      }
    });
  });

  context('all validations passed', () => {
    let originalAccount;
    let registerSpy;
    let thenSpy;
    let catchSpy;

    before(() => {
      registerSpy = sinon.spy();
      thenSpy = sinon.spy();
      catchSpy = sinon.spy();
      originalAccount = apiAccountPost.account;
      apiAccountPost.account = {
        register: (...args) => {
          registerSpy.apply(null, [...args]);
          return apiAccountPost.account;
        },
        then: (...args) => {
          thenSpy.apply(null, [...args]);
          return apiAccountPost.account;
        },
        catch: (...args) => {
          catchSpy.apply(null, [...args]);
          return apiAccountPost.account;
        },
      };
    });

    after(() => {
      apiAccountPost.account = originalAccount;
    });

    afterEach(() => {
      registerSpy.resetHistory();
      thenSpy.resetHistory();
      catchSpy.resetHistory();
    });

    it('handles the result correctly', () => {
      expressMock.request.body = {email: 'some@email.com'};
      apiAccountPost(
        expressMock.request,
        expressMock.response,
        expressMock.next
      );
      expect(registerSpy).to.be.calledOnce;
      expect(thenSpy).to.be.calledOnce;
      thenSpy.args[0][0]('_test_result');
      expect(expressMock.response.json.spy).to.be.calledOnce;
      expect(expressMock.response.json.spy)
        .to.be.calledWithExactly('_test_result');
    });

    it('handles errors correctly', () => {
      expressMock.request.body = {email: 'some@email.com'};
      apiAccountPost(
        expressMock.request,
        expressMock.response,
        expressMock.next
      );
      expect(catchSpy).to.be.calledOnce;
      catchSpy.args[0][0](new Error('_test_result'));
      expect(expressMock.next.spy).to.be.calledOnce;
      expect(expressMock.next.spy.args[0][0].message)
        .to.contain('_test_result');
    });

    context('only email is provided', () => {
      it('works as expected', () => {
        expressMock.request.body = {email: 'some@email.com'};
        apiAccountPost(expressMock.request, expressMock.response);
        expect(registerSpy).to.be.calledOnce;
        expect(registerSpy).to.be.calledWithExactly(
          expressMock.request.body
        );
      });
    });

    context('email and password is provided', () => {
      it('works as expected', () => {
        expressMock.request.body = {
          email: 'some@email.com',
          password: 'abcdABCD1234!!',
        };
        apiAccountPost(expressMock.request, expressMock.response);
        expect(registerSpy).to.be.calledOnce;
        expect(registerSpy).to.be.calledWithExactly(
          expressMock.request.body
        );
      });
    });

    context('email, username and password is provided', () => {
      it('works as expected', () => {
        expressMock.request.body = {
          email: 'some@email.com',
          username: 'some_username',
          password: 'abcdABCD1234!!',
        };
        apiAccountPost(expressMock.request, expressMock.response);
        expect(registerSpy).to.be.calledOnce;
        expect(registerSpy).to.be.calledWithExactly(
          expressMock.request.body
        );
      });
    });
  });
});
