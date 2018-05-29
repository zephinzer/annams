const faker = require('faker');
const uuid = require('uuid/v4');
const accountPasswordUtility = require('../../../src/account/utility/password');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries before creating new ones
  // Seed user passwords are their emails, we use the generated UUID
  // for the salting
  return knex('accounts').del()
    .then(() => {
      const userCount = 50;
      let mockUsersSeeds = [];
      for (let id = 1; id < userCount; ++id) {
        const userUuid = uuid();
        const userEmail = faker.internet.email();
        mockUsersSeeds.push({
          id,
          uuid: userUuid,
          email: userEmail,
          username: faker.internet.userName(),
          password: accountPasswordUtility.hash(userEmail, userUuid),
        });
      }
      return knex('accounts').insert(mockUsersSeeds);
    });
};
