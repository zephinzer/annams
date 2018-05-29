const pbkdf2 = require('pbkdf2');

const password = {
  constant: {
    PBKDF2_DIGEST: 'sha512',
    PBKDF2_ITERATIONS: 512,
    PBKDF2_KEY_LENGTH: 128,
  },
};

module.exports = password;

/**
 * Returns the hash of the password :passwordPlainText salted with the
 * provided :salt.
 *
 * @param {String} passwordPlainText
 * @param {String} salt
 *
 * @return {String}
 */
password.hash = (passwordPlainText, salt) => {
  return (pbkdf2.pbkdf2Sync(
    passwordPlainText,
    salt,
    password.constant.PBKDF2_ITERATIONS,
    password.constant.PBKDF2_KEY_LENGTH,
    password.constant.PBKDF2_DIGEST
  ).toString('base64'));
};

/**
 * Returns true if the provided :passwordPlainText together with the
 * :salt, when hashed equals to the hashed password :passwordHashed.
 *
 * @param {String} salt
 * @param {String} passwordPlainText
 * @param {String} passwordHashed
 *
 * @return {Boolean}
 */
password.verify = (salt, passwordPlainText, passwordHashed) => {
  return (password.hash(passwordPlainText, salt) === passwordHashed);
};

console.info(password.hash('hello', 'world').toString());
