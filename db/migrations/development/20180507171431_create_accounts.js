exports.up = function(knex, Promise) {
  return knex.schema.createTable('accounts', (table) => {
    table.increments('id').primary();
    table.string('uuid', 64);
    table.string('email', 128);
    table.string('username', 32);
    table.string('password', 256);
    table.integer('session_id').unsigned();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at').defaultTo(knex.fn.now()).notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('accounts');
};
