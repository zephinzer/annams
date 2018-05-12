const sinon = require('sinon');

const KnexMockFn = require('./knex.fn');
const KnexMockSchema = require('./knex.schema');
const KnexMockTable = require('./knex.table');

const knex = {};

knex._ = {};

knex._.fn = new KnexMockFn(knex);
knex._.schema = new KnexMockSchema(knex);
knex._.table = new KnexMockTable(knex);

knex._.resetAll = () => {
  knex._.spy.reset();
  knex._.schema.spy.reset();
  knex._.table.spy.reset();
  knex._.fn.spy.reset();
};

knex._.spy = {
  raw: sinon.spy(),
  reset: () => {
    Object.keys(knex._.spy).forEach((key) => {
      if (typeof knex._.spy[key].resetHistory === 'function') {
        knex._.spy[key].resetHistory();
      }
    });
  },
};

knex._.mock = {
  raw: (...args) => {
    knex._.spy.raw.apply(null, [...args]);
  },
};

knex.fn = knex._.fn.mock;
knex.schema = knex._.schema.mock;
knex.table = knex._.table.mock;
knex.raw = knex._.mock.raw;

module.exports = knex;
