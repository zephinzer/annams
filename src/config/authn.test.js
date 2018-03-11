const authn = require('./authn');

describe('config/authn', () => {
  let config = null;

  beforeEach(() => {
    config = authn();
  });

  it('retrieves the correct environment variables', () => {
    expect(config).to.have.keys([
      'healthcheck',
      'metrics',
      'jwt',
    ]);
  });

  describe('.healthcheck', () => {
    it('has the correct keys', () => {
      expect(config.healthcheck).to.have.keys([
        'username',
        'password',
      ]);
    });

    it('has the correct default values', () => {
      expect(config.healthcheck.username).to.eql(null);
      expect(config.healthcheck.password).to.eql(null);
    });

    context('when environment variables present', () => {
      before(() => {
        process.env.AUTHN_HEALTHCHECK_USERNAME = '_test_healthcheck_username';
        process.env.AUTHN_HEALTHCHECK_PASSWORD = '_test_healthcheck_password';
      });

      after(() => {
        delete process.env.AUTHN_HEALTHCHECK_USERNAME;
        delete process.env.AUTHN_HEALTHCHECK_PASSWORD;
      });

      it('takes on the correct values', () => {
        expect(config.healthcheck.username).to.eql(process.env.AUTHN_HEALTHCHECK_USERNAME);
        expect(config.healthcheck.password).to.eql(process.env.AUTHN_HEALTHCHECK_PASSWORD);
      });
    });
  });

  describe('.metrics', () => {
    it('has the correct keys', () => {
      expect(config.metrics).to.have.keys([
        'username',
        'password',
      ]);
    });

    it('has the correct default values', () => {
      expect(config.metrics.username).to.eql(null);
      expect(config.metrics.password).to.eql(null);
    });

    context('when environment variables present', () => {
      before(() => {
        process.env.AUTHN_METRICS_USERNAME = '_test_metrics_username';
        process.env.AUTHN_METRICS_PASSWORD = '_test_metrics_password';
      });

      after(() => {
        delete process.env.AUTHN_METRICS_USERNAME;
        delete process.env.AUTHN_METRICS_PASSWORD;
      });

      it('takes on the correct values', () => {
        expect(config.metrics.username).to.eql(process.env.AUTHN_METRICS_USERNAME);
        expect(config.metrics.password).to.eql(process.env.AUTHN_METRICS_PASSWORD);
      });
    });
  });

  describe('.jwt', () => {
    it('has the correct keys', () => {
      expect(config.jwt).to.have.keys([
        'key',
      ]);
    });

    describe('.key', () => {
      it('has the correct keys', () => {
        expect(config.jwt.key).to.have.keys([
          'private',
          'public',
        ]);
      });

      it('has the correct default values', () => {
        expect(config.jwt.key.private).to.eql(null);
        expect(config.jwt.key.public).to.eql(null);
      });

      context('when environment variables present', () => {
        before(() => {
          process.env.AUTHN_JWT_KEY_PRIVATE = '_test_jwt_private_key';
          process.env.AUTHN_JWT_KEY_PUBLIC = '_test_jwt_public_key';
        });

        after(() => {
          delete process.env.AUTHN_JWT_KEY_PRIVATE;
          delete process.env.AUTHN_JWT_KEY_PUBLIC;
        });

        it('takes on the correct values', () => {
          expect(config.jwt.key.private).to.eql(process.env.AUTHN_JWT_KEY_PRIVATE);
          expect(config.jwt.key.public).to.eql(process.env.AUTHN_JWT_KEY_PUBLIC);
        });
      });
    });
  });
});
