const error = require('./error');
const utility = require('./utility');

module.exports = updateAccount;

/**
 *
 * @param {Object} db
 * @param {String} userUuid
 * @param {Object} updateFields
 * @param {String} updateFields.email
 * @param {String} updateFields.username
 * @param {String} updateFields.password
 *
 * @throws {Error}
 * @return {Promise}
 */
function updateAccount(
  db,
  userUuid = null,
  {
    email = null,
    username = null,
    password = null,
  } = {},
) {
  const {
    checkAccountWithUuidExists,
    updateAccountWithUuid,
    validateUuid,
    validateEmail,
    validateUsername,
    validatePassword,
  } = updateAccount.utility;
  const updateFields = {};

  validateUuid(userUuid);
  validateEmail(email);
  updateFields.email = email;
  validateUsername(username);
  updateFields.username = username;
  validatePassword(password);
  updateFields.password = utility.password.hash(password, userUuid);

  return updateAccountWithUuid(db, userUuid, updateFields)
    .then((result) => (result === 1) ? Object.keys(updateFields) : null)
    .then((updateFields) =>
      (updateFields !== null) ?
        updateFields
        : checkAccountWithUuidExists(db, userUuid)
    );
};

updateAccount.utility = {
  checkAccountWithUuidExists: (db, uuidValue) => {
    return db('accounts')
      .select(utility.constant.accountSelectSerializer)
      .where('uuid', '=', uuidValue)
      .then((accounts) => {
        if (!accounts || accounts.length === 0) {
          throw error.accountNotFound(uuidValue);
        } else {
          throw error.dbOperationFailed();
        }
      });
  },
  updateAccountWithUuid: (db, uuidValue, updateFields) => {
    return db('accounts')
      .where('uuid', '=', uuidValue)
      .update(updateFields);
  },
  validateUuid: (uuidValue) => {
    if (!uuidValue) {
      throw error.missingField('uuid');
    }
    const valid = utility.validate.uuid(uuidValue);
    if (!valid) {
      throw error.invalidField('uuid', uuidValue);
    }
  },
  validateEmail: (emailValue) => {
    if (emailValue !== null) {
      const valid = utility.validate.email(emailValue);
      if (!valid) {
        throw error.invalidField('email', emailValue);
      }
    }
  },
  validateUsername: (usernameValue) => {
    if (usernameValue !== null) {
      const valid = utility.validate.username(usernameValue);
      if (!valid) {
        throw error.invalidField('username', usernameValue);
      }
    }
  },
  validatePassword: (passwordValue) => {
    if (passwordValue !== null) {
      const valid = utility.validate.password(passwordValue);
      if (!valid) {
        throw error.invalidSecureField('password');
      }
    }
  },
};
