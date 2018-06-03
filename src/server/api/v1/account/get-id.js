const {validate} = require('../../../../account/utility');
const account = require('../../../../account');

const error = require('../../../error');

module.exports = getAccountWithIdentifier;

/**
 * Express.js compatible handler that responds with an account corresponding
 * to the account identifier specified in the URL query paramaeters.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
function getAccountWithIdentifier(req, res) {
  const {identifier} = req.params;
  const retrieveData =
    getAccountWithIdentifier.validateAndRetrieveIdentifier(identifier);

  getAccountWithIdentifier.account
    .retrieve(retrieveData)
    .then((result) => {
      res.json(result);
    });
};

getAccountWithIdentifier.account = account;

/**
 * Returns an object with either an :id or :uuid property depending on which
 * was validated to be valid. :id is given precedence.
 *
 * @param {String} identifier
 *
 * @return {Object}
 */
getAccountWithIdentifier.validateAndRetrieveIdentifier = (identifier) => {
  const validation = {
    id: validate.id(identifier),
    uuid: validate.uuid(identifier),
  };
  if (validation.id === true) {
    return {id: parseInt(identifier)};
  } else if (validation.uuid === true) {
    return {uuid: identifier};
  } else {
    error.trigger.badRequest(`Invalid identifier ("${identifier}") provided.`);
  }
};
