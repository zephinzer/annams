const account = require('../../../../account');

const error = require('../../../error');
const utility = require('../../utility');

module.exports = postAccount;

/**
 * Express.js compatible handler that responds with an array of accounts.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.Next} next
 */
function postAccount(req, res, next) {
  if (!utility.validate.requestHasBody(req)) {
    error.trigger.badRequest();
  }

  const {email, username, password} = req.body;

  let accountObject = {};
  if (email && typeof email === 'string' && email.length > 0) {
    accountObject.email = email;
  } else {
    error.trigger.badRequest(postAccount.constant.error.emailNotFound);
  }

  if (username && typeof username === 'string' && username.length > 0) {
    accountObject.username = username;
  }

  if (password && typeof password === 'string' && password.length > 0) {
    accountObject.password = password;
  }

  postAccount.account
    .register(accountObject)
    .then((result) => res.json(result))
    .catch((err) => {
      try {
        error.trigger.badRequest(err.message);
      } catch (err) {
        next(err);
      }
    });
};

postAccount.account = account;
postAccount.constant = {
  error: {
    emailNotFound: 'Required parameter :email could not be found',
  },
};
