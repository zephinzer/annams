const serverApiAccountGetId = require('./get-id');

const expressMock = require('../../../../../test/mocks/express');

describe('server/api/v1/account/get-id', () => {
  it('exports a function', () => {
    expect(serverApiAccountGetId).to.be.a('function');
  });

  it('has the right keys', () => {
    expect(serverApiAccountGetId).to.have.keys([
      'account',
      'validateAndRetrieveIdentifier',
    ]);
  });

  describe('.constructor()', () => {
    const testRetrieveData = {_test_key: '_test_retrieve_data'};
    const testRetrievedResults = {_test_key: '_test_retrieved_results'};
    let accountSpy = {};
    let original = {};
    let validateAndRetrieveIdentifier;

    before(() => {
      original.validateAndRetrieveIdentifier =
        serverApiAccountGetId.validateAndRetrieveIdentifier;
      validateAndRetrieveIdentifier = sinon.spy();
      serverApiAccountGetId.validateAndRetrieveIdentifier = (...args) => {
        validateAndRetrieveIdentifier.apply(null, [...args]);
        return testRetrieveData;
      };
      original.account = serverApiAccountGetId.account;
      accountSpy.retrieve = sinon.spy();
      accountSpy.then = sinon.spy();
      serverApiAccountGetId.account = {
        retrieve: (...args) => {
          accountSpy.retrieve.apply(null, [...args]);
          return serverApiAccountGetId.account;
        },
        then: (...args) => {
          accountSpy.then.apply(null, [...args]);
          return serverApiAccountGetId.account;
        },
      };
    });

    after(() => {
      serverApiAccountGetId.account = original.account;
    });

    afterEach(() => {
      validateAndRetrieveIdentifier.resetHistory();
      expressMock.response._.reset();
      expressMock.request._.reset();
    });

    it('works as expected', () => {
      expressMock.request.params.identifier = '_test_identifier';
      serverApiAccountGetId(expressMock.request, expressMock.response);

      expect(validateAndRetrieveIdentifier).to.be.calledOnce;
      expect(validateAndRetrieveIdentifier).to.be.calledWithExactly(
        expressMock.request.params.identifier
      );

      expect(accountSpy.retrieve).to.be.calledOnce;

      expect(accountSpy.then).to.be.calledOnce;
      accountSpy.then.args[0][0](testRetrievedResults);
      expect(expressMock.response.json.spy).to.be.calledOnce;
      expect(expressMock.response.json.spy)
        .to.be.calledWithExactly(testRetrievedResults);
    });
  });

  describe('.validateAndRetrieveIdentifier', () => {
    const {validateAndRetrieveIdentifier} = serverApiAccountGetId;
    const validTestUuid = '0a4c1f4a-1060-41f7-a103-a47733c8a819';
    const validTestId = 54321;

    it('returns an ID if a valid ID identifier was provided', () => {
      expect(validateAndRetrieveIdentifier(validTestId))
        .to.eql({id: validTestId});
    });

    it('returns a UUID if a valid UUID identifier was provided', () => {
      expect(validateAndRetrieveIdentifier(validTestUuid))
        .to.eql({uuid: validTestUuid});
    });

    it('throws an error if provided value is not an ID or UUID', () => {
      expect(() => validateAndRetrieveIdentifier()).to.throw();
      try {
        validateAndRetrieveIdentifier(4123.4123);
      } catch (ex) {
        expect(ex.message).to.contain('4123.4123');
      }
    });
  });
});
