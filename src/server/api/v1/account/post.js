const account = require('../../../../account');

module.exports = postAccount;

/**
 * Express.js compatible handler that responds with an array of accounts.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
function postAccount(req, res) {
  const {email, username, password} = req.body;
  const {type} = req.query;
  switch (type) {
    case 'e':
      if (!email) {
        throw new Error('Invalid email');
      }
      postAccount.account
        .create({
          email,
          username,
        })
        .then((result) => {
          console.log(' 2 ________________________________');
          console.info(result);
          console.log(' 2 ________________________________');
          res.json(result);
        });
      break;
    case 'epw':
      if (!email) {
        throw new Error('Invalid email');
      } else if (!password) {
        throw new Error('Invalid password');
      }
      postAccount.account
        .create({
          email,
          password,
          username,
        })
        .then((result) => {
          console.log(' 1 ________________________________');
          console.info(result);
          console.log(' 1 ________________________________');
          res.json(result);
        });
      break;
    default:
      throw new Error('Invalid account registration type');
  }
}

postAccount.account = account;
