const utility = require('./index');

describe('account/utility', () => {
  it('has the correct keys', () => {
    expect(utility).to.have.keys([
      'constant',
      'validate',
    ]);
  });

  describe('.constant', () => {
    it('has the correct keys', () => {
      expect(utility.constant).to.have.keys([
        'accountSelectSerializer',
        'defaults',
      ]);
    });

    describe('.accountSelectSerializer', () => {
      it('exports the correct values', () => {
        expect(utility.constant.accountSelectSerializer).to.contain('id');
        expect(utility.constant.accountSelectSerializer).to.contain('email');
        expect(utility.constant.accountSelectSerializer).to.contain('uuid');
        expect(utility.constant.accountSelectSerializer).to.contain('username');
      });
    });

    describe('.defaults', () => {
      it('has the correct keys', () => {
        expect(utility.constant.defaults).to.have.keys([
          'offset',
          'limit',
        ]);
      });

      describe('.offset', () => {
        it('exports the correct value', () => {
          expect(utility.constant.defaults.offset).to.eql(0);
        });
      });

      describe('.limit', () => {
        it('exports the correct value', () => {
          expect(utility.constant.defaults.limit).to.eql(20);
        });
      });
    });
  });
});
