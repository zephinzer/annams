const account = require('../../../../account');

module.exports = getAccount;

/**
 * Express.js compatible handler that responds with an array of accounts.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
function getAccount(req, res) {
  const {offset, limit} = req.query;
  getAccount.account
    .query({offset, limit})
    .then((results) => {
      res.json(results);
    });
};

getAccount.account = account;
