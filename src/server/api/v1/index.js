const express = require('express');

module.exports = v1;

/**
 * Returns a singleton instance of an Express compatible middleware that
 * provides the RESTful API for Annams
 *
 * @return {express.Router}
 */
function v1() {
  if (!v1.instance) {
    v1.instance = new express.Router();
    v1.restfulEntities.forEach((restfulEntity) => {
      try {
        v1.instance.use(v1.getApiComponent(restfulEntity));
        console.info(`[v1] sucessfully registered entity \`${restfulEntity}\``);
      } catch (ex) {
        console.error(ex);
      }
    });
  }
  return v1.instance;
};

v1.instance = null;
/**
 * This array determines what directories will be loaded as a module
 * relative to this directory.
 */
v1.restfulEntities = [
  'account',
];
v1.getApiComponent = (componentName) => require(`./${componentName}`)();
