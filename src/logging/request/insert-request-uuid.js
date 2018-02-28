const uuid = require('uuid/v4');

module.exports = () => (req, res, next) => {
  req.headers.uuid = uuid();
  next();
};
