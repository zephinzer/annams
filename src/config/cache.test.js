const cache = require('./cache');

describe('config/cache', () => {
  let config = null;

  beforeEach(() => {
    config = cache();
  });

  it('has the correct keys', () => {
    expect(config).to.have.keys([
      'host',
      'port',
    ]);
  });

  it('has the correct default values', () => {
    expect(config.host).to.eql('127.0.0.1');
    expect(config.port).to.eql('6379');
  });

  context('environment variables present', () => {
    before(() => {
      process.env.CACHE_HOST = '127.0.0.256';
      process.env.CACHE_PORT = '65537';
    });

    after(() => {
      delete process.env.CACHE_HOST;
      delete process.env.CACHE_PORT;
    });

    it(' has the correct default values', () => {
      expect(config.host).to.eql(process.env.CACHE_HOST);
      expect(config.port).to.eql(process.env.CACHE_PORT);
    });
  });
});
