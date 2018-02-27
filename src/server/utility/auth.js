const httpAuth = require('http-auth');
const config = require('../../config')();

let basicAuthentication = null;

module.exports = () => {
  if (basicAuthentication === null) {
    basicAuthentication = httpAuth.basic({
      realm: 'annams',
    }, (username, password, callback) => {
      callback(
        (config.authn.healthcheck.username === null
          || config.authn.healthcheck.password)
        || (username === config.authn.healthcheck.username
          && password === config.authn.healthcheck.password)
      );
    });
  }
  return httpAuth.connect(basicAuthentication)
};
