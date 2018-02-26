const readiness = require('./controller');
module.exports = readinessRouteHandler;

async function readinessRouteHandler(req, res) {
  const status = await readiness.getStatus();
  (!status) && console.error(readiness.error);
  res
    .type('application/json')
    .status(status ? 200 : 503)
    .json(status ? 'ok' : {
      database: readiness.status.database,
      cache: readiness.status.cache,
    });
};
