'use strict';
let chai = require('chai');
let expect = chai.expect;
chai.use(require('dirty-chai'));

describe('A mocha suite with "retries" option', function() {
    let counter = 0;
    this.retries(3);

    it('passing test', function() {
        expect(true).to.be.true();
    });

    it('failed test', function() {
        expect(false).to.be.true();
    });

    it('passing test after retry', function() {
        counter++;
        expect(counter).to.equal(2);
    });
});
