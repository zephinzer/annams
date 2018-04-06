const requestIdLogger = require('./request-id');

describe('server/logger/request-id', () => {
  context('tracer is not provided', () => {
    it('works as expected', () => {
      const middleware = requestIdLogger();
      const request = {headers: {}};
      middleware(request, null, () => ({}));
      expect(request.headers).to.have.key('id');
      expect(
        request.headers.id.match(
          /^[a-f0-9]{8}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{12}/gi
        )[0]
      ).to.eql(request.headers.id);
    });
  });

  context('tracer is defined', () => {
    it('sets the ID of the request header correctly', () => {
      const contextSpy = sinon.spy();
      const tracerMock = {
        context: (...args) => {
          contextSpy.apply(null, [...args]);
          return {
            traceId: '_test_request_id_trace_id',
          };
        },
      };
      const middleware = requestIdLogger(tracerMock);
      const request = {headers: {}};
      middleware(request, null, () => ({}));
      expect(request.headers).to.have.key('id');
      expect(request.headers.id).to.eql('_test_request_id_trace_id');
    });
  });
});
