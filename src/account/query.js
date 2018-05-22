const db = require('../db');
const utility = require('./utility');

module.exports = queryAccounts;

/**
 * @param {Function} db
 * @param {Object} options
 * @param {Number} options.offset
 * @param {Number} options.limit
 *
 * @return {Promise}
 */
function queryAccounts(
  db,
  {
    offset = utility.constant.defaults.offset,
    limit = utility.constant.defaults.limit,
  } = {}
) {
  const parsedOffset = parseInt(offset, 10);
  const parsedLimit = parseInt(limit, 10);

  return db('accounts')
    .select(utility.constant.accountSelectSerializer)
    .offset(isNaN(parsedOffset)
      ? utility.constant.defaults.offset : parsedOffset
    )
    .limit(isNaN(parsedLimit)
      ? utility.constant.defaults.limit : parsedLimit
    )
    .then((results) => {
      return results;
    });
};
