module.exports = {
  requestHasBody,
};

/**
 * Validates whether the request has a body.
 *
 * @param {express.Request} req
 *
 * @return {Boolean}
 */
function requestHasBody(req = {}) {
  return (
      (!!req) &&
        (typeof req.body === 'object') &&
        (Object.keys(req.body).length > 0)
    );
};
