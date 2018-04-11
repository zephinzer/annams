const utility = require('./');

describe('server/utility', () => {
  it('has the correct keys', () => {
    expect(utility).to.have.keys([
      'basicAuth',
      'cors',
    ]);
  });
});
