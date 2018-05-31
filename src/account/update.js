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
  if (!userUuid) {
    throw error.missingField('uuid');
  }

  const validation = {
    uuid: utility.validate.uuid(userUuid),
    email: utility.validate.email(email),
    username: utility.validate.username(username),
    password: utility.validate.password(password),
  };

  if (!validation.uuid) {
    throw error.invalidField('uuid', userUuid);
  }

  const updateFields = {};

  if (email !== null) {
    if (!validation.email) {
      throw error.invalidField('email', email);
    } else {
      updateFields.email = email;
    }
  }

  if (username !== null) {
    if (!validation.username) {
      throw error.invalidField('username', username);
    } else {
      updateFields.username = username;
    }
  }

  if (password !== null) {
    if (!validation.password) {
      throw error.invalidSecureField('password');
    } else {
      updateFields.password = utility.password.hash(password, userUuid);
    }
  }

  return db('accounts')
    .where('uuid', '=', userUuid)
    .update(updateFields)
    .then((result) => {
      if (result === 1) {
        return Object.keys(updateFields);
      } else {
        throw new Error();
      }
    })
    .catch(() => {
      return db('accounts')
        .select(utility.constant.accountSelectSerializer)
        .where('uuid', '=', userUuid)
        .then((accounts) => {
          if (!accounts || accounts.length === 0) {
            throw error.accountNotFound(userUuid);
          }
        });
    });
};
