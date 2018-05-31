module.exports = {
  accountNotFound: (uuid) => {
    const code = 'ERROR_ACCOUNT_NOT_FOUND';
    const status = 404;
    const error = new Error(`The account with UUID ("${uuid}") could not be found.`);
    return Object.assign(error, {code, status});
  },
  invalidField: (fieldName, userValue) => {
    const code = 'ERROR_ACCOUNT_FIELD_INVALID';
    const status = 400;
    const error = new Error(`The provided ${fieldName} ("${userValue}") is invalid.`);
    return Object.assign(error, {code, status});
  },
  invalidSecureField: (fieldName) => {
    const code = 'ERROR_ACCOUNT_FIELD_INVALID';
    const status = 400;
    const error = new Error(`The provided ${fieldName} (-REDACTED-) is invalid.`);
    return Object.assign(error, {code, status});
  },
  missingField: (fieldName) => {
    const code = 'ERROR_ACCOUNT_FIELD_NOT_FOUND';
    const status = 400;
    const error = new Error(`The required field ${fieldName} was not found.`);
    return Object.assign(error, {code, status});
  },
};
