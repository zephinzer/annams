const grace = require('./index');

describe('grace', () => {
  it('exports a function', () => {
    expect(grace).to.be.a('function');
  });

  describe('process event handlers', () => {
    const INDEX_NOT_FOUND = -1;

    let originalConsoleWarn = null;
    let originalFatalErrorHandler = null;
    let originalProcessEventBinder = null;
    let originalProcessExit = null;
    let consoleWarnSpy = null;
    let graceFatalErrorHandlerSpy = null;
    let processEventBinderSpy = null;
    let processExitSpy = null;
    let handledEvents = null;
    let eventHandlers = null;

    before(() => {
      consoleWarnSpy = sinon.spy();
      processEventBinderSpy = sinon.spy();
      processExitSpy = sinon.spy();
      graceFatalErrorHandlerSpy = sinon.spy();

      originalConsoleWarn = global.console.warn;
      global.console.warn = consoleWarnSpy;
      originalProcessEventBinder = global.process.on;
      global.process.on = processEventBinderSpy;
      originalProcessExit = global.process.exit;
      global.process.exit = processExitSpy;
      originalFatalErrorHandler = grace.fatalErrorHandler;
      grace.fatalErrorHandler = graceFatalErrorHandlerSpy;
    });

    after(() => {
      grace.fatalErrorHandler = originalFatalErrorHandler;
      global.console.warn = originalConsoleWarn;
      global.process.on = originalProcessEventBinder;
      global.process.exit = originalProcessExit;
    });

    beforeEach(() => {
      grace();
      handledEvents = processEventBinderSpy.args.map((argSet) => argSet[0]);
      eventHandlers = processEventBinderSpy.args.map((argSet) => argSet[1]);
    });

    afterEach(() => {
      consoleWarnSpy.resetHistory();
      processEventBinderSpy.resetHistory();
      processExitSpy.resetHistory();
      graceFatalErrorHandlerSpy.resetHistory();
    });

    it('handles uncaught exceptions correctly', () => {
      const eventIndex = handledEvents.indexOf('uncaughtException');
      expect(eventIndex).to.not.eql(INDEX_NOT_FOUND);
      expect(eventHandlers[eventIndex]).to.be.a('function');
      eventHandlers[eventIndex]();
      expect(graceFatalErrorHandlerSpy).to.be.calledOnce;
      expect(graceFatalErrorHandlerSpy.args[0])
        .to.contain('UNCAUGHT_EXCEPTION');
    });

    it('handles unhandled Promise rejections correctly', () => {
      const eventIndex = handledEvents.indexOf('unhandledRejection');
      expect(eventIndex).to.not.eql(INDEX_NOT_FOUND);
      expect(eventHandlers[eventIndex]).to.be.a('function');
      eventHandlers[eventIndex]();
      expect(graceFatalErrorHandlerSpy).to.be.calledOnce;
      expect(graceFatalErrorHandlerSpy.args[0])
        .to.contain('UNHANDLED_REJECTION');
    });

    it('handles SIGINT correctly', () => {
      const eventIndex = handledEvents.indexOf('SIGINT');
      expect(eventIndex).to.not.eql(INDEX_NOT_FOUND);
      expect(eventHandlers[eventIndex]).to.be.a('function');
      eventHandlers[eventIndex]();
      expect(processExitSpy).to.be.calledOnce;
      expect(processExitSpy).to.be.calledWith(127);
    });

    it('handles SIGTERM correctly', () => {
      const eventIndex = handledEvents.indexOf('SIGTERM');
      expect(eventIndex).to.not.eql(INDEX_NOT_FOUND);
      expect(eventHandlers[eventIndex]).to.be.a('function');
      eventHandlers[eventIndex]();
      expect(processExitSpy).to.be.calledOnce;
      expect(processExitSpy).to.be.calledWith(127);
    });

    it('handles the exit event correctly', () => {
      const eventIndex = handledEvents.indexOf('exit');
      expect(eventIndex).to.not.eql(INDEX_NOT_FOUND);
      expect(eventHandlers[eventIndex]).to.be.a('function');
    });
  });

  describe('.fatalErrorHandler()', () => {
    let originalConsoleError = null;
    let originalProcessExit = null;
    let consoleErrorSpy = null;
    let processExitSpy = null;

    before(() => {
      consoleErrorSpy = sinon.spy();
      processExitSpy = sinon.spy();
      originalConsoleError = global.console.error;
      global.console.error = consoleErrorSpy;
      originalProcessExit = global.process.exit;
      global.process.exit = processExitSpy;
    });

    after(() => {
      global.console.error = originalConsoleError;
      global.process.exit = originalProcessExit;
    });

    afterEach(() => {
      consoleErrorSpy.resetHistory();
      processExitSpy.resetHistory();
    });

    it('displays message if error contains a message property', () => {
      grace.fatalErrorHandler('code', {message: '_test_message'});
      expect(consoleErrorSpy).to.be.calledWith(
        'code:',
        '_test_message'
      );
    });

    it('displays the stack', () => {
      grace.fatalErrorHandler('code', {stack: '_test_stack'});
      expect(consoleErrorSpy).to.be.calledWith(
        'code:',
        '_test_stack'
      );
    });

    it('exits with status code 1', () => {
      grace.fatalErrorHandler();
      expect(processExitSpy).to.be.calledOnce;
    });
  });
});
