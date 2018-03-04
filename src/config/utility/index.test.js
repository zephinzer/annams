const utility = require('./');

describe('config/utility', () => {
  beforeEach(() => {
    delete process.env._A;
    delete process.env._B;
  });

  context('.generateMD5Hash', () => {
    it('generates a hash', () => {
      const hashA = utility.generateMD5Hash('a');
      expect(hashA).to.have.length(32);
      const hashB = utility.generateMD5Hash('b');
      expect(hashA).to.not.eql(hashB);
    });
    it('is case sensitive', () => {
      const hasha = utility.generateMD5Hash('a');
      expect(hasha).to.have.length(32);
      const hashA = utility.generateMD5Hash('A');
      expect(hashA).to.have.length(32);
      expect(hasha).to.not.eql(hashA);
    });
  });

  context('.nullableFromEnv', () => {
    it('allows a null value to be set as the default value', () => {
      process.env._A = 'a';
      expect(utility.nullableFromEnv('_A', null)).to.eql('a');
      expect(utility.nullableFromEnv('_B', null)).to.not.eql(false);
      expect(utility.nullableFromEnv('_B', null)).to.not.eql(undefined);
      expect(utility.nullableFromEnv('_B', null)).to.eql(null);
    });
  });

  context('.stringFromEnv', () => {
    it('doesnt allow a null value to be set as the default value', () => {
      process.env._A = 'a';
      process.env._B = 'false';
      expect(utility.stringFromEnv('_A', null)).to.eql('a');
      expect(utility.stringFromEnv('_B', false)).to.not.eql(false);
      expect(utility.stringFromEnv('_B', undefined)).to.not.eql(undefined);
      expect(utility.stringFromEnv('_B', null)).to.not.eql(null);
      expect(utility.stringFromEnv('_B', false)).to.eql('false');
    });
  });

  context('.arrayFromEnv', () => {
    it('allows an array to be created from an environment variable', () => {
      process.env._A = 'a,b,c';
      expect(utility.arrayFromEnv('_A', 'a')).to.eql(['a', 'b', 'c']);
    });

    it('automatically trims spaces in the environment variable', () => {
      process.env._A = 'a,     b    ,  c';
      expect(utility.arrayFromEnv('_A', 'a')).to.eql(['a', 'b', 'c']);
    });
  });

  context('.booleanFromEnv', () => {
    it('allows a boolean value to be set from an environment variable', () => {
      process.env._A = 'true';
      expect(utility.booleanFromEnv('_A')).to.eql(true);
      process.env._A = 'TRUE';
      expect(utility.booleanFromEnv('_A')).to.eql(true);
      process.env._A = '1';
      expect(utility.booleanFromEnv('_A')).to.eql(true);
      process.env._A = 'yes';
      expect(utility.booleanFromEnv('_A')).to.eql(true);
      process.env._A = 'YES';
      expect(utility.booleanFromEnv('_A')).to.eql(true);
      process.env._A = 'y';
      expect(utility.booleanFromEnv('_A')).to.eql(true);
      process.env._A = 'Y';
      expect(utility.booleanFromEnv('_A')).to.eql(true);
      process.env._B = 'false';
      expect(utility.booleanFromEnv('_B')).to.eql(false);
      process.env._B = 'FALSE';
      expect(utility.booleanFromEnv('_B')).to.eql(false);
      process.env._B = '0';
      expect(utility.booleanFromEnv('_B')).to.eql(false);
      process.env._B = 'no';
      expect(utility.booleanFromEnv('_B')).to.eql(false);
      process.env._B = 'NO';
      expect(utility.booleanFromEnv('_B')).to.eql(false);
      process.env._B = 'n';
      expect(utility.booleanFromEnv('_B')).to.eql(false);
      process.env._B = 'N';
      expect(utility.booleanFromEnv('_B')).to.eql(false);
    });
  });

  context('reportStatus', () => {
    let originalConsoleInfo;
    let consoleInfoSpy;

    before(() => {
      originalConsoleInfo = global.console.info;
      consoleInfoSpy = sinon.spy();
      global.console.info = consoleInfoSpy;
    });

    after(() => {
      global.console.info = originalConsoleInfo;
    });

    it('has the correct format', () => {
      process.env._A = 'a';
      utility.reportStatus('_A', 'a');
      expect(global.console.info).to.be.calledWith('_A:"a"="a":string');
      process.env._A = '2';
      utility.reportStatus('_A', 2);
      expect(global.console.info).to.be.calledWith('_A:"2"="2":number');
      process.env._A = 'true';
      utility.reportStatus('_A', true);
      expect(global.console.info).to.be.calledWith('_A:"true"="true":boolean');
      process.env._A = 'null';
      utility.reportStatus('_A', null);
      expect(global.console.info).to.be.calledWith('_A:"null"="null":object');
    });

    it('can redact keys and passwords', () => {
      process.env._A = 'a';
      utility.reportStatus('_A', 'a', true);
      const hashOfA = utility.generateMD5Hash(process.env._A);
      expect(global.console.info)
        .to.be.calledWith(`_A:"#_${hashOfA}"="#_${hashOfA}":string`);
    });
  });
});
