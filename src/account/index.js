const db = require('../db');

const create = require('./create').bind(null, db);
const retrieve = require('./retrieve').bind(null, db);
const query = require('./query').bind(null, db);
// const updateAccount = require('./update');
// const deleteAccount = require('./delete');

module.exports = {
  create,
  retrieve,
  query,
  // delete: deleteAccount,
  // update: updateAccount,
};
