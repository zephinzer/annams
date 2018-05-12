const utility = require('../../utility');
const {Route} = utility;

module.exports = user;

/**
 * @return {utility.RESTfulEntity}
 */
function user() {
  return new utility.RESTfulEntity([
    new Route('post', '/account'),
    new Route('get', '/accounts'),
    new Route('get', '/account'),
    new Route('get', '/account/:accountId'),
    new Route('pathch', '/account/:accountId'),
    new Route('delete', '/account'),
  ]).get();
};
