const express = require('express');

const validate = require('./validate');

module.exports = {
  initializeRouter,
  RESTfulEntity,
  Route,
  validate,
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
 * @param {Function} [handler=((_, r) => r.json('TODO'))]
 *
 * @return {Router}
 */
function Route(
  method = 'GET',
  path = '/',
  handler = ((_, r) => r.json('TODO'))
) {
  this.method = method;
  this.path = path;
  this.handler = handler;
  return this;
};

/**
 * Constructor for an Entity instance used as a factory to create RESTful
 * entities.
 *
 * @param {Route[]} routes
 *
 * @return {RESTfulEntity}
 */
function RESTfulEntity(routes) {
  if (!(routes instanceof Array) || routes.length === 0) {
    throw new TypeError(':routes should be an array of Route instances');
  }
  routes.forEach((route) => {
    if (!(route instanceof Route)) {
      throw new TypeError(':routes should contain only Route instances');
    }
  });
  this.routes = routes;
  this.instance = RESTfulEntity.initialize(this.routes);
  return this;
};

RESTfulEntity.prototype.get = function() {
  return this.instance;
};

RESTfulEntity.initialize = (routes) => initializeRouter(routes);
