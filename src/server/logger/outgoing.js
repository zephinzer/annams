const morgan = require('morgan');

module.exports = () => morgan(
  (tokens, req, res) => {
    return `> [${req.headers.id}] HTTP/${tokens['http-version'](req, res)} ${req.method} ${req.headers.host} ${tokens['url'](req, res)} ${tokens['remote-addr'](req, res)} ${req.header.origin || '-'} ${tokens['referrer'](req, res) || '-'} ${tokens['status'](req, res) || '-'} ${tokens['response-time'](req, res)}ms`; // eslint-disable-line max-len
  }, {
    stream: {write: (content) => console.info(content.trim())},
  }
);
