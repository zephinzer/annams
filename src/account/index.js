const db = require('../db');

// const createAccount = require('./create');
// const deleteAccount = require('./delete');
const retrieveAccount = require('./retrieve');
// const updateAccount = require('./update');

module.exports = {
  // create: createAccount.bind(this, db),
  // delete: deleteAccount,
  retrieve: retrieveAccount.bind(this, db),
  // update: updateAccount,
};
