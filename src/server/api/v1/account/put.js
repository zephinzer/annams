const account = require('../../../../account');

const error = require('../../../error');
const utility = require('../../utility');

module.exports = updateAccount;

/**
 * Express.js compatible handler that updates the specified account and returns
 * the account when complete.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.Next} next
 */
function updateAccount(req, res, next) {
  if (!utility.validate.requestHasBody(req)) {
    error.trigger.badRequest();
  }

  const {email, username, password} = req.body;
  const {uuid} = req.params ? req.params : {};

  if (!uuid) {
    error.trigger.badRequest(updateAccount.constant.error.uuidNotFound);
  }

  try {
    updateAccount.account
      .update(uuid, {email, username, password})
      .then((results) => {
        res.json(results);
      })
      .catch((err) => {
        try {
          error.trigger.badRequest(err.message);
        } catch (ex) {
          next(ex);
        }
      });
  } catch (ex) {
    error.trigger.badRequest(ex.message);
  }
};

updateAccount.account = account;
updateAccount.constant = {
  error: {
    uuidNotFound: 'The required parameter :uuid could not be found.',
  },
};
