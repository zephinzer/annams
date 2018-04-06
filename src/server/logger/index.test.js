const logger = require('./index');

describe('server/logger', () => {
  it('has the correct keys', () => {
    expect(logger).to.have.keys([
      'incoming',
      'outgoing',
      'requestId',
    ]);
  });
});
