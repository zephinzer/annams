module.exports = retrieveAccount;

/**
 * Retrieves an account using the provided options.
 *
 * @param {Function} db
 * @param {Object} options
 * @param {String} options.email
 * @param {String} options.username
 * @param {String} options.uuid
 *
 * @return {Promise}
 */
function retrieveAccount(db, {
  email,
  username,
  uuid,
} = {}) {
  const validation = {
    email: typeof email === 'string',
    username: typeof username === 'string',
    uuid: typeof uuid === 'string',
  };

  if (validation.email) {
    return retrieveAccount.usingEmail(db, email);
  } else if (validation.username) {
    return retrieveAccount.usingUsername(db, username);
  } else if (validation.uuid) {
    return retrieveAccount.usingUuid(db, uuid);
  } else {
    throw new Error('Invalid paremeters - one of :email, :usenrame, :uuid has to be specified'); // eslint-disable-line max-len
  }
};

retrieveAccount.getUser = (db, key, value) => {
  return db('account')
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

retrieveAccount.usingEmail = (db, email) => {
  return retrieveAccount.getUser(db, 'email', email);
};

retrieveAccount.usingUsername = (db, username) => {
  return retrieveAccount.getUser(db, 'username', username);
};

retrieveAccount.usingUuid = (db, uuid) => {
  return retrieveAccount.getUser(db, 'uuid', uuid);
};
