const validator = require('./validator');

const accountUtility = {};

module.exports = accountUtility;

accountUtility.validate = validator;
accountUtility.constant = {
  accountSelectSerializer: [
    'email',
    'username',
    'uuid',
    'id',
  ],
  defaults: {
    offset: 0,
    limit: 20,
  },
};
