const knexMock = require('../../test/mocks/knex');
const accountUpdate = require('./update');
const accountUtility = require('./utility');

describe('account/update', () => {
  it('exports a function', () => {
    expect(accountUpdate).to.be.a('function');
  });

  describe('behaviour', () => {
    const validTestUuid = 'e9d6888c-5da9-41a8-aa2d-5bd769346211';
    let update;

    before(() => {
      update = accountUpdate.bind(null, knexMock);
    });

    afterEach(() => {
      knexMock._.resetAll();
    });

    it('throws an error if :userUuid is missing', () => {
      expect(() => update()).to.throw(Error);
      try {
        update();
      } catch (ex) {
        expect(ex.code).to.deep.equal('ERROR_ACCOUNT_FIELD_NOT_FOUND');
      }
    });

    it('throws an error if :userUuid is not a string', () => {
      const testValues = [1, 1.23, {}, true];
      testValues.forEach((testValue) => {
        expect(() => update(testValue)).to.throw(Error);
        try {
          update(testValue);
        } catch (ex) {
          expect(ex.code).to.deep.equal('ERROR_ACCOUNT_FIELD_INVALID');
        }
      });
    });

    it('throws an error if :userUuid is invalid', () => {
      const testValues = [
        '1234567890',
        'abcdefghijklmnopqrstuvwxyz',
        'a1b2c3d4e5f6',
      ];
      testValues.forEach((testValue) => {
        expect(() => update(testValue)).to.throw(Error);
        try {
          update(testValue);
        } catch (ex) {
          expect(ex.code).to.deep.equal('ERROR_ACCOUNT_FIELD_INVALID');
        }
      });
    });

    it('throws an error if :email is specified but invalid', () => {
      const testValues = [1, 1.123, 'a', 'a@b', true, {}, () => {}];
      testValues.forEach((testValue) => {
        expect(() => update(validTestUuid, {email: testValue})).to.throw();
        try {
          update(validTestUuid, {email: testValue});
        } catch (ex) {
          expect(ex.code).to.deep.equal('ERROR_ACCOUNT_FIELD_INVALID');
        }
      });
    });

    it('throws an error if :username is specified but invalid', () => {
      const testValues = [1, 1.123, '$', true, {}, () => {}];
      testValues.forEach((testValue) => {
        expect(() => update(validTestUuid, {username: testValue})).to.throw();
        try {
          update(validTestUuid, {username: testValue});
        } catch (ex) {
          expect(ex.code).to.deep.equal('ERROR_ACCOUNT_FIELD_INVALID');
          expect(ex.message).to.contain('username');
        }
      });
    });

    it('throws an error if :password is specified but invalid', () => {
      const testValues = [1, 1.123, 'a', '1', true, {}, () => {}];
      testValues.forEach((testValue) => {
        expect(() => update(validTestUuid, {password: testValue})).to.throw();
        try {
          update(validTestUuid, {password: testValue});
        } catch (ex) {
          expect(ex.code).to.deep.equal('ERROR_ACCOUNT_FIELD_INVALID');
        }
      });
    });

    describe('functionality', () => {
      const testUpdateData = {
        email: 'valid.test@email.com',
        username: 'abc',
        password: 'aaAA11!!',
      };

      it('calls the database correctly', () => {
        const knexMocked = update(validTestUuid, testUpdateData);
        expect(knexMocked.spy.constructor).to.be.calledOnce;
        expect(knexMocked.spy.where).to.be.calledWithExactly(
          'uuid', '=', validTestUuid
        );
        expect(knexMocked.spy.update).to.be.calledOnce;
        Object.assign(testUpdateData, {
          password:
            accountUtility
              .password
              .hash(testUpdateData.password, validTestUuid),
        });
        expect(knexMocked.spy.update).to.be.calledWith(testUpdateData);
      });

      it('returns updated fields when the promise is resolved', () => {
        const knexMocked = update(validTestUuid, testUpdateData);
        expect(knexMocked.spy.then.args[0][0](1)).to.deep.equal([
          'email', 'username', 'password',
        ]);
      });

      it('throws an error when the database update failed', () => {
        const knexMocked = update(validTestUuid, testUpdateData);
        expect(() => knexMocked.spy.then.args[0][0](0)).to.throw();
      });

      it('also catches the error and checks if account exists', () => {
        const knexMocked = update(validTestUuid, testUpdateData);
        const knexCaught = knexMocked.spy.catch.args[0][0]();
        expect(knexCaught.spy.constructor).to.be.calledOnce;
        expect(knexCaught.spy.constructor).to.be.calledWithExactly('accounts');
        expect(knexCaught.spy.select).to.be.calledOnce;
        expect(knexCaught.spy.select).to.be.calledWithExactly(
          accountUtility.constant.accountSelectSerializer
        );
        expect(knexCaught.spy.where).to.be.calledOnce;
        expect(knexCaught.spy.where).to.be.calledWithExactly(
          'uuid', '=', validTestUuid
        );
        expect(knexCaught.spy.then).to.be.calledOnce;
        expect(() => knexCaught.spy.then.args[0][0](['a'])).to.not.throw();
      });

      it('throws a final error if account is not found', () => {
        const knexMocked = update(validTestUuid, testUpdateData);
        const knexCaught = knexMocked.spy.catch.args[0][0]();
        expect(knexCaught.spy.then).to.be.calledOnce;
        expect(() => knexCaught.spy.then.args[0][0](['a'])).to.not.throw();
      });
    });
  });
});
