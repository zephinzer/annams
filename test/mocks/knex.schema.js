const sinon = require('sinon');

module.exports = KnexMockSchema;

/**
 * Returns the schema properties for knex mock.
 *
 * @param {Object} knexMock
 * @param {Object} knexMock._
 * @param {Object} knexMock._.table
 * @param {Object} knexMock._.table.mock
 *
 * @return {KnexMockSchema}
 */
function KnexMockSchema(knexMock) {
  this.knex = knexMock;

  this.spy = {
    alterTable: sinon.spy(),
    createTable: sinon.spy(),
    dropTable: sinon.spy(),
    reset: () => {
      Object.keys(this.spy).forEach((key) => {
        if (typeof this.spy[key].resetHistory === 'function') {
          this.spy[key].resetHistory();
        }
      });
    },
  };

  this.mock = {
    alterTable: (...args) => {
      this.spy.alterTable.apply(null, [...args]);
      args[1](this.knex._.table.mock);
    },
    createTable: (...args) => {
      this.spy.createTable.apply(null, [...args]);
      args[1](this.knex._.table.mock);
    },
    dropTable: (...args) => {
      this.spy.dropTable.apply(null, [...args]);
    },
  };

  return this;
};


