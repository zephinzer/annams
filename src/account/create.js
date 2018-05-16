const {validate} = require('./utility');

module.exports = createAccount;

/**
 * Creates a new Account with the email :email.
 *
 * If :username is specified, a username will be set.
 * 
 * If :pasword is specified, a password will be set.
 * 
 * @param {Object} db
 * @param {Object} options
 * @param {Object} options.email
 * @param {Object} [options.username=null]
 * @param {Object} [options.password=null]
 */
function createAccount(db, {
  email,
  username = null,
  password = null,
} = {}) {
  const validation = {
    email: validate.email(email),
    username: validate.username(username),
    password: validate.password(password),
  };

  if (!validation.email) {
    throw new Error(`:email specified ("${email}") was invalid.`);
  }

  const insertObject = {email};

  if (username !== null && validation.username) {
    insertObject.username = username;
  }

  if (password !== null && validation.password) {
    insertObject.password = password;
  }

  db('accounts')
    .insert(insertObject)
    .then((res) => {
      console.info(res);
    });
    // TODO
};
