module.exports = livenessRouteHandler;

function livenessRouteHandler(req, res) {
  res
    .type('application/json')
    .status(200)
    .json('ok');
};
