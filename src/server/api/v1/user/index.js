const utility = require('../../utility');
const {Route} = utility;

module.exports = user;

/**
 * @return {utility.RESTfulEntity}
 */
function user() {
  return new utility.RESTfulEntity([
    new Route('post', '/user'),
    new Route('get', '/users'),
    new Route('get', '/user'),
    new Route('get', '/user/:userId'),
    new Route('patch', '/user/group'),
    new Route('delete', '/user'),
  ]).get();
};
