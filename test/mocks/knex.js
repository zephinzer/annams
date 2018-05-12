const sinon = require('sinon');

const KnexMockFn = require('./knex.fn');
const KnexMockSchema = require('./knex.schema');
const KnexMockTable = require('./knex.table');

module.exports = KnexMock;

/**
 * Returns a mock knex instance
 *
 * @return {KnexMock}
 */
function KnexMock(...args) {
  this.databaseName = args[0];
  this.spy = {
    constructor: sinon.spy(),
    limit: sinon.spy(),
    offset: sinon.spy(),
    orderBy: sinon.spy(),
    select: sinon.spy(),
    then: sinon.spy(),
    where: sinon.spy(),
    reset: () => {
      Object.keys(this.spy).forEach((key) => {
        if (typeof this.spy[key].resetHistory === 'function') {
          this.spy[key].resetHistory();
        }
      });
    },
  };
  this.spy.constructor.apply(this, [...args]);

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

  this.where = function(...args) {
    this.spy.where.apply(this, [...args]);
    return this;
  };

  this.then = function(...args) {
    this.spy.then.apply(this, [...args]);
    setTimeout(() => {
      try {
        args[0]('_then_resolved');
      } catch (ex) {
        console.error(ex);
        throw ex;
      }
    }, 5);
    return this;
  };
  return this;
};

KnexMock._ = {};

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
