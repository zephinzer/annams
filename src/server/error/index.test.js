const error = require('./');

const expressMock = require('../../../test/mocks/express');

describe('server/error', () => {
  it('exports a function', () => {
    expect(error).to.be.a('function');
  });

  it('returns an object with the correct keys and type', () => {
    expect(error()).to.have.keys([
      'notFound',
      'serverError',
    ]);
  });

  describe('.notFound()', () => {
    before(() => {
      sinon.stub(error, 'generateErrorResponse');
    });

    beforeEach(() => {
      expressMock.response._.clear();
      error.generateErrorResponse.resetHistory();
    });

    after(() => {
      error.generateErrorResponse.restore();
    });

    it('is a function', () => {
      expect(error().notFound).to.be.a('function');
    });

    it('works as expected', () => {
      error().notFound(null, expressMock.response, null);
      expect(expressMock.response.status.spy).to.be.calledWith(404);
      expect(expressMock.response.json.spy).to.be.calledOnce;
      expect(error.generateErrorResponse).to.be.calledOnce;
      expect(error.generateErrorResponse).to.be.calledWith(
        'ERROR_NOT_FOUND',
        'not found'
      );
    });
  });

  describe('.serverError()', () => {
    before(() => {
      sinon.stub(error, 'generateErrorResponse');
    });

    beforeEach(() => {
      expressMock.response._.clear();
      error.generateErrorResponse.resetHistory();
    });

    after(() => {
      error.generateErrorResponse.restore();
    });

    it('is a function', () => {
      expect(error().serverError).to.be.a('function');
    });

    it('works as expected if a null error was thrown', () => {
      error().serverError(null, null, expressMock.response, null);
      expect(expressMock.response.status.spy).to.be.calledWith(500);
      expect(expressMock.response.json.spy).to.be.calledOnce;
      expect(error.generateErrorResponse).to.be.calledOnce;
      expect(error.generateErrorResponse).to.be.calledWith(
        'ERROR_GENERIC',
        'unknown'
      );
    });

    it('works as expected if a proper error was thrown', () => {
      const testCodeValue = '__test_code';
      const testMessagevalue = '__test_message';

      error().serverError({
        code: testCodeValue,
        message: testMessagevalue,
      }, null, expressMock.response, null);
      expect(expressMock.response.status.spy).to.be.calledWith(500);
      expect(expressMock.response.json.spy).to.be.calledOnce;
      expect(error.generateErrorResponse).to.be.calledOnce;
      expect(error.generateErrorResponse).to.be.calledWith(
        testCodeValue,
        testMessagevalue
      );
    });
  });
});
