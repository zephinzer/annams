const express = require('express');

const config = require('../../config')();
const expressMock = require('../../../test/mocks/express');

const liveness = require('./');

describe('server/liveness', () => {
  it('is a function', () => {
    expect(liveness).to.be.a('function');
  });

  it('returns an Express Router', () => {
    const livenessHandler = liveness(
      '/_test_liveness_endpoint',
      'username',
      'password',
    );
    expect(
      Object.getPrototypeOf(livenessHandler)
    ).to.eql(
      Object.getPrototypeOf(new express.Router())
    );
  });

  it('works as expected', () => {
    const livenessHandler = liveness();
    livenessHandler.stack[0].route.stack[1]
      .handle(
        expressMock.request,
        expressMock.response
      );
    expect(livenessHandler.stack[0].route.path)
      .to.eql(config.endpoint.live);
    expect(expressMock.response.status.spy).to.be.calledOnce;
    expect(expressMock.response.status.spy).to.be.calledWith(200);
    expect(expressMock.response.json.spy).to.be.calledOnce;
    expect(expressMock.response.json.spy).to.be.calledWith('ok');
    expect(expressMock.response.type.spy).to.be.calledOnce;
    expect(expressMock.response.type.spy)
      .to.be.calledWith('application/json');
  });
});
