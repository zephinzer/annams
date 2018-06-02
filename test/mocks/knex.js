const sinon = require('sinon');

const KnexMockFn = require('./knex.fn');
const KnexMockSchema = require('./knex.schema');
const KnexMockTable = require('./knex.table');

module.exports = KnexMock;

KnexMock.functions = [
  'catch',
  'constructor',
  'insert',
  'limit',
  'offset',
  'orderBy',
  'select',
  'then',
  'update',
  'where',
];

/**
 * Returns a mock knex instance
 *
 * @return {KnexMock}
 */
function KnexMock(...args) {
  const createSpies = KnexMock.createSpies.bind(this);
  this.databaseName = args[0];
  KnexMock.functions.forEach((mockedFunctionKey) => {
    createSpies(mockedFunctionKey);
  });
  this.spy.reset = () => {
    Object.keys(this.spy).forEach((key) => {
      if (typeof this.spy[key].resetHistory === 'function') {
        this.spy[key].resetHistory();
      }
    });
  };
  this.spy.constructor.apply(this, [...args]);

  this.catch = function(...args) {
    this.spy.catch.apply(this, [...args]);
    return this;
  };

  this.insert = function(...args) {
    this.spy.insert.apply(this, [...args]);
    return this;
  };
  this.limit = function(...args) {
    this.spy.limit.apply(this, [...args]);
    return this;
  };

  this.offset = function(...args) {
    this.spy.offset.apply(this, [...args]);
    return this;
  };

  this.orderBy = function(...args) {
    this.spy.orderBy.apply(this, [...args]);
    return this;
  };

  this.select = function(...args) {
    this.spy.select.apply(this, [...args]);
    return this;
  };

  this.update = function(...args) {
    this.spy.update.apply(this, [...args]);
    return this;
  };

  this.where = function(...args) {
    this.spy.where.apply(this, [...args]);
    return this;
  };

  this.then = (...args) => {
    this.spy.then.apply(this, [...args]);
    return this;
  };
  return this;
};

/**
 * Creates a new property :keyName on this. spy
 *
 * @param {String} keyName
 */
KnexMock.createSpies = function(keyName) {
  this.spy = this.spy || {};
  this.spy[keyName] = sinon.spy();
};

KnexMock._ = {};

KnexMock.__exceptions = [];
KnexMock._.fn = new KnexMockFn(KnexMock);
KnexMock._.schema = new KnexMockSchema(KnexMock);
KnexMock._.table = new KnexMockTable(KnexMock);

KnexMock._.resetAll = () => {
  KnexMock._.spy.reset();
  KnexMock._.schema.spy.reset();
  KnexMock._.table.spy.reset();
  KnexMock._.fn.spy.reset();
};

KnexMock._.spy = {
  raw: sinon.spy(),
  reset: () => {
    Object.keys(KnexMock._.spy).forEach((key) => {
      if (typeof KnexMock._.spy[key].resetHistory === 'function') {
        KnexMock._.spy[key].resetHistory();
      }
    });
  },
};

KnexMock._.mock = {
  raw: (...args) => {
    KnexMock._.spy.raw.apply(null, [...args]);
  },
};

KnexMock.fn = KnexMock._.fn.mock;
KnexMock.schema = KnexMock._.schema.mock;
KnexMock.table = KnexMock._.table.mock;
KnexMock.raw = KnexMock._.mock.raw;
