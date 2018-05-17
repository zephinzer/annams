const validator = require('./validator');

describe('account/utility/validator', () => {
  it('has the correct keys', () => {
    expect(validator).to.have.keys([
      'id',
      'email',
      'password',
      'username',
      'uuid',
    ]);
  });

  describe('.id', () => {
    it('validates IDs correctly', () => {
      const validIds = [
        '1',
        1,
        '123',
        1234567,
      ];
      const invalidIds = [
        0,
        -1,
        true,
        {},
        null,
        () => {},
      ];
      validIds.forEach((id) => {
        expect(validator.id(id)).to.be.true;
      });
      invalidIds.forEach((id) => {
        expect(validator.id(id)).to.be.false;
      });
    });
  });

  describe('.email', () => {
    it('validates normal emails', () => {
      const validEmails = [
        'jamie@olver.com',
        'angmoh@nostalgia.co.uk',
        'web.works.gyl@hive.com.sg',
        'somegenius+web@gmail.com',
        'depressedkid1990@gmail.com',
        'dj_skorpion@nostalgia.net',
      ];
      validEmails.forEach((email) => {
        expect(validator.email(email)).to.be.true;
      });
    });

    it('invalidates overlengthed emails', () => {
      const validEmails = [
        'abcdefghjklmnopqrstuvwxyzabcdefghjklmnopqrstuvwxyzabcdefghjklmno@nop.com', // eslint-disable-line max-len
        'abcdefghjklmnopqrstuvwxyzabcdefghjklmnopqrstuvwxyzabcdefghjklmno@abcdefghjklmnopqrstuvwxyzabcdefghjklmnopqrstuvwxyzabcdefghjklmn.com', // eslint-disable-line max-len
        'abcdefghjklmnopqrstuvwxyzabcdefghjklmnopqrstuvwxyzabcdefghjklmno@abcdefghjklmnopqrstuvwxyzabcdefghjklmnopqrstuvwxyzabcdefghjklmn.com.sg', // eslint-disable-line max-len
        'abcdefghjklmnopqrstuvwxyzabcdefghjklmnopqrstuvwxyzabcdefghjklmno@abcdefghjklmnopqrstuvwxyzabcdefghjklmnopqrstuvwxyzabcdefghjklmn.co.uk', // eslint-disable-line max-len
      ];
      const invalidEmails = [
        'abcdefghjklmnopqrstuvwxyzabcdefghjklmnopqrstuvwxyzabcdefghjklmnop@nop.com', // eslint-disable-line max-len
        'abcdefghjklmnopqrstuvwxyzabcdefghjklmnopqrstuvwxyzabcdefghjklmno@abcdefghjklmnopqrstuvwxyzabcdefghjklmnopqrstuvwxyzabcdefghjklmno.com', // eslint-disable-line max-len
        'abcdefghjklmnopqrstuvwxyzabcdefghjklmnopqrstuvwxyzabcdefghjklmno@abcdefghjklmnopqrstuvwxyzabcdefghjklmnopqrstuvwxyzabcdefghjklmno.co', // eslint-disable-line max-len
      ];
      validEmails.forEach((email) => {
        expect(validator.email(email)).to.be.true;
      });
      invalidEmails.forEach((email) => {
        expect(validator.email(email)).to.be.false;
      });
    });

    it('invalidates emails with more than one "@" symbols', () => {
      const validEmails = [
        'a@a.com',
        'a.b@a.com',
        'a.b@a.co.uk',
      ];
      const invalidEmails = [
        'a@@a.com',
        'a@a@b.com',
        'a@a.co@b.com',
        'a@a.co@b@c.com',
      ];
      validEmails.forEach((email) => {
        expect(validator.email(email)).to.be.true;
      });
      invalidEmails.forEach((email) => {
        expect(validator.email(email)).to.be.false;
      });
    });

    it('invalidates emails with invalid characters', () => {
      const invalidEmails = [
        'a\b@a.com',
        'a~b@a.com',
        'a`b@a.com',
        'a@b@a.com',
        'a#b@a.com',
        'a$b@a.com',
        'a%b@a.com',
        'a^b@a.com',
        'a&b@a.com',
        'a*b@a.com',
        'a(b@a.com',
        'a)b@a.com',
        'a=b@a.com',
        'a[b@a.com',
        'a]b@a.com',
        'a{b@a.com',
        'a}b@a.com',
        'a|b@a.com',
        'a\b@a.com',
        'a\b\@a.com',
        'a:b@a.com',
        'a;b@a.com',
        'a\'b@a.com',
        'a"b@a.com',
        'a<b@a.com',
        'a>b@a.com',
        'a/b@a.com',
        'a?b@a.com',
      ];
      invalidEmails.forEach((email) => {
        expect(validator.email(email)).to.be.false;
      });
    });

    it('invalidates allowed special chracters at wrong positions', () => {
      const invalidEmails = [
        '-a@a.com',
        '_a@a.com',
        '+a@a.com',
        '.a@a.com',
        'a-@a.com',
        'a_@a.com',
        'a+@a.com',
        'a.@a.com',
      ];
      invalidEmails.forEach((email) => {
        expect(validator.email(email)).to.be.false;
      });
    });

    it('invalidates invalid domain names', () => {
      const invalidEmails = [
        'a@a`.com',
        'a@a~.com',
        'a@a!.com',
        'a@a#.com',
        'a@a$.com',
        'a@a%.com',
        'a@a^.com',
        'a@a&.com',
        'a@a*.com',
        'a@a(.com',
        'a@a).com',
        'a@a-.com',
        'a@a=.com',
        'a@a_.com',
        'a@a+.com',
        'a@a[.com',
        'a@a].com',
        'a@a{.com',
        'a@a}.com',
        'a@a\\.com',
        'a@a|.com',
        'a@a;.com',
        'a@a:.com',
        'a@a\'.com',
        'a@a").com',
        'a@a<.com',
        'a@a>.com',
        'a@a?.com',
        'a@a/.com',
        'a@a..com',
      ];
      invalidEmails.forEach((email) => {
        expect(validator.email(email)).to.be.false;
      });
    });
  });

  describe('.password', () => {
    it('validates the password length correctly', () => {
      const validPasswords = [
        '1234567890',
        '12345678901',
      ];
      const invalidPasswords = [
        '123456789',
      ];
      const options = {
        length: 10,
        specials: false,
        numbers: false,
        casings: false,
      };
      validPasswords.forEach((password) => {
        expect(validator.password(password, options)).eql(true);
      });
      invalidPasswords.forEach((password) => {
        expect(validator.password(password, options)).eql(false);
      });
    });

    it('validates specials correctly', () => {
      const validPasswords = [
        '1234567890`',
        '1234567890!',
        '1234567890@',
        '1234567890#',
        '1234567890$',
        '1234567890%',
        '1234567890^',
        '1234567890&',
        '1234567890*',
        '1234567890(',
        '1234567890)',
      ];
      const invalidPasswords = [
        '1234567890',
      ];
      const options = {
        length: 10,
        specials: true,
        numbers: false,
        casings: false,
      };
      validPasswords.forEach((password) => {
        expect(validator.password(password, options)).eql(true);
      });
      invalidPasswords.forEach((password) => {
        expect(validator.password(password, options)).eql(false);
      });
    });

    it('validates casings correctly', () => {
      const validPasswords = [
        'abcdEfghijk',
        'Abcdefghijk',
        'abcdefghijK',
        'AbcdefghijK',
      ];
      const invalidPasswords = [
        'abcdefghjik',
      ];
      const options = {
        length: 10,
        specials: false,
        numbers: false,
        casings: true,
      };
      validPasswords.forEach((password) => {
        expect(validator.password(password, options)).eql(true);
      });
      invalidPasswords.forEach((password) => {
        expect(validator.password(password, options)).eql(false);
      });
    });
  });

  describe('.username', () => {
    it('works as expected', () => {
      const validUsernames = [
        'abcdef',
        '123456',
      ];
      const invalidUsernames = [
        1,
        true,
        {},
        null,
        undefined,
      ];
      validUsernames.forEach((username) => {
        expect(validator.username(username)).eql(true);
      });
      invalidUsernames.forEach((username) => {
        expect(validator.username(username)).eql(false);
      });
    });
  });

  describe('.uuid', () => {
    it('works as expected', () => {
      const validUuids = [
        '16c8370f-c0e4-4f12-bdd1-ac3f2284a9e1',
        'faaeb34b-9d88-428b-b22f-7f35cfd67457',
      ];
      const invalidUuids = [
        1,
        true,
        {},
        null,
        undefined,
      ];
      validUuids.forEach((uuid) => {
        expect(validator.uuid(uuid)).eql(true);
      });
      invalidUuids.forEach((uuid) => {
        expect(validator.uuid(uuid)).eql(false);
      });
    });
  });
});
