const component = require('./validate');

describe('server/api/utility/validate', () => {
  it('has the right keys', () => {
    expect(component).to.have.keys([
      'requestHasBody',
    ]);
  });

  describe('.requestHasBody()', () => {
    it('returns false if request is any thing other than an object', () => {
      expect(component.requestHasBody()).to.be.false;
      expect(component.requestHasBody(1)).to.be.false;
      expect(component.requestHasBody(1.213)).to.be.false;
      expect(component.requestHasBody('a')).to.be.false;
      expect(component.requestHasBody(() => {})).to.be.false;
      expect(component.requestHasBody(null)).to.be.false;
    });

    it('returns false if body is an empty object', () => {
      expect(component.requestHasBody({body: {}})).to.be.false;
    });

    it('works as expected', () => {
      expect(component.requestHasBody({body: {a: 1}})).to.be.true;
    });
  });
});
