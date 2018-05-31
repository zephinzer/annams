const account = require('./index');

describe('account', () => {
  it('has the right keys', () => {
    expect(account).to.be.an('object');
    expect(account).to.have.keys([
      'create',
      'retrieve',
      'query',
      'update',
    ]);
  });
});
