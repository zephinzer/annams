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

  initializeSpies.bind(this)();
  initializeMocks.bind(this)();

  return this;
};

/**
 * Add a new string into this array to mock that function
 *
 * @var {Array} KnexMockTable.functions
 */
KnexMockTable.functions = [
  'dateTime',
  'defaultTo',
  'dropForeign',
  'inTable',
  'increments',
  'integer',
  'notNullable',
  'primary',
  'references',
  'string',
  'timestamp',
  'timestamps',
  'unsigned',
  'foreign',
];

/**
 * Initializes the .mock property of the context of this function
 *
 * @example initializeMocks.bind(this)();
 */
function initializeMocks() {
  const createMock = initializeMocks.create.bind(this);
  KnexMockTable.functions.forEach(
    (mockedFunctionKey) => createMock(mockedFunctionKey)
  );
};

/**
 * Creates a new property named :keyName on this.mock
 *
 * @param {String} keyName
 */
initializeMocks.create = function(keyName) {
  this.mock = this.mock || {};
  this.mock[keyName] = (...args) => {
    this.spy[keyName].apply(null, [...args]);
    return this.mock;
  };
};

/**
 * Initializes the .spy property of the context of this function
 *
 * @example initializeSpies.bind(this)()
 */
function initializeSpies() {
  const createSpy = initializeSpies.create.bind(this);
  KnexMockTable.functions.forEach(
    (mockedFunctionKey) => createSpy(mockedFunctionKey)
  );
  this.spy.reset = () => {
    Object.keys(this.spy).forEach((key) => {
      if (typeof this.spy[key].resetHistory === 'function') {
        this.spy[key].resetHistory();
      }
    });
  };
};

/**
 * Creates a new property :keyName on this. spy
 *
 * @param {String} keyName
 */
initializeSpies.create = function(keyName) {
  this.spy = this.spy || {};
  this.spy[keyName] = sinon.spy();
};
