const morgan = require('morgan');

const incomingLogger = require('./incoming');

const expressMock = require('../../../test/mocks/express');

describe('server/logger/incoming', () => {
  it('exports a function', () => {
    expect(incomingLogger).to.be.a('function');
  });

  it('returns an instance of Morgan', () => {
    const logger = incomingLogger();
    const morganInstance = morgan(() => '', {});
    expect(Object.getPrototypeOf(logger))
      .to.eql(Object.getPrototypeOf(morganInstance));
  });

  it('has the correct keys', () => {
    expect(incomingLogger).to.have.keys([
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
        'user-agent': sinon.spy(),
        'url': sinon.spy(),
      };
      const observedFormat = incomingLogger.formatter(
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
          '< [_test_express_mock_id] HTTP/undefined ' +
          '_test_express_mock_method undefined undefined ' +
          'undefined _test_express_mock_origin - -'
        );
    });
  });

  describe('.options', () => {
    it('has the correct keys and values', () => {
      expect(incomingLogger.options).to.have.keys([
        'immediate',
        'stream',
      ]);
    });

    describe('.stream', () => {
      it('has the correct keys', () => {
        expect(incomingLogger.options.stream).to.have.keys([
          'write',
        ]);
      });

      describe('.write', () => {
        it('trims the content', () => {
          const content = {
            trim: sinon.spy(),
          };
          incomingLogger.options.stream.write(content);
          expect(content.trim).to.be.calledOnce;
        });
      });
    });
  });
});
