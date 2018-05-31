const utility = require('../../utility');

const {Route} = utility;

module.exports = account;

/**
 * @return {utility.RESTfulEntity}
 */
function account() {
  return new utility.RESTfulEntity([
    new Route('head', '/_account', (req, res) => {
      res
        .status(418)
        .json('ok');
    }),
    new Route('post', '/account', require('./post')),
    new Route('delete', '/account/:uuid'),
    new Route('get', '/accounts', require('./get')),
    new Route('get', '/account/:identifier', require('./get-id')),
    new Route('put', '/account/:uuid', require('./put')),
    new Route('patch', '/account/:accountId'),
  ]).get();
};
