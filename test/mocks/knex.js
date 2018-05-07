const sinon = require('sinon');
const knex = {};

knex._ = {};

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

knex._.fn = {};

knex._.fn.spy = {
  now: sinon.spy(),
  reset: () => {
    Object.keys(knex._.fn.spy).forEach((key) => {
      if (typeof knex._.fn.spy[key].resetHistory === 'function') {
        knex._.fn.spy[key].resetHistory();
      }
    });
  },
};

knex._.fn.mock = {
  now: (...args) => {
    knex._.fn.spy.now.apply(null, [...args]);
    return 'knex.fn.now().mock';
  },
};

knex._.schema = {};

knex._.schema.spy = {
  alterTable: sinon.spy(),
  createTable: sinon.spy(),
  dropTable: sinon.spy(),
  reset: () => {
    Object.keys(knex._.schema.spy).forEach((key) => {
      if (typeof knex._.schema.spy[key].resetHistory === 'function') {
        knex._.schema.spy[key].resetHistory();
      }
    });
  },
};

knex._.schema.mock = {
  alterTable: (...args) => {
    knex._.schema.spy.alterTable.apply(null, [...args]);
    args[1](knex._.table.mock);
  },
  createTable: (...args) => {
    knex._.schema.spy.createTable.apply(null, [...args]);
    args[1](knex._.table.mock);
  },
  dropTable: (...args) => {
    knex._.schema.spy.dropTable.apply(null, [...args]);
  },
};

knex._.table = {};

knex._.table.spy = {
  dateTime: sinon.spy(),
  defaultTo: sinon.spy(),
  dropForeign: sinon.spy(),
  foreign: sinon.spy(),
  inTable: sinon.spy(),
  increments: sinon.spy(),
  integer: sinon.spy(),
  primary: sinon.spy(),
  references: sinon.spy(),
  string: sinon.spy(),
  timestamps: sinon.spy(),
  unsigned: sinon.spy(),
  reset: () => {
    Object.keys(knex._.table.spy).forEach((key) => {
      if (typeof knex._.table.spy[key].resetHistory === 'function') {
        knex._.table.spy[key].resetHistory();
      }
    });
  },
};

knex._.table.mock = {
  dateTime: (...args) => {
    knex._.table.spy.dateTime.apply(null, [...args]);
    return knex._.table.mock;
  },
  defaultTo: (...args) => {
    knex._.table.spy.defaultTo.apply(null, [...args]);
    return knex._.table.mock;
  },
  dropForeign: (...args) => {
    knex._.table.spy.dropForeign.apply(null, [...args]);
    return knex._.table.mock;
  },
  foreign: (...args) => {
    knex._.table.spy.foreign.apply(null, [...args]);
    return knex._.table.mock;
  },
  inTable: (...args) => {
    knex._.table.spy.inTable.apply(null, [...args]);
    return knex._.table.mock;
  },
  increments: (...args) => {
    knex._.table.spy.increments.apply(null, [...args]);
    return knex._.table.mock;
  },
  integer: (...args) => {
    knex._.table.spy.integer.apply(null, [...args]);
    return knex._.table.mock;
  },
  primary: (...args) => {
    knex._.table.spy.primary.apply(null, [...args]);
    return knex._.table.mock;
  },
  references: (...args) => {
    knex._.table.spy.references.apply(null, [...args]);
    return knex._.table.mock;
  },
  string: (...args) => {
    knex._.table.spy.string.apply(null, [...args]);
    return knex._.table.mock;
  },
  timestamps: (...args) => {
    knex._.table.spy.timestamps.apply(null, [...args]);
    return knex._.table.mock;
  },
  unsigned: (...args) => {
    knex._.table.spy.unsigned.apply(null, [...args]);
    return knex._.table.mock;
  },
};

knex.fn = knex._.fn.mock;
knex.schema = knex._.schema.mock;
knex.raw = knex._.mock.raw;

module.exports = knex;
