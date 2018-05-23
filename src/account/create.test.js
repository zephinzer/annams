const accountCreate = require('./create');

const knexMock = require('../../test/mocks/knex');

describe.only('account/create', () => {
  it('exports a function', () => {
    expect(accountCreate).to.be.a('function');
  });

  describe('.constructor()', () => {
    beforeEach(() => {
      knexMock._.resetAll();
    });

    it('throws an error if the :email option is not specified', () => {
      expect(() => {
        accountCreate(knexMock);
      }).to.throw();
    });

    it('throws an error if the :email option is invalid', () => {
      expect(() => accountCreate(knexMock, {email: 1})).to.throw();
      expect(() => accountCreate(knexMock, {email: 'a'})).to.throw();
      expect(() => accountCreate(knexMock, {email: 'a@a'})).to.throw();
    });

    it('works as long as a valid email is provided', () => {
      expect(() => {
        const mock = accountCreate(knexMock, {email: 'a@a.com'});
        expect(mock.spy.constructor).to.be.calledOnce;
        expect(mock.spy.constructor).to.be.calledWith('accounts');
        expect(mock.spy.insert).to.be.calledWith({email: 'a@a.com'});
        expect(mock.spy.then.args[0][0]('__test_val')).to.eql('__test_val');
      }).to.not.throw();
    });

    context('when only email is provided', () => {
      it('works as expected', () => {
        const testEmailValue = 'test.email@test-domain.com';
        const insertObject = {
          email: testEmailValue,
        };
        const knexMocked = accountCreate(knexMock, insertObject);
        expect(knexMocked.spy.insert).to.be.calledWith(insertObject);
      });
    });

    context('when username is provided too', () => {
      it('works as expected', () => {
        const testEmailValue = 'test.email@test-domain.com';
        const testUsernameValue = 'test_username';
        const insertObject = {
          email: testEmailValue,
          username: testUsernameValue,
        };
        const knexMocked = accountCreate(knexMock, insertObject);
        expect(knexMocked.spy.insert).to.be.calledWith(insertObject);
      });
    });

    context('when password is provided too', () => {
      it('works as expected', () => {
        const testEmailValue = 'test.email@test-domain.com';
        const testUsernameValue = 'test_username';
        const testPasswordValue = '1234567890aA1!';
        const insertObject = {
          email: testEmailValue,
          username: testUsernameValue,
          password: testPasswordValue,
        };
        const knexMocked = accountCreate(knexMock, insertObject);
        expect(knexMocked.spy.insert).to.be.calledWith(insertObject);
      });
    });
  });
});
