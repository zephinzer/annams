const logging = require('./');

describe('logging', () => {
  it('is a function', () => {
    expect(logging).to.be.a('function');
  });

  it('has the correct keys', () => {
    expect(logging).to.include.keys([
      'DEFAULT_OVERRIDE_KEYS',
      'overrideDefaultConsoleWith',
      'resetToDefaultConsole',
      '_console',
    ]);
  });

  describe('constructor()', () => {
    let originalConsole = null;

    before(() => {
      originalConsole = logging._console;
      logging._console = null;
      sinon.stub(logging, 'overrideDefaultConsoleWith');
      sinon.stub(logging, 'resetToDefaultConsole');
    });

    after(() => {
      logging._console = originalConsole;
      logging.overrideDefaultConsoleWith.restore();
      logging.resetToDefaultConsole.restore();
    });

    afterEach(() => {
      logging._console = null;
      logging.overrideDefaultConsoleWith.resetHistory();
      logging.resetToDefaultConsole.resetHistory();
    });

    it('works with the specified logger', () => {
      expect(() => logging()).to.not.throw();
    });

    it('overrides the default conosle', () => {
      logging();
      expect(logging.overrideDefaultConsoleWith).to.be.calledOnce;
    });

    it('sets the ._console property', () => {
      expect(logging._console).to.eql(null);
      logging();
      expect(logging._console).to.not.eql(null);
    });
  });

  describe('._console', () => {
    let originalConsole = null;

    before(() => {
      originalConsole = logging._console;

      sinon.stub(logging, 'overrideDefaultConsoleWith');
      sinon.stub(logging, 'resetToDefaultConsole');
    });

    after(() => {
      logging._console = originalConsole;
      logging.overrideDefaultConsoleWith.restore();
      logging.resetToDefaultConsole.restore();
    });

    beforeEach(() => {
      logging._console = null;
    });

    afterEach(() => {
      logging.overrideDefaultConsoleWith.resetHistory();
      logging.resetToDefaultConsole.resetHistory();
    });

    it('is set by calling logging()', () => {
      expect(logging._console).to.eql(null);
      logging();
      expect(logging._console).to.not.eql(null);
    });

    it('includes the correct reset() function', () => {
      logging();
      expect(logging._console.reset).to.be.a('function');
      expect(logging._console.reset).to.eql(logging.resetToDefaultConsole);
    });
  });

  describe('.DEFAULT_OVERRIDE_KEYS', () => {
    it('maps pino/console silent method correctly', () => {
      expect(
        (logging.DEFAULT_OVERRIDE_KEYS.find(
          (where) => where.pino === 'silent')
        ).console
      ).to.eql('silent');
    });

    it('maps pino/console trace method correctly', () => {
      expect(
        (logging.DEFAULT_OVERRIDE_KEYS.find(
          (where) => where.pino === 'trace')
        ).console
      ).to.eql('trace');
    });

    it('maps pino/console log method correctly', () => {
      expect(
        (logging.DEFAULT_OVERRIDE_KEYS.find(
          (where) => where.pino === 'debug')
        ).console
      ).to.eql('log');
    });

    it('maps pino/console info method correctly', () => {
      expect(
        (logging.DEFAULT_OVERRIDE_KEYS.find(
          (where) => where.pino === 'info')
        ).console
      ).to.eql('info');
    });

    it('maps pino/console warn method correctly', () => {
      expect(
        (logging.DEFAULT_OVERRIDE_KEYS.find(
          (where) => where.pino === 'warn')
        ).console
      ).to.eql('warn');
    });

    it('maps pino/console error method correctly', () => {
      expect(
        (logging.DEFAULT_OVERRIDE_KEYS.find(
          (where) => where.pino === 'error')
        ).console
      ).to.eql('error');
    });
  });

  describe('.overrideDefaultConsoleWith()', () => {
    let originalDefaultOverrideKeys = null;

    before(() => {
      originalDefaultOverrideKeys = logging.DEFAULT_OVERRIDE_KEYS;
      originalLoggingConsole = logging._console;
      global.console.a = () => '_global_console_a';
      logging._console = {};
      logging.DEFAULT_OVERRIDE_KEYS = [
        {console: 'a', pino: 'a'},
      ];
    });

    after(() => {
      logging.DEFAULT_OVERRIDE_KEYS = originalDefaultOverrideKeys;
      logging._console = originalLoggingConsole;
      delete global.console.a;
    });

    it('works as expected', () => {
      logging.overrideDefaultConsoleWith({
        a: () => '_logger_console_a',
      });
      expect(global.console.a()).to.eql('_logger_console_a');
    });
  });

  describe('.resetToDefaultConsole()', () => {
    let originalDefaultOverrideKeys = null;

    before(() => {
      originalDefaultOverrideKeys = logging.DEFAULT_OVERRIDE_KEYS;
      originalLoggingConsole = logging._console;
      global.console.a = () => '_global_console_a';
      logging._console = {
        a: () => '_logging_console_a',
      };
      logging.DEFAULT_OVERRIDE_KEYS = [
        {console: 'a'},
      ];
    });

    after(() => {
      logging.DEFAULT_OVERRIDE_KEYS = originalDefaultOverrideKeys;
      logging._console = originalLoggingConsole;
      delete global.console.a;
    });

    it('works as expected', () => {
      logging.resetToDefaultConsole();
      expect(global.console.a()).to.eql('_logging_console_a');
    });
  });
});
