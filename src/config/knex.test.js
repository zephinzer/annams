const knexConfig = require('./knex');

describe('config/knex', () => {
  const testDatabaseConnectionConfig = {
    database: {
      host: '__host',
      port: '__port',
      name: '__db_name',
      auth: {
        username: '__db_username',
        password: '__db_password',
      },
    },
  };

  it('exports a function', () => {
    expect(knexConfig).to.be.a('function');
  });

  it('creates a connection with the correct schema', () => {
    expect(knexConfig(testDatabaseConnectionConfig)).to.have.keys([
      'client',
      'connection',
      'pool',
      'migrations',
      'seeds',
      'debug',
    ]);
  });

  it('creates the correct connection', () => {
    const knexConnectionConfig =
      knexConfig(testDatabaseConnectionConfig).connection;
    expect(knexConnectionConfig).to.eql({
      host: testDatabaseConnectionConfig.database.host,
      port: testDatabaseConnectionConfig.database.port,
      database: testDatabaseConnectionConfig.database.name,
      user: testDatabaseConnectionConfig.database.auth.username,
      password: testDatabaseConnectionConfig.database.auth.password,
    });
  });
});
