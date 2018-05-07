const chai = require('chai');
const sinon = require('sinon');
chai.use(require('sinon-chai'));
const {expect} = require('chai');

const filename = __filename.substr(__dirname.length + 1).replace('.test', '');
const migrations = require(`../development/${filename}`);
const knexMock = require('../../../test/mocks/knex');

describe('migration:create sessions', () => {
  before(() => {
    knexMock._.resetAll();
  });

  context('upwards migration', () => {
    const migration = migrations.up;
    const promiseSpy = sinon.spy();

    beforeEach(() => {
      migration(knexMock, {all: promiseSpy});
    });

    afterEach(() => {
      knexMock._.resetAll();
    });

    it('creates the `accounts` table correctly', () => {
      expect(knexMock._.schema.spy.createTable).to.be.calledWith('accounts');
      expect(knexMock._.table.spy.increments).to.be.calledWith('id');
      expect(knexMock._.table.spy.primary).to.be.called;
      expect(knexMock._.table.spy.string).to.have.callCount(4);
      expect(knexMock._.table.spy.string).to.be.calledWith('uuid', 64);
      expect(knexMock._.table.spy.string).to.be.calledWith('email', 128);
      expect(knexMock._.table.spy.string).to.be.calledWith('username', 32);
      expect(knexMock._.table.spy.string).to.be.calledWith('password', 256);
      expect(knexMock._.table.spy.integer).to.be.calledWith('session_id');
      expect(knexMock._.table.spy.unsigned).to.be.called;
      expect(knexMock._.table.spy.timestamps).to.be.called;
    });
  });

  context('downwards migration', () => {
    const migration = migrations.down;
    const promiseSpy = sinon.spy();

    beforeEach(() => {
      migration(knexMock, {all: promiseSpy});
    });

    afterEach(() => {
      knexMock._.resetAll();
    });

    it('drops the `accounts` table', () => {
      expect(knexMock._.schema.spy.dropTable).to.be.calledWith('accounts');
    });
  });
});
