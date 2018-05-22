const queryAccounts = require('./query');
const utility = require('./utility');

const knexMock = require('../../test/mocks/knex');

describe.only('account/query', () => {
  it('exports a function', () => {
    expect(queryAccounts).to.be.a('function');
  });

  describe('.constructor()', () => {
    beforeEach(() => {
      knexMock._.resetAll();
    });

    context('using defaults', () => {
      it('works as expected', () => {
        knexMocked = queryAccounts(knexMock);
        expect(knexMocked.spy.constructor).to.be.calledWith('accounts');
        expect(knexMocked.spy.offset)
          .to.be.calledWith(utility.constant.defaults.offset);
        expect(knexMocked.spy.limit)
          .to.be.calledWith(utility.constant.defaults.limit);
        expect(knexMocked.spy.then.args[0][0]('__test_result'))
          .to.eql('__test_result');
      });
    });

    context('using a custom offset', () => {
      const testOffsetValue = 123456789;

      it('works as expected', () => {
        knexMocked = queryAccounts(knexMock, {offset: testOffsetValue});
        expect(knexMocked.spy.offset).to.be.calledWith(testOffsetValue);
      });
    });

    context('using a custom limit', () => {
      const testLimitvalue = 123456789;

      it('works as expected', () => {
        knexMocked = queryAccounts(knexMock, {limit: testLimitvalue});
        expect(knexMocked.spy.limit).to.be.calledWith(testLimitvalue);
      });
    });

    context('using offsets and limits with invalid values', () => {
      it('works using default values', () => {
        knexMocked = queryAccounts(knexMock, {
          offset: 'abcd',
          limit: () => {},
        });
        expect(knexMocked.spy.constructor).to.be.calledWith('accounts');
        expect(knexMocked.spy.offset)
          .to.be.calledWith(utility.constant.defaults.offset);
        expect(knexMocked.spy.limit)
          .to.be.calledWith(utility.constant.defaults.limit);
        expect(knexMocked.spy.then.args[0][0]('__test_result'))
          .to.eql('__test_result');
      });
    });
  });
});
