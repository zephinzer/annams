const utility = require('./utility');

describe('account/utility', () => {
  it('has the correct keys', () => {
    expect(utility).to.have.keys([
      'validate',
    ]);
  });
});
