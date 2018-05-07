// Update with your config settings.

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: '127.0.0.1',
      port: '13306',
      database: 'annams',
      user: 'annams_user',
      password: 'annams_password',
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
