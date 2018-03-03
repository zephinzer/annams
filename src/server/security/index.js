const express = require('express'); // eslint-disable-line no-unused-vars
const helmet = require('helmet');

module.exports = securityHandler;

/**
 * Applies security settings to the specified Express server instance
 * :serverInstance. If :serverInstance is not an instance of {express}, an
 * instance of express will be instantiated and returned.
 *
 * @param {express|express.Router} serverInstance
 *
 * @return {express|express.Router}
 */
function securityHandler(serverInstance = null) {
  const secureServer = (!serverInstance) ?
    express() : serverInstance;
  return securityHandler.connect(secureServer);
};

securityHandler.connect = connectSecurityHandler;

/**
 * Applies security settings to the specified Express server instance
 * :serverInstance.
 *
 * @param {express|express.Router} serverInstance
 *
 * @return {express|express.Router}
 */
function connectSecurityHandler(serverInstance) {
  if (
    Object.getPrototypeOf(serverInstance)
    !== Object.getPrototypeOf(express())
  ) {
    throw new Error('Invalid :serverInstance provided to connectSecurityHandler'); // eslint-disable-line max-len
  }
  serverInstance.use(helmet.hidePoweredBy());
  serverInstance.use(helmet.dnsPrefetchControl());
  serverInstance.use(helmet.xssFilter());
  serverInstance.use(helmet.noSniff());
  serverInstance.use(helmet.noCache());
  serverInstance.use(helmet.ieNoOpen());
  serverInstance.use(helmet.hsts({maxAge: 60 * 60 * 24 * 60}));
  serverInstance.use(helmet.frameguard({action: 'sameorigin'}));
  return serverInstance;
};
