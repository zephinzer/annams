const error = require('./error');
const utility = require('./utility');

module.exports = createAccount;

/**
 * Creates a new Account with the email :email.
 *
 * If :username is specified, a username will be set.
 * If :pasword is specified, a password will be set.
 *
 * @param {Object} db
 * @param {Object} options
 * @param {Object} [options.email=null]
 * @param {Object} [options.username=null]
 * @param {Object} [options.password=null]
 *
 * @throws {Error}
 * @return {Promise}
 */
function createAccount(
  db,
  {
    email = null,
    username = null,
    password = null,
  } = {}
) {
  if (!email) {
    throw error.missingField('email');
  }

  const validation = {
    email: utility.validate.email(email),
    username: utility.validate.username(username),
    password: utility.validate.password(password),
  };

  if (!validation.email) {
    throw error.invalidField('email', email);
  }

  const insertObject = {email};

  if (username !== null && validation.username) {
    insertObject.username = username;
  }

  if (password !== null && validation.password) {
    insertObject.password = password;
  }

  return db('accounts')
    .insert(insertObject)
    .then((result) => {
      return result;
    });
};
