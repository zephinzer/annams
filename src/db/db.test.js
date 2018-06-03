const db = require('./db');

describe('db', () => {
  it('exports a function', () => {
    expect(db).to.be.a('function');
  });

  it('has the right keys', () => {
    expect(db).to.have.keys([
      'initialize',
      'instance',
      'reset',
    ]);
  });

  describe('constructor()', () => {
    const testKnexOptions = '_test_db_instance';
    const original = {};
    const spy = {};

    context('.instance property is null', () => {
      beforeEach(() => {
        original.instance = db.instance;
        db.instance = null;

        original.initialize = db.initialize;
        spy.initialize = sinon.spy();
        db.initialize = (...args) => {
          spy.initialize.apply(null, [...args]);
          db.instance = sinon.spy();
        };
      });

      afterEach(() => {
        db.initialize = original.initialize;
        db.instance = original.instance;
      });

      it('initialises the database', () => {
        expect(db.instance).to.be.null;
        db(testKnexOptions);
        expect(db.instance).to.be.calledWith(testKnexOptions);
      });

      it('calls the database instance with options', () => {
        expect(db.instance).to.be.null;
        db(testKnexOptions);
        expect(db.instance).to.be.calledWith(testKnexOptions);
      });
    });
  });

  describe('.instance', () => {
    const testDbInstance = '_test_singletonism';
    const original = {};

    before(() => {
      original.instance = db.instance;
      db.instance = () => testDbInstance;
    });

    after(() => {
      db.instance = original.instance;
    });

    it('holds the singleton instance of the db object', () => {
      expect(db()).to.eql(testDbInstance);
    });
  });

  describe('.reset()', () => {
    const original = {};

    before(() => {
      original.instance = db.instance;
      db.instance = '_test_instance';
    });

    after(() => {
      db.instance = original.instance;
    });

    it('sets the .instance property to null', () => {
      expect(db.instance).to.not.be.null;
      db.reset();
      expect(db.instance).to.be.null;
    });
  });
});
