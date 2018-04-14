const express = require('express');

module.exports = api;

/**
 * Returns an Express compatible middleware
 *
 * @return {express.Router}
 */
function api() {
  if (!api.middleware) {
    api.middleware = new express.Router();
    Object.keys(api).forEach((apiVersion) => {
      if (apiVersion.match(api.versionMatcher) !== null) {
        const apiEndpoint = `/api/${apiVersion}`;
        try {
          api.middleware.use(apiEndpoint, api[apiVersion]());
          console.info(`[api] successfully registered path "${apiEndpoint}"`);
        } catch (ex) {
          console.error(ex);
        }
      }
    });
  }
  return api.middleware;
};

api.middleware = null;
api.reset = (() => api.middleware = null);
api.versionMatcher = /v[0-9]+/gi;

// add new versions below with the key names matching the versionMatcher
// property of api
api.v1 = require('./v1');
