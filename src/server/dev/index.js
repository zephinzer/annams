const express = require('express');
const fs = require('fs');
const path = require('path');

module.exports = devMiddleware;

/**
 * Middleware providing for development tools and artifacts
 *
 * @return {Function}
 */
function devMiddleware() {
  const router = new express.Router();
  if (fs.existsSync(devMiddleware.constant.coveragePath)) {
    router.use(
      devMiddleware.constant.middlewarePath,
      express.static(devMiddleware.constant.coveragePath)
    );
  }
  return router;
};

devMiddleware.constant = {
  coveragePath: path.join(__dirname, '../../../coverage'),
  middlewarePath: '/dev/coverage',
};
