const {validate} = require('../../../../account/utility');
const account = require('../../../../account');

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
  const validation = {
    id: validate.id(identifier),
    uuid: validate.uuid(identifier),
  };
  const retrieveData = {};
  console.info(identifier);
  if (validation.id === true) {
    retrieveData.id = parseInt(identifier);
  } else if (validation.uuid === true) {
    retrieveData.uuid = identifier;
  } else {
    throw new Error('Invalid identifier provided');
  }
  getAccountWithIdentifier.account
    .retrieve(retrieveData)
    .then((result) => {
      res.json(result);
    });
};

getAccountWithIdentifier.account = account;
