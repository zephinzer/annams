const morgan = require('morgan');

module.exports = () => morgan(
  (tokens, req, res) => {
    return `< [${req.headers.uuid}] HTTP/${tokens['http-version'](req, res)} ${req.method} ${req.headers.host} ${tokens['url'](req, res)} ${tokens['remote-addr'](req, res)} ${req.header.origin || '-'} ${tokens['referrer'](req, res) || '-'} ${tokens['user-agent'](req, res) || '-'}`; // eslint-disable-line max-len
  }, {
    immediate: true,
    stream: {write: (content) => console.info(content.trim())},
  }
);
