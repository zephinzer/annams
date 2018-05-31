const utility = require('../../utility');

const {Route} = utility;

module.exports = account;

/**
 * @return {utility.RESTfulEntity}
 */
function account() {
  return new utility.RESTfulEntity([
    new Route('post', '/account', require('./post')),
    new Route('get', '/accounts', require('./get')),
    new Route('get', '/account/:identifier', require('./get-id')),
    new Route('put', '/account/:uuid', require('./put')),
    new Route('patch', '/account/:accountId'),
    new Route('delete', '/account'),
  ]).get();
};
