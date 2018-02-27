module.exports = {
  getAuth: () => require('./auth')(),
  getCors: () => require('./cors')(),
};
