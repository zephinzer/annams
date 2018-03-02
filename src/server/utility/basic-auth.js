const httpAuth = require('http-auth');

module.exports = (expectedUsername, expectedPassword) => {
  return (expectedUsername === null || expectedPassword === null) ?
    (req, res, next) => next()
    : httpAuth.connect(httpAuth.basic(
        {realm: 'annams'},
        (username, password, callback) => {
          callback(
            (username === expectedUsername && password === expectedPassword)
          );
        }));
};
