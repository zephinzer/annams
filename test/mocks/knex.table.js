const sinon = require('sinon');

module.exports = KnexMockTable;

/**
 * Returns a mock table for knex.
 *
 * @param {Object} knexMock
 *
 * @return {KnexMockTable}
 */
function KnexMockTable(knexMock) {
  this.knex = knexMock;

  this.spy = {
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
      Object.keys(this.spy).forEach((key) => {
        if (typeof this.spy[key].resetHistory === 'function') {
          this.spy[key].resetHistory();
        }
      });
    },
  };

  this.mock = {
    dateTime: (...args) => {
      this.spy.dateTime.apply(null, [...args]);
      return this.mock;
    },
    defaultTo: (...args) => {
      this.spy.defaultTo.apply(null, [...args]);
      return this.mock;
    },
    dropForeign: (...args) => {
      this.spy.dropForeign.apply(null, [...args]);
      return this.mock;
    },
    foreign: (...args) => {
      this.spy.foreign.apply(null, [...args]);
      return this.mock;
    },
    inTable: (...args) => {
      this.spy.inTable.apply(null, [...args]);
      return this.mock;
    },
    increments: (...args) => {
      this.spy.increments.apply(null, [...args]);
      return this.mock;
    },
    integer: (...args) => {
      this.spy.integer.apply(null, [...args]);
      return this.mock;
    },
    primary: (...args) => {
      this.spy.primary.apply(null, [...args]);
      return this.mock;
    },
    references: (...args) => {
      this.spy.references.apply(null, [...args]);
      return this.mock;
    },
    string: (...args) => {
      this.spy.string.apply(null, [...args]);
      return this.mock;
    },
    timestamps: (...args) => {
      this.spy.timestamps.apply(null, [...args]);
      return this.mock;
    },
    unsigned: (...args) => {
      this.spy.unsigned.apply(null, [...args]);
      return this.mock;
    },
  };

  return this;
};
