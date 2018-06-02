const server = require('./index');

describe('server', () => {
  it('exports a function', () => {
    expect(server).to.be.a('function');
  });

  it('has the correct keys', () => {
    expect(server).to.have.keys([
      'instance',
      'start',
    ]);
  });

  it('can be initialised without error', () => {
    expect(() => server()).to.not.throw();
    expect(server()).to.be.a('function');
  });

  it('should have a :createdAt custom timestamp', () => {
    expect(server()).to.include.key('createdAt');
    expect(server().createdAt).to.be.at.most((new Date()).getTime());
  });

  describe('.instance', () => {
    let serverInstance;

    before(() => {
      serverInstance = server.instance;
      server.instance = null;
    });

    after(() => {
      server.instance = serverInstance;
    });

    it('is assigned to server instance on call to server()', () => {
      expect(server.instance).to.be.null;
      server();
      expect(server.instance).to.not.be.null;
    });

    it('is returned on subsequent calls to server()', () => {
      const {createdAt} = server();
      expect(server().createdAt).to.deep.equal(createdAt);
    });
  });

  describe('.start()', () => {
    it('is a function', () => {
      expect(server.start).to.be.a('function');
    });
  });
});
