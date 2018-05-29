const validator = require('./validator');
const password = require('./password');

const accountUtility = {};

module.exports = accountUtility;

accountUtility.validate = validator;
accountUtility.password = password;
accountUtility.constant = {
  accountSelectSerializer: [
    'email',
    'username',
    'uuid',
  ],
  defaults: {
    offset: 0,
    limit: 20,
  },
};
