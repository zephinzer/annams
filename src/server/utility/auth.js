const httpAuth = require('http-auth');
const config = require('../../config')();

const basicAuthentication = httpAuth.basic({
  realm: 'annams',
}, (username, password, callback) => {
  callback(
    (config.authn.healthcheck.username === null
      || config.authn.healthcheck.password)
    || (username === config.authn.healthcheck.username
      && password === config.authn.healthcheck.password)
  );
});

module.exports = httpAuth.connect(basicAuthentication);
