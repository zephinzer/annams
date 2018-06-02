const knexMock = require('../../test/mocks/knex');
const accountUpdate = require('./update');
const accountUtility = require('./utility');

describe('account/update', () => {
  it('exports a function', () => {
    expect(accountUpdate).to.be.a('function');
  });

  it('has the right keys', () => {
    expect(accountUpdate).to.have.keys([
      'utility',
    ]);
  });

  describe('.utility', () => {
    it('has the right keys', () => {
      expect(accountUpdate.utility).to.have.keys([
        'checkAccountWithUuidExists',
        'updateAccountWithUuid',
        'validateUuid',
        'validateEmail',
        'validateUsername',
        'validatePassword',
      ]);
    });

    describe('.checkAccountWithUuidExists()', () => {
      const {checkAccountWithUuidExists} = accountUpdate.utility;
      let knexMocked;

      before(() => {
        knexMocked = checkAccountWithUuidExists(knexMock, '_uuidValue');
      });

      it('calls the correct database', () => {
        expect(knexMocked.spy.constructor).to.be.calledOnce;
        expect(knexMocked.spy.constructor).to.be.calledWithExactly('accounts');
      });

      it('selects with the right values', () => {
        expect(knexMocked.spy.where).to.be.calledOnce;
        expect(knexMocked.spy.where).to.be.calledWithExactly(
          'uuid', '=', '_uuidValue'
        );
      });

      it('selects the correct schema', () => {
        expect(knexMocked.spy.select).to.be.calledOnce;
        expect(knexMocked.spy.select).to.be.calledWithExactly(
          accountUtility.constant.accountSelectSerializer
        );
      });

      it('resolves correctly', () => {
        const resolveWith = knexMocked.spy.then.args[0][0];
        expect(knexMocked.spy.then).to.be.calledOnce;
        expect(() => resolveWith(['a'])).to.throw();
        try {
          resolveWith(['a']);
        } catch (ex) {
          expect(ex.code).to.eql('ERROR_ACCOUNT_OPERATION_FAILED');
        }
      });

      it('throws an error if not account was found', () => {
        const resolveWith = knexMocked.spy.then.args[0][0];
        expect(() => resolveWith([])).to.throw(Error);
        try {
          resolveWith([]);
        } catch (ex) {
          expect(ex.code).to.eql('ERROR_ACCOUNT_NOT_FOUND');
        }
      });
    });

    describe('.updateAccountWithUuid()', () => {
      const {updateAccountWithUuid} = accountUpdate.utility;
      let knexMocked;

      before(() => {
        knexMocked = updateAccountWithUuid(
          knexMock, '_uuidValue', '_updateFields'
        );
      });

      it('calls the correct database', () => {
        expect(knexMocked.spy.constructor).to.be.calledOnce;
        expect(knexMocked.spy.constructor).to.be.calledWithExactly('accounts');
      });

      it('selects with the right values', () => {
        expect(knexMocked.spy.where).to.be.calledOnce;
        expect(knexMocked.spy.where).to.be.calledWithExactly(
          'uuid', '=', '_uuidValue'
        );
      });

      it('updates the right object', () => {
        expect(knexMocked.spy.update).to.be.calledOnce;
        expect(knexMocked.spy.update).to.be.calledWithExactly(
          '_updateFields'
        );
      });
    });

    describe('.validateUuid()', () => {
      const {validateUuid} = accountUpdate.utility;

      context(':userUuid is null', () => {
        it('throws an error', () => {
          expect(() => validateUuid(null)).to.throw(Error);
          try {
            validateUuid(null);
          } catch (ex) {
            expect(ex.code).to.deep.equal('ERROR_ACCOUNT_FIELD_NOT_FOUND');
            expect(ex.message).to.contain('uuid');
          }
        });
      });

      context(':userUuid is not a string', () => {
        const testValues = [1, 1.23, {}, true];

        it('throws an error', () => {
          testValues.forEach((testValue) => {
            expect(() => validateUuid(testValue)).to.throw(Error);
            try {
              validateUuid(testValue);
            } catch (ex) {
              expect(ex.code).to.deep.equal('ERROR_ACCOUNT_FIELD_INVALID');
              expect(ex.message).to.contain('uuid');
            }
          });
        });
      });

      context(':userUuid is an invalid string', () => {
        const testValues = [
          '1234567890',
          'abcdefghijklmnopqrstuvwxyz',
          'a1b2c3d4e5f6',
        ];

        it('throws an error', () => {
          testValues.forEach((testValue) => {
            expect(() => validateUuid(testValue)).to.throw(Error);
            try {
              validateUuid(testValue);
            } catch (ex) {
              expect(ex.code).to.deep.equal('ERROR_ACCOUNT_FIELD_INVALID');
              expect(ex.message).to.contain('uuid');
            }
          });
        });
      });
    });

    describe('.validateEmail()', () => {
      const {validateEmail} = accountUpdate.utility;

      context(':email is specified but invalid', () => {
        const testValues = [1, 1.123, 'a', 'a@b', true, {}, () => {}];

        it('throws an error', () => {
          testValues.forEach((testValue) => {
            expect(() => validateEmail(testValue)).to.throw();
            try {
              validateEmail(testValue);
            } catch (ex) {
              expect(ex.code).to.deep.equal('ERROR_ACCOUNT_FIELD_INVALID');
              expect(ex.message).to.contain('email');
            }
          });
        });
      });
    });

    describe('.validateUsername()', () => {
      const {validateUsername} = accountUpdate.utility;

      context(':username is specified but invalid', () => {
        const testValues = [1, 1.123, '$', true, {}, () => {}];

        it('throws an error', () => {
          testValues.forEach((testValue) => {
            expect(() => validateUsername(testValue)).to.throw();
            try {
              validateUsername(testValue);
            } catch (ex) {
              expect(ex.code).to.deep.equal('ERROR_ACCOUNT_FIELD_INVALID');
              expect(ex.message).to.contain('username');
            }
          });
        });
      });
    });

    describe('.validatePassword()', () => {
      const {validatePassword} = accountUpdate.utility;

      context(':password is specified but invalid', () => {
        const testValues = [1, 1.123, 'a', '1', true, {}, () => {}];

        it('throws an error', () => {
          testValues.forEach((testValue) => {
            expect(() => validatePassword(testValue)).to.throw();
            try {
              validatePassword(testValue);
            } catch (ex) {
              expect(ex.code).to.deep.equal('ERROR_ACCOUNT_FIELD_INVALID');
              expect(ex.message).to.contain('password');
            }
          });
        });
      });
    });
  });

  describe('behaviour (integration test)', () => {
    const validTestUuid = 'e9d6888c-5da9-41a8-aa2d-5bd769346211';
    const testUpdateData = {
      email: 'valid.test@email.com',
      username: 'abc',
      password: 'aaAA11!!',
    };
    let update;

    before(() => {
      update = accountUpdate.bind(null, knexMock);
    });

    afterEach(() => {
      knexMock._.resetAll();
    });

    context('validation checks', () => {
      let validateUuid;
      let validateEmail;
      let validateUsername;
      let validatePassword;

      before(() => {
        validateUuid = sinon.stub(accountUpdate.utility, 'validateUuid');
        validateEmail = sinon.stub(accountUpdate.utility, 'validateEmail');
        validateUsername =
          sinon.stub(accountUpdate.utility, 'validateUsername');
        validatePassword =
          sinon.stub(accountUpdate.utility, 'validatePassword');
      });

      after(() => {
        validateUuid.restore();
        validateEmail.restore();
        validateUsername.restore();
        validatePassword.restore();
      });

      it('runs', () => {
        update(validTestUuid, testUpdateData);
        expect(validateUuid).to.be.calledOnce;
        expect(validateEmail).to.be.calledOnce;
        expect(validateUsername).to.be.calledOnce;
        expect(validatePassword).to.be.calledOnce;
      });
    });

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

    it('resolves with updated fields if update was successful', () => {
      const testDataFields = ['email', 'username', 'password'];
      const knexMocked = update(validTestUuid, testUpdateData);
      expect(knexMocked.spy.then.args[0][0](1)).to.deep.equal(testDataFields);
      expect(knexMocked.spy.then.args[1][0](testDataFields))
        .to.deep.equal(testDataFields);
    });

    it('resolves with null if update was not successful', () => {
      const knexMocked = update(validTestUuid, testUpdateData);
      expect(knexMocked.spy.then.args[0][0](0)).to.eql(null);
    });

    context('update not successful', () => {
      let checkAccountWithUuidExists;

      before(() => {
        checkAccountWithUuidExists =
          sinon.stub(accountUpdate.utility, 'checkAccountWithUuidExists');
      });

      after(() => {
        checkAccountWithUuidExists.restore();
      });

      it('checks if account exists', () => {
        const knexMocked = update(validTestUuid, testUpdateData);
        knexMocked.spy.then.args[1][0](null);
        expect(checkAccountWithUuidExists).to.be.calledOnce;
      });
    });
  });
});
