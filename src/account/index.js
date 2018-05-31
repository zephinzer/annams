const db = require('../db');

const create = require('./create').bind(null, db);
const retrieve = require('./retrieve').bind(null, db);
const query = require('./query').bind(null, db);
const update = require('./update').bind(null, db);
// const deleteAccount = require('./delete');

module.exports = {
  create,
  retrieve,
  query,
  update,
  // delete: deleteAccount,
};
