const uuidv4 = require('uuid/v4');

const retrieveAccount = require('./retrieve');
const accountUtility = require('./utility');

const knexMock = require('../../test/mocks/knex');

describe('account/retrieve', () => {
  it('exports the correct keys', () => {
    expect(retrieveAccount).to.have.keys([
      'getUser',
      'usingId',
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
        const uuid = uuidv4();
        retrieveAccount(knexMock, {uuid});
        expect(retrieveAccount.usingUuid).to.be.calledOnce;
        expect(retrieveAccount.usingUuid).to.be.calledWith(knexMock, uuid);
      });
    });

    context('precedence', () => {
      const id = '123456789';
      const username = 'testuser';
      const uuid = uuidv4();

      before(() => {
        sinon.stub(retrieveAccount, 'usingId');
        sinon.stub(retrieveAccount, 'usingUsername');
        sinon.stub(retrieveAccount, 'usingUuid');
      });

      after(() => {
        retrieveAccount.usingId.restore();
        retrieveAccount.usingUsername.restore();
        retrieveAccount.usingUuid.restore();
      });

      afterEach(() => {
        retrieveAccount.usingId.resetHistory();
        retrieveAccount.usingUsername.resetHistory();
        retrieveAccount.usingUuid.resetHistory();
      });

      it('is given to id', () => {
        retrieveAccount(knexMock, {id, username, uuid});
        expect(retrieveAccount.usingUsername).to.not.be.called;
        expect(retrieveAccount.usingUuid).to.not.be.called;
      });

      it('is given to username when id is absent', () => {
        retrieveAccount(knexMock, {username, uuid});
        expect(retrieveAccount.usingId).to.not.be.called;
        expect(retrieveAccount.usingUsername).to.be.calledOnce;
        expect(retrieveAccount.usingUuid).to.not.be.called;
      });

      it('is given to uuid when both usernamd and email iare absent', () => {
        retrieveAccount(knexMock, {uuid});
        expect(retrieveAccount.usingId).to.not.be.called;
        expect(retrieveAccount.usingUsername).to.not.be.called;
        expect(retrieveAccount.usingUuid).to.be.calledOnce;
      });
    });
  });

  describe('.getUser()', () => {
    beforeEach(() => {
      knexMock._.resetAll();
    });

    it('works', (done) => {
      let knexMocked;
      knexMocked = retrieveAccount
        .getUser(knexMock, '_key', '_value')
        .then((resolved) => {
          expect(knexMocked.spy.constructor).to.be.calledWith('accounts');
          expect(knexMocked.spy.select)
            .to.be.calledWith(accountUtility.constant.accountSelectSerializer);
          expect(knexMocked.spy.where).to.be.calledWith('_key', '=', '_value');
          expect(resolved).to.eql('_then_resolved');
          done();
        });
      knexMocked.spy.then.args[0][0]('_then_resolved');
    });
  });

  describe('.usingId()', () => {
    before(() => {
      sinon.stub(retrieveAccount, 'getUser');
    });

    after(() => {
      retrieveAccount.getUser.restore();
    });

    it('calls the getUser factory function correctly', () => {
      retrieveAccount.usingId('_db', '123456789');
      expect(retrieveAccount.getUser).to.be.calledWith('_db', 'id', '123456789'); // eslint-disable-line max-len
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
