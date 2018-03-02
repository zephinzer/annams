const httpAuth = require('http-auth');

module.exports = (expectedUsername, expectedPassword) => {
  const basicAuthentication = httpAuth.basic(
    {realm: 'annams'},
    (username, password, callback) => {
      callback(
        (username === expectedUsername && password === expectedPassword)
      );
    });
  return httpAuth.connect(basicAuthentication);
};
