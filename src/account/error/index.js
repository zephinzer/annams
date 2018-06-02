module.exports = {
  accountNotFound: (uuid) => {
    const code = 'ERROR_ACCOUNT_NOT_FOUND';
    const status = 404;
    const error = new Error(`The account with UUID ("${uuid}") could not be found.`); // eslint-disable-line max-len
    return Object.assign(error, {code, status});
  },
  invalidField: (fieldName, userValue) => {
    const code = 'ERROR_ACCOUNT_FIELD_INVALID';
    const status = 400;
    const error = new Error(`The provided ${fieldName} ("${userValue}") is invalid.`); // eslint-disable-line max-len
    return Object.assign(error, {code, status});
  },
  invalidSecureField: (fieldName) => {
    const code = 'ERROR_ACCOUNT_FIELD_INVALID';
    const status = 400;
    const error = new Error(`The provided ${fieldName} (-REDACTED-) is invalid.`); // eslint-disable-line max-len
    return Object.assign(error, {code, status});
  },
  missingField: (fieldName) => {
    const code = 'ERROR_ACCOUNT_FIELD_NOT_FOUND';
    const status = 400;
    const error = new Error(`The required field ${fieldName} was not found.`); // eslint-disable-line max-len
    return Object.assign(error, {code, status});
  },
  dbOperationFailed: () => {
    const code = 'ERROR_ACCOUNT_OPERATION_FAILED';
    const status = 500;
    const error = new Error(`A database operation has failed.`); // eslint-disable-line max-len
    return Object.assign(error, {code, status});
  },
};
