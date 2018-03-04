const chai = require('chai');
const sinon = require('sinon');

chai.use(require('chai-sinon'));

console.info('#> test config');
global.expect = chai.expect;
console.info('  assigned global.expect <- chai.expect');
global.sinon = sinon;
console.info('  assigned global.sinon <- sinon');
console.info('#/ test config');
