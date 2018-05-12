const knex = require('knex');
const knexConfig = require('../../knexfile');

module.exports = db;

/**
 * Retursn a singleton instance of a database connector.
 *
 * @param {Object|String} knexOptions
 *
 * @return {Object}
 */
function db(...knexOptions) {
 if (db.instance === null) {
  db.instance = knex(knexConfig);
 }
 return db.instance.apply(this, [...knexOptions]);
};

db.instance = null;

db.reset = () => {
  db.instance = null;
};
