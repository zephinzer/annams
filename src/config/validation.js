const utility = require('./utility');

const DEFAULT_PASSWORD_LENGTH = 8;
const DEFAULT_PASSWORD_HAS_SPECIALS = true;
const DEFAULT_PASSWORD_HAS_NUMBERS = true;
const DEFAULT_PASSWORD_HAS_CASINGS = true;

module.exports = () => ({
  password: {
    length: utility.integerFromEnv(
      'VALIDATION_PASSWORD_LENGTH',
      DEFAULT_PASSWORD_LENGTH
    ),
    has: {
      specials: utility.booleanFromEnv(
        'VALIDATION_PASSWORD_HAS_SPECIALS',
        DEFAULT_PASSWORD_HAS_SPECIALS
      ),
      numbers: utility.booleanFromEnv(
        'VALIDATION_PASSWORD_HAS_NUMBERS',
        DEFAULT_PASSWORD_HAS_NUMBERS
      ),
      casings: utility.booleanFromEnv(
        'VALIDATION_PASSWORD_HAS_CASINGS',
        DEFAULT_PASSWORD_HAS_CASINGS
      ),
    },
  },
});

utility.reportStatus('VALIDATION_PASSWORD_LENGTH', module.exports().password.length); // eslint-disable-line max-len
utility.reportStatus('VALIDATION_PASSWORD_HAS_SPECIALS', module.exports().password.has.specials); // eslint-disable-line max-len
utility.reportStatus('VALIDATION_PASSWORD_HAS_NUMBERS', module.exports().password.has.numbers); // eslint-disable-line max-len
utility.reportStatus('VALIDATION_PASSWORD_HAS_CASINGS', module.exports().password.has.casings); // eslint-disable-line max-len
