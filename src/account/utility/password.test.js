const fs = require('fs');
const path = require('path');
const passwordUtility = require('./password');

describe.only('account/utility/password', () => {
  const hashSnapshotHelloWorld =
    fs.readFileSync(
      path.join(__dirname, '../../../test/resources/password.hash')
    ).toString().trim();
  const testPassword = require('../../../test/resources/password.json');
  const {password, salt} = testPassword;

  it('has the right keys', () => {
    expect(passwordUtility).to.have.keys([
      'hash',
      'verify',
      'constant',
    ]);
  });

  describe('.hash()', () => {
    it('creates a hash given a plaintext string and a salt', () => {
      expect(() => {
        passwordUtility.hash(password, salt).toString();
      }).to.not.throw();
    });

    it('creates a base64 hash', () => {
      const hash = passwordUtility.hash(password, salt);
      expect(hash.toString('base64')).to.eql(hash);
    });

    it('creates a hash with the right length', () => {
      expect(
        Buffer.from(passwordUtility.hash(password, salt), 'base64')
      ).to.have.length(passwordUtility.constant.PBKDF2_KEY_LENGTH);
    });
  });

  describe('.verify()', () => {
    it('works as expected', () => {
      const passwordHash = passwordUtility.hash(password, salt);
      expect(
        passwordUtility
          .verify(salt, password, passwordHash.toString())
      ).to.be.true;
    });
  });

  describe('.constant', () => {
    it('has the right keys', () => {
      expect(passwordUtility.constant).to.have.keys([
        'PBKDF2_DIGEST',
        'PBKDF2_ITERATIONS',
        'PBKDF2_KEY_LENGTH',
      ]);
    });

    describe('.PBKDF2_DIGEST', () => {
      let original = {};

      before(() => {
        original.PBKDF2_DIGEST = passwordUtility.constant.PBKDF2_DIGEST;
      });

      after(() => {
        passwordUtility.constant.PBKDF2_DIGEST = original.PBKDF2_DIGEST;
      });

      it('has the correct value', () => {
        expect(passwordUtility.constant.PBKDF2_DIGEST).to.eql('sha512');
      });

      it('will cause the .verify() function to fail if changed', () => {
        const passwordHash = passwordUtility.hash(password, salt);
        expect(passwordHash).to.eql(hashSnapshotHelloWorld);
        expect(passwordUtility.verify(salt, password, passwordHash))
          .to.be.true;
        passwordUtility.constant.PBKDF2_DIGEST = 'sha256';
        expect(passwordUtility.verify(salt, password, passwordHash))
          .to.be.false;
      });
    });

    describe('.PBKDF2_ITERATIONS', () => {
      let original = {};

      before(() => {
        original.PBKDF2_ITERATIONS = passwordUtility.constant.PBKDF2_ITERATIONS;
      });

      after(() => {
        passwordUtility.constant.PBKDF2_ITERATIONS = original.PBKDF2_ITERATIONS;
      });

      it('has the correct value', () => {
        expect(passwordUtility.constant.PBKDF2_ITERATIONS).to.eql(512);
      });

      it('will cause the .verify() function to fail if changed', () => {
        const passwordHash = passwordUtility.hash(password, salt);
        expect(passwordHash).to.eql(hashSnapshotHelloWorld);
        expect(passwordUtility.verify(salt, password, passwordHash))
          .to.be.true;
        passwordUtility.constant.PBKDF2_ITERATIONS =
          passwordUtility.constant.PBKDF2_ITERATIONS - 1;
        expect(passwordUtility.verify(salt, password, passwordHash))
          .to.be.false;
      });
    });

    describe('.PBKDF2_KEY_LENGTH', () => {
      let original = {};

      before(() => {
        original.PBKDF2_KEY_LENGTH = passwordUtility.constant.PBKDF2_KEY_LENGTH;
      });

      after(() => {
        passwordUtility.constant.PBKDF2_KEY_LENGTH = original.PBKDF2_KEY_LENGTH;
      });

      it('has the correct value', () => {
        expect(passwordUtility.constant.PBKDF2_KEY_LENGTH).to.eql(128);
      });

      it('will cause the .verify() function to fail if changed', () => {
        const passwordHash = passwordUtility.hash(password, salt);
        expect(passwordHash).to.eql(hashSnapshotHelloWorld);
        expect(passwordUtility.verify(salt, password, passwordHash))
          .to.be.true;
        passwordUtility.constant.PBKDF2_KEY_LENGTH =
          passwordUtility.constant.PBKDF2_KEY_LENGTH + 1;
        expect(passwordUtility.verify(salt, password, passwordHash))
          .to.be.false;
      });
    });
  });
});
