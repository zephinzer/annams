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

express.next = express._.mock(express.next);
express.next._ = {
  reset: () => {
    express.next.spy.resetHistory();
  },
};

express.request = {};
express.request._ = {
  reset: () => {
    express.request.headers = {};
    express.request.headers.id = '_test_express_mock_id';
    express.request.header = {};
    express.request.header.origin = '_test_express_mock_origin';
    express.request.host = '_test_express_mock_host';
    express.request.method = '_test_express_mock_method';
  },
};
express.request._.reset();

express.response = {};
express.response._ = {};
express.response._.reset = function() {
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
