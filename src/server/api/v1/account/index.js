const utility = require('../../utility');
const {validate} = require('../../../../account/utility');
const {Route} = utility;

const account = require('../../../../account');

module.exports = user;

/**
 * @return {utility.RESTfulEntity}
 */
function user() {
  return new utility.RESTfulEntity([
    new Route('post', '/account'),
    new Route('get', '/accounts'),
    new Route('get', '/account'),
    new Route('get', '/account/:identifier', (req, res) => {
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
      account.retrieve(retrieveData).then((accounts) => {
        res.json(accounts);
      });
    }),
    new Route('pathch', '/account/:accountId'),
    new Route('delete', '/account'),
  ]).get();
};
