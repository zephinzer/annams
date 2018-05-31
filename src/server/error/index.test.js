const error = require('./');

const expressMock = require('../../../test/mocks/express');

describe('server/error', () => {
  it('exports a function', () => {
    expect(error).to.be.a('function');
  });

  it('has the right keys', () => {
    expect(error).to.have.keys([
      'instance',
      'generateErrorResponse',
      'trigger',
    ]);
  });

  it('returns an object with the correct keys and type', () => {
    expect(error()).to.have.keys([
      'notFound',
      'serverError',
    ]);
  });
  describe('.trigger', () => {
    const verifyConformsToStandard = (errorTrigger) => {
      expect(() => errorTrigger()).to.throw(Error);
      try {
        errorTrigger();
      } catch (ex) {
        expect(ex).to.have.keys(['status', 'code']);
        expect(ex.message).to.not.be.empty;
      }
    };

    it('has the right keys', () => {
      expect(error.trigger).to.have.keys([
        'badRequest',
      ]);
    });

    describe('.badRequest()', () => {
      it('triggers an error with the correct properties', () => {
        verifyConformsToStandard(error.trigger.badRequest);
      });
    });
  });

  describe('.notFound()', () => {
    before(() => {
      sinon.stub(error, 'generateErrorResponse');
    });

    beforeEach(() => {
      expressMock.response._.reset();
      error.generateErrorResponse.resetHistory();
    });

    after(() => {
      error.generateErrorResponse.restore();
    });

    it('is a function', () => {
      expect(error().notFound).to.be.a('function');
    });

    it('works as expected', () => {
      error().notFound({
        method: '__test_method',
        path: '/__test/__path',
      }, expressMock.response, expressMock.next);
      expect(expressMock.next.spy).to.be.calledWithExactly({
        code: 'ERROR_ROUTE_NOT_FOUND',
        message: 'The requested route (__test_method /__test/__path) could not be found.', // eslint-disable-line max-len
        status: 404,
      });
    });
  });

  describe('.serverError()', () => {
    before(() => {
      sinon.stub(error, 'generateErrorResponse');
    });

    beforeEach(() => {
      expressMock.response._.reset();
      error.generateErrorResponse.resetHistory();
    });

    after(() => {
      error.generateErrorResponse.restore();
    });

    it('is a function', () => {
      expect(error().serverError).to.be.a('function');
    });

    it('works as expected if a null error was thrown', () => {
      error().serverError(null, {id: '_test_id'}, expressMock.response, null);
      expect(expressMock.response.status.spy).to.be.calledWithExactly(500);
      expect(expressMock.response.json.spy).to.be.calledOnce;
      expect(error.generateErrorResponse).to.be.calledOnce;
      expect(error.generateErrorResponse).to.be.calledWithExactly(
        'ERROR_GENERIC',
        'An unknown error occurred.',
        '_test_id',
      );
    });

    it('works as expected if a proper error was thrown', () => {
      const testCodeValue = '__test_code';
      const testMessagevalue = '__test_message';

      error().serverError({
        code: testCodeValue,
        message: testMessagevalue,
      }, null, expressMock.response, null);
      expect(expressMock.response.status.spy).to.be.calledWithExactly(500);
      expect(expressMock.response.json.spy).to.be.calledOnce;
      expect(error.generateErrorResponse).to.be.calledOnce;
      expect(error.generateErrorResponse).to.be.calledWithExactly(
        testCodeValue,
        testMessagevalue,
        '---',
      );
    });
  });
});
