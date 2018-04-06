const morgan = require('morgan');

const outgoingLogger = require('./outgoing');

const expressMock = require('../../../test/mocks/express');

describe('server/logger/outgoing', () => {
  it('exports a function', () => {
    expect(outgoingLogger).to.be.a('function');
  });

  it('returns an instance of Morgan', () => {
    const logger = outgoingLogger();
    const morganInstance = morgan(() => '', {});
    expect(Object.getPrototypeOf(logger))
      .to.eql(Object.getPrototypeOf(morganInstance));
  });

  it('has the correct keys', () => {
    expect(outgoingLogger).to.have.keys([
      'formatter',
      'options',
    ]);
  });

  describe('.formatter', () => {
    it('works as expected', () => {
      const tokensMock = {
        'http-version': sinon.spy(),
        'remote-addr': sinon.spy(),
        'referrer': sinon.spy(),
        'response-time': sinon.spy(),
        'status': sinon.spy(),
        'url': sinon.spy(),
      };
      const observedFormat = outgoingLogger.formatter(
        tokensMock,
        expressMock.request,
        expressMock.response
      );
      Object.keys(tokensMock).forEach((tokenKey) => {
        expect(tokensMock[tokenKey])
          .to.be.calledWith(expressMock.request, expressMock.response);
      });
      expect(observedFormat)
        .to.eql(
          '> [_test_express_mock_id] HTTP/undefined ' +
          '_test_express_mock_method undefined undefined ' +
          'undefined _test_express_mock_origin - - undefinedms'
        );
    });
  });

  describe('.options', () => {
    it('has the correct keys and values', () => {
      expect(outgoingLogger.options).to.have.keys([
        'stream',
      ]);
    });

    describe('.stream', () => {
      it('has the correct keys', () => {
        expect(outgoingLogger.options.stream).to.have.keys([
          'write',
        ]);
      });

      describe('.write', () => {
        it('trims the content', () => {
          const content = {
            trim: sinon.spy(),
          };
          outgoingLogger.options.stream.write(content);
          expect(content.trim).to.be.calledOnce;
        });
      });
    });
  });
});

