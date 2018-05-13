const retrieveAccount = require('./retrieve');

const knexMock = require('../../test/mocks/knex');

describe('account/retrieve', () => {
  it('exports the correct keys', () => {
    expect(retrieveAccount).to.have.keys([
      'getUser',
      'usingEmail',
      'usingUsername',
      'usingUuid',
    ]);
  });

  describe('.constructor()', () => {
    it('throws an error if no :options are set', () => {
      expect(() => {
        retrieveAccount(knexMock);
      }).to.throw();
    });

    context('email is valid', () => {
      before(() => {
        sinon.stub(retrieveAccount, 'usingEmail');
      });

      after(() => {
        retrieveAccount.usingEmail.restore();
      });

      it('works', () => {
        const email = 'abcde@test.com';
        retrieveAccount(knexMock, {email});
        expect(retrieveAccount.usingEmail).to.be.calledOnce;
        expect(retrieveAccount.usingEmail).to.be.calledWith(knexMock, email);
      });
    });

    context('username is valid', () => {
      before(() => {
        sinon.stub(retrieveAccount, 'usingUsername');
      });

      after(() => {
        retrieveAccount.usingUsername.restore();
      });

      it('works', () => {
        const username = 'test_user';
        retrieveAccount(knexMock, {username});
        expect(retrieveAccount.usingUsername).to.be.calledOnce;
        expect(retrieveAccount.usingUsername).to.be.calledWith(knexMock, username); // eslint-disable-line max-len
      });
    });

    context('uuid is valid', () => {
      before(() => {
        sinon.stub(retrieveAccount, 'usingUuid');
      });

      after(() => {
        retrieveAccount.usingUuid.restore();
      });

      it('works', () => {
        const uuid = 'testing-uuid';
        retrieveAccount(knexMock, {uuid});
        expect(retrieveAccount.usingUuid).to.be.calledOnce;
        expect(retrieveAccount.usingUuid).to.be.calledWith(knexMock, uuid);
      });
    });

    context('precedence', () => {
      const email = 'test@domain.com';
      const username = 'testuser';
      const uuid = 'teste-test-test-testtttt';

      before(() => {
        sinon.stub(retrieveAccount, 'usingEmail');
        sinon.stub(retrieveAccount, 'usingUsername');
        sinon.stub(retrieveAccount, 'usingUuid');
      });

      after(() => {
        retrieveAccount.usingEmail.restore();
        retrieveAccount.usingUsername.restore();
        retrieveAccount.usingUuid.restore();
      });

      afterEach(() => {
        retrieveAccount.usingEmail.resetHistory();
        retrieveAccount.usingUsername.resetHistory();
        retrieveAccount.usingUuid.resetHistory();
      });

      it('is given to email', () => {
        retrieveAccount(knexMock, {email, username, uuid});
        expect(retrieveAccount.usingEmail).to.be.calledOnce;
        expect(retrieveAccount.usingUsername).to.not.be.called;
        expect(retrieveAccount.usingUuid).to.not.be.called;
      });

      it('is given to username when email is absent', () => {
        retrieveAccount(knexMock, {username, uuid});
        expect(retrieveAccount.usingEmail).to.not.be.called;
        expect(retrieveAccount.usingUsername).to.be.calledOnce;
        expect(retrieveAccount.usingUuid).to.not.be.called;
      });

      it('is given to uuid when both usernamd and email iare absent', () => {
        retrieveAccount(knexMock, {uuid});
        expect(retrieveAccount.usingEmail).to.not.be.called;
        expect(retrieveAccount.usingUsername).to.not.be.called;
        expect(retrieveAccount.usingUuid).to.be.calledOnce;
      });
    });
  });

  describe('.getUser()', () => {
    it('works', () => {
      let knexMocked;
      knexMocked = retrieveAccount
        .getUser(knexMock, '_key', '_value')
        .then((resolved) => {
          expect(knexMocked.spy.constructor).to.be.calledWith('account');
          expect(knexMocked.spy.select).to.be.calledWith([
            'email',
            'username',
            'uuid',
            'id',
          ]);
          expect(knexMocked.spy.offset).to.be.calledWith(0);
          expect(knexMocked.spy.limit).to.be.calledWith(100);
          expect(knexMocked.spy.where).to.be.calledWith('_key', '=', '_value');
          expect(resolved).to.eql('_then_resolved');
        });
      return knexMocked;
    });
  });

  describe('.usingEmail()', () => {
    before(() => {
      sinon.stub(retrieveAccount, 'getUser');
    });

    after(() => {
      retrieveAccount.getUser.restore();
    });

    it('calls the getUser factory function correctly', () => {
      retrieveAccount.usingEmail('_db', 'someones@email.com');
      expect(retrieveAccount.getUser).to.be.calledWith('_db', 'email', 'someones@email.com'); // eslint-disable-line max-len
    });
  });

  describe('.usingUsername()', () => {
    before(() => {
      sinon.stub(retrieveAccount, 'getUser');
    });

    after(() => {
      retrieveAccount.getUser.restore();
    });

    it('calls the getUser factory function correctly', () => {
      retrieveAccount.usingUsername('_db', 'someone');
      expect(retrieveAccount.getUser).to.be.calledWith('_db', 'username', 'someone'); // eslint-disable-line max-len
    });
  });

  describe('.usingUuid()', () => {
    before(() => {
      sinon.stub(retrieveAccount, 'getUser');
    });

    after(() => {
      retrieveAccount.getUser.restore();
    });

    it('calls the getUser factory function correctly', () => {
      retrieveAccount.usingUuid('_db', 'uuiduuid-uuid-uuid-uuiduuid');
      expect(retrieveAccount.getUser).to.be.calledWith('_db', 'uuid', 'uuiduuid-uuid-uuid-uuiduuid'); // eslint-disable-line max-len
    });
  });
});
