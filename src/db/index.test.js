const index = require('./index');

describe('db/index', () => {
  it('exports the correct object', () => {
    expect(index).to.eql(require('./db'));
  });
});
