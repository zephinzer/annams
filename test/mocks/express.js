const express = {};

express._ = {};

express._.mock = function(thisArg) {
  const mockedProperty = (...args) => {
    mockedProperty.spy.apply(null, [...args]);
    return thisArg;
  };
  mockedProperty.spy = sinon.spy();
  return mockedProperty;
};

express.request = {};

express.response = {};
express.response._ = {};
express.response._.clear = function() {
  const properties =
    Object.keys(express.response).filter((val) => (val.indexOf('_') !== 0));
  properties.forEach((property) => {
    express.response[property].spy.resetHistory();
  });
};
express.response.json = express._.mock(express.response);
express.response.status = express._.mock(express.response);
express.response.type = express._.mock(express.response);

module.exports = express;
