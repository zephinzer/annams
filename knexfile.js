// Update with your config settings.

const config = require('./src/config')();

// TODO: replace values with those from config
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: config.database.host,
      port: config.database.port,
      database: config.database.name,
      user: config.database.auth.username,
      password: config.database.auth.password,
    },
    pool: {
      min: 10,
      max: 15,
    },
    migrations: {
      directory: './db/migrations/development',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: './db/seeds/development',
    },
    debug: true,
  },
};
