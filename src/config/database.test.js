const database = require('./database');

describe('config/database', () => {
  let config = null;

  beforeEach(() => {
    config = database();
  });

  it('has the correct keys', () => {
    expect(config).to.have.keys([
      'auth',
      'host',
      'name',
      'port',
    ]);
  });

  it('has the correct default values', () => {
    expect(config.host).to.eql('127.0.0.1');
    expect(config.name).to.eql('annams');
    expect(config.port).to.eql('3306');
  });

  describe('.auth', () => {
    it('has the correct keys', () => {
      expect(config.auth).to.have.keys([
        'username',
        'password',
      ]);
    });

    it('has the correct default values', () => {
      expect(config.auth.username).to.eql('annams_user');
      expect(config.auth.password).to.eql('annams_password');
    });

    context('environment variables present', () => {
      before(() => {
        process.env.DATABASE_AUTH_USERNAME = '_test_database_username';
        process.env.DATABASE_AUTH_PASSWORD = '_test_database_password';
      });

      after(() => {
        delete process.env.DATABASE_AUTH_USERNAME;
        delete process.env.DATABASE_AUTH_PASSWORD;
      });

      it('has the correct values', () => {
        expect(config.auth.username).to.eql(process.env.DATABASE_AUTH_USERNAME);
        expect(config.auth.password).to.eql(process.env.DATABASE_AUTH_PASSWORD);
      });
    });
  });

  context('environment variables present', () => {
    before(() => {
      process.env.DATABASE_HOST = '127.0.0.256';
      process.env.DATABASE_NAME = '_test_database_name';
      process.env.DATABASE_PORT = '65537';
    });

    after(() => {
      delete process.env.DATABASE_HOST;
      delete process.env.DATABASE_NAME;
      delete process.env.DATABASE_PORT;
    });

    it(' has the correct values', () => {
      expect(config.host).to.eql(process.env.DATABASE_HOST);
      expect(config.name).to.eql(process.env.DATABASE_NAME);
      expect(config.port).to.eql(process.env.DATABASE_PORT);
    });
  });
});
