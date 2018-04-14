const express = require('express');

module.exports = {
  initializeRouter,
  Route,
};

/**
 * Utility function to initialise an Express Router using routes defined in
 * the :routes argument
 *
 * @param {Route[]} [routes=[]]
 * @param {String} [parentPath=null]
 *
 * @return {express.Router}
 */
function initializeRouter(
  routes = [],
  parentPath = null
) {
  const router = new express.Router();
  routes.forEach((route) => {
    try {
      const method = route.method.toLowerCase();
      router[method](route.path, route.handler);
      const fullPath = `${(!parentPath ? '' : parentPath)}${route.path}`;
      console.info(`[${route.method.toUpperCase()} ${fullPath}] registered`);
    } catch (ex) {}
  });
  return router;
};

/**
 * Constructor for a Routes instance used in other utility functions
 *
 * @param {String} [method="GET"]
 * @param {String} [path="/"]
 * @param {Function} [handler=(() => null)]
 *
 * @return {Router}
 */
function Route(
  method = 'GET',
  path = '/',
  handler = (() => null)
) {
  this.method = method;
  this.path = path;
  this.handler = handler;
  return this;
};
