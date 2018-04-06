const metrics = require('./');

describe('server/metrics', () => {
  it('has the correct keys', () => {
    expect(metrics).to.have.keys([
      'route',
      'collector',
    ]);
  });
});
