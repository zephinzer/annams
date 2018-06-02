module.exports = {
  connect: connectDefaultMiddleware,
};

/**
 * Adds a GET / method to the provided Express compatible :app which
 * returns a HTTP status 200 with 'ok' body JSON data.
 *
 * @param {express} app
 */
function connectDefaultMiddleware(app) {
  app.get('/', (req, res) => res
    .type('application/json')
    .status(200)
    .json('ok'));
};
