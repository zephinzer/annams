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

    it('creates the `sessions` table correctly', () => {
      expect(knexMock._.schema.spy.createTable).to.be.calledWith('sessions');
      expect(knexMock._.table.spy.increments).to.be.calledWith('id');
      expect(knexMock._.table.spy.integer).to.be.calledWith('account_id');
      expect(knexMock._.table.spy.unsigned).to.be.calledOnce;
      expect(knexMock._.table.spy.string).to.be.calledWith('ip_address_v4', 15);
      expect(knexMock._.table.spy.string).to.be.calledWith('ip_address_v6', 39);
      expect(knexMock._.table.spy.string).to.be.calledWith('user_agent', 512);
      expect(knexMock._.table.spy.dateTime).to.be.calledWith('started_at');
      expect(knexMock._.table.spy.dateTime).to.be.calledWith('updated_at');
      expect(knexMock._.table.spy.dateTime).to.be.calledWith('ended_at');
      expect(knexMock._.table.spy.defaultTo)
        .to.be.calledWithExactly(knexMock._.fn.mock.now());
      expect(knexMock._.table.spy.defaultTo).to.be.calledTwice;
    });

    it('creates the foreign keys for `sessions`.`account_id` correctly', () => {
      expect(knexMock._.schema.spy.alterTable).to.be.calledWith('sessions');
      expect(knexMock._.table.spy.foreign).to.be.calledWith('account_id');
      expect(knexMock._.table.spy.references).to.be.calledWith('id');
      expect(knexMock._.table.spy.inTable).to.be.calledWith('accounts');
    });

    it('creates the foreign keys for `accounts`.`session_id` correctly', () => {
      expect(knexMock._.schema.spy.alterTable).to.be.calledWith('accounts');
      expect(knexMock._.table.spy.foreign).to.be.calledWith('session_id');
      expect(knexMock._.table.spy.references).to.be.calledWith('id');
      expect(knexMock._.table.spy.inTable).to.be.calledWith('sessions');
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

    it('removes the foreign key for `accounts`.`session_id`', () => {
      expect(knexMock._.schema.spy.alterTable).to.be.calledWith('accounts');
      expect(knexMock._.table.spy.dropForeign).to.be.calledWith('session_id');
      expect(knexMock._.spy.raw).to.be.calledWithMatch(
        /^alter[\D\w]+accounts[\D\w]+drop key[\D\w]+session_id_foreign`$/
      );
    });

    it('removes the foreign key for `sessions`.`account_id`', () => {
      expect(knexMock._.schema.spy.alterTable).to.be.calledWith('sessions');
      expect(knexMock._.table.spy.dropForeign).to.be.calledWith('account_id');
      expect(knexMock._.spy.raw).to.be.calledWithMatch(
        /^alter[\D\w]+sessions[\D\w]+drop key[\D\w]+account_id_foreign`$/
      );
    });

    it('drops the `sessions` table', () => {
      expect(knexMock._.schema.spy.dropTable).to.be.calledWith('sessions');
    });
  });
});
