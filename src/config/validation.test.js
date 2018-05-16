const validation = require('./validation');

describe('config/validation', () => {
  it('has the correct keys', () => {
    expect(validation()).to.have.keys(['password']);
  });

  describe('.password', () => {
    it('has the correct keys', () => {
      expect(validation().password).to.have.keys([
        'length',
        'has',
      ]);
    });

    describe('length', () => {
      it('has reasonable defaults', () => {
        delete process.env.VALIDATION_PASSWORD_LENGTH;
        const testValidation = validation();
        expect(testValidation.password.length).to.eql(8);
      });

      it('draws correctly from the process.env', () => {
        process.env.VALIDATION_PASSWORD_LENGTH = '0';
        let testValidation = validation();
        expect(testValidation.password.length).to.eql(0);
        process.env.VALIDATION_PASSWORD_LENGTH = '16';
        testValidation = validation();
        expect(testValidation.password.length).to.eql(16);
        // we don't really expect passwords to be > 100 in length,
        // but just incase...
        process.env.VALIDATION_PASSWORD_LENGTH = '100';
        testValidation = validation();
        expect(testValidation.password.length).to.eql(100);
      });
    });

    describe('.has', () => {
      it('has the correct keys', () => {
        expect(validation().password.has).to.have.keys([
          'specials',
          'numbers',
          'casings',
        ]);
      });

      describe('.specials', () => {
        it('has reasonable defaults', () => {
          delete process.env.VALIDATION_PASSWORD_HAS_SPECIALS;
          const testValidation = validation();
          expect(testValidation.password.has.specials).to.eql(true);
        });

        it('draws correctly from the process.env', () => {
          process.env.VALIDATION_PASSWORD_HAS_SPECIALS = 'false';
          let testValidation = validation();
          expect(testValidation.password.has.specials).to.eql(false);
          process.env.VALIDATION_PASSWORD_HAS_SPECIALS = 'true';
          testValidation = validation();
          expect(testValidation.password.has.specials).to.eql(true);
        });
      });

      describe('.numbers', () => {
        it('has reasonable defaults', () => {
          delete process.env.VALIDATION_PASSWORD_HAS_NUMBERS;
          const testValidation = validation();
          expect(testValidation.password.has.numbers).to.eql(true);
        });

        it('draws correctly from the process.env', () => {
          process.env.VALIDATION_PASSWORD_HAS_NUMBERS = 'false';
          let testValidation = validation();
          expect(testValidation.password.has.numbers).to.eql(false);
          process.env.VALIDATION_PASSWORD_HAS_NUMBERS = 'true';
          testValidation = validation();
          expect(testValidation.password.has.numbers).to.eql(true);
        });
      });

      describe('.casings', () => {
        it('has reasonable defaults', () => {
          delete process.env.VALIDATION_PASSWORD_HAS_CASINGS;
          const testValidation = validation();
          expect(testValidation.password.has.casings).to.eql(true);
        });

        it('draws correctly from the process.env', () => {
          process.env.VALIDATION_PASSWORD_HAS_CASINGS = 'false';
          let testValidation = validation();
          expect(testValidation.password.has.casings).to.eql(false);
          process.env.VALIDATION_PASSWORD_HAS_CASINGS = 'true';
          testValidation = validation();
          expect(testValidation.password.has.casings).to.eql(true);
        });
      });
    });
  });
});
