const {validate} = require('./utility');

const ERROR_INVALID_PARAMETERS = 'Invalid paremeters - one of :id, :username, or :uuid has to be specified'; // eslint-disable-line max-len

module.exports = retrieveAccount;

/**
 * Retrieves an account using the provided options. In order of precedence, the
 * options considered are:
 * 1. email
 * 2. username
 * 3. uuid
 *
 * That is to say, if email is specified, the UUID will not be accounted for
 *
 * @param {Function} db
 * @param {Object} options
 * @param {String} options.email
 * @param {String} options.username
 * @param {String} options.uuid
 *
 * @return {Promise}
 */
function retrieveAccount(
  db,
  {
    id,
    username,
    uuid,
  } = {},
) {
  const validation = {
    id: validate.id(id),
    username: validate.username(username),
    uuid: validate.uuid(uuid),
  };

  if (validation.id) {
    return retrieveAccount.usingId(db, id);
  } else if (validation.username) {
    return retrieveAccount.usingUsername(db, username);
  } else if (validation.uuid) {
    return retrieveAccount.usingUuid(db, uuid);
  } else {
    throw new Error(ERROR_INVALID_PARAMETERS);
  }
};

retrieveAccount.getUser =
  (db, key, value) => {
    return db('accounts')
      .select([
        'email',
        'username',
        'uuid',
        'id',
      ])
      .where(key, '=', value)
      .then((results) => {
        return results;
      });
  };

retrieveAccount.usingId = (db, id) =>
  retrieveAccount.getUser(db, 'id', id);

retrieveAccount.usingUsername = (db, username) =>
  retrieveAccount.getUser(db, 'username', username);

retrieveAccount.usingUuid = (db, uuid) =>
  retrieveAccount.getUser(db, 'uuid', uuid);
