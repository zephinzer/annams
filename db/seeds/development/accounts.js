const faker = require('faker');
const uuid = require('uuid/v4');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('accounts').del()
    .then(() => {
      const userCount = 50;
      let mockUsersSeeds = [];
      for (let id = 1; id < userCount; ++id) {
        mockUsersSeeds.push({
          id,
          uuid: uuid(),
          email: faker.internet.email(),
          username: faker.internet.userName(),
          password: faker.internet.password(24),
          created_at: null,
          updated_at: null,
        });
      }
      return knex('accounts').insert(mockUsersSeeds);
    });
};
