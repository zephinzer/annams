const accountError = require('./index');

describe('account/error', () => {
  it('has the right keys', () => {
    expect(accountError).to.have.keys([
      'accountNotFound',
      'dbOperationFailed',
      'invalidField',
      'invalidSecureField',
      'missingField',
    ]);
  });

  describe('.accountNotFound()', () => {
    it('exports a function', () => {
      expect(accountError.accountNotFound).to.be.a('function');
    });

    it('returns the right properties', () => {
      expect(accountError.accountNotFound().status).to.eql(404);
      expect(accountError.accountNotFound().code)
        .to.eql('ERROR_ACCOUNT_NOT_FOUND');
    });
  });

  describe('.dbOperationFailed()', () => {
    it('exports a function', () => {
      expect(accountError.dbOperationFailed).to.be.a('function');
    });

    it('returns the right properties', () => {
      expect(accountError.dbOperationFailed().status).to.eql(500);
      expect(accountError.dbOperationFailed().code)
        .to.eql('ERROR_ACCOUNT_OPERATION_FAILED');
    });
  });

  describe('.invalidField()', () => {
    it('exports a function', () => {
      expect(accountError.invalidField).to.be.a('function');
    });

    it('returns the right properties', () => {
      expect(accountError.invalidField().status).to.eql(400);
      expect(accountError.invalidField().code)
        .to.eql('ERROR_ACCOUNT_FIELD_INVALID');
    });
  });

  describe('.invalidSecureField()', () => {
    it('exports a function', () => {
      expect(accountError.invalidSecureField).to.be.a('function');
    });

    it('returns the right properties', () => {
      expect(accountError.invalidSecureField().status).to.eql(400);
      expect(accountError.invalidSecureField().code)
        .to.eql('ERROR_ACCOUNT_FIELD_INVALID');
    });
  });

  describe('.missingField()', () => {
    it('exports a function', () => {
      expect(accountError.missingField).to.be.a('function');
    });

    it('returns the right properties', () => {
      expect(accountError.missingField().status).to.eql(400);
      expect(accountError.missingField().code)
        .to.eql('ERROR_ACCOUNT_FIELD_NOT_FOUND');
    });
  });
});
