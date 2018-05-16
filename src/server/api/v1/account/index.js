const utility = require('../../utility');
const {Route} = utility;

const account = require('../../../../account');

module.exports = user;

/**
 * @return {utility.RESTfulEntity}
 */
function user() {
  return new utility.RESTfulEntity([
    new Route('post', '/account', (req, res) => {
      res.json('lol');
    }),
    new Route('get', '/accounts'),
    new Route('get', '/account'),
    new Route('get', '/account/:accountId'),
    new Route('pathch', '/account/:accountId'),
    new Route('delete', '/account'),
  ]).get();
};
