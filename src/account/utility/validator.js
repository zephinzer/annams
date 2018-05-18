const validator = require('validator');
const passwordValidate = require('password-validate');

const config = require('../../config')();

const validate = {};

module.exports = validate;

validate.id = (id) =>
  ((typeof id === 'number') || (parseInt(id) !== NaN)) && (parseInt(id) > 0);

validate.email = (email) => {
  return (
    (typeof email === 'string')
    && validator.isEmail(email)
    && (email.match(/[`~!#$%^&*()=\[\]{}\\|;:'\",<>\/?]/gi) === null)
    && (email.indexOf('-') !== 0)
    && (email.indexOf('-') !== email.indexOf('@') - 1)
    && (email.indexOf('_') !== 0)
    && (email.indexOf('_') !== email.indexOf('@') - 1)
    && (email.indexOf('+') !== 0)
    && (email.indexOf('+') !== email.indexOf('@') - 1)
    && (email.indexOf('.') !== 0)
    && (email.indexOf('.') !== email.indexOf('@') - 1)
    && (validator.isURL(email.split('@')[1]))
  );
};

validate.password = (password, {
  length,
  specials,
  numbers,
  casings,
} = {}) => {
  const minimumLength =
    length !== undefined ?
      length : config.validation.password.length;
  const requiresSpecials =
    specials !== undefined ?
      specials : config.validation.password.has.specials;
  const requiresNumbers =
    numbers !== undefined ?
      numbers : config.validation.password.has.numbers;
  const requiresCasings =
    casings !== undefined ?
      casings : config.validation.password.has.casings;
  return (
    (typeof password === 'string')
    && passwordValidate(password, {
      minimumLength,
      hasSymbols: requiresSpecials,
      hasNumbers: requiresNumbers,
      hasUpperCase: requiresCasings,
      hasLowerCase: false,
    }).is.valid()
  );
};

validate.username = (username) => {
  return (
    (typeof username === 'string')
    && username.match(/[a-zA-Z0-9\-\_\.]/gi)
    && (username.indexOf('.') !== 0)
    && (username.indexOf('.') !== username.length - 1)
  );
};

validate.uuid = (uuid) => {
  return (
    (typeof uuid === 'string')
    && uuid.match(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i) !== null // eslint-disable-line max-len
  );
};
