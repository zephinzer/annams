exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('sessions', (table) => {
      table.increments('id').primary();
      table.integer('account_id').unsigned();
      table.string('ip_address_v4', 15);
      table.string('ip_address_v6', 39);
      table.string('user_agent', 512);
      table.dateTime('started_at').defaultTo(knex.fn.now());
      table.dateTime('updated_at').defaultTo(knex.fn.now());
      table.dateTime('ended_at');
    }),
    knex.schema.alterTable('sessions', (table) => {
      table.foreign('account_id').references('id').inTable('accounts');
    }),
    knex.schema.alterTable('accounts', (table) => {
      table.foreign('session_id').references('id').inTable('sessions');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('accounts', (table) => {
      table.dropForeign('session_id');
    }),
    // required to drop the KEY, bug in Knex
    knex.raw('alter table `accounts` drop key `accounts_session_id_foreign`'),
    knex.schema.alterTable('sessions', (table) => {
      table.dropForeign('account_id');
    }),
    // required to drop the KEY, bug in Knex
    knex.raw('alter table `sessions` drop key `sessions_account_id_foreign`'),
    knex.schema.dropTable('sessions'),
  ]);
};
