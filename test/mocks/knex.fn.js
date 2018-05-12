const sinon = require('sinon');

module.exports = KnexMockFn;

/**
 * Returns a mock .fn for knex mock.
 *
 * @param {Object} knexMock
 *
 * @return {KnexMockFn}
 */
function KnexMockFn(knexMock) {
  this.knex = knexMock;

  this.spy = {
    now: sinon.spy(),
    reset: () => {
      Object.keys(this.spy).forEach((key) => {
        if (typeof this.spy[key].resetHistory === 'function') {
          this.spy[key].resetHistory();
        }
      });
    },
  };

  this.mock = {
    now: (...args) => {
      this.spy.now.apply(null, [...args]);
      return 'knex.this.now().mock';
    },
  };

  return this;
}

