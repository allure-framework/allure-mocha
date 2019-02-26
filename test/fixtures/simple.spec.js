/*eslint-env mocha*/
/*global allure*/
'use strict';
let chai = require('chai');
let expect = chai.expect;
chai.use(require('dirty-chai'));

describe('A mocha suite', function() {
    let dumpLog = allure.createAttachment('my log [{0}]', function(level, log) {
        return new Buffer(log, 'utf-8');
    });
    let firstStep = allure.createStep('simple step', function() {});

    beforeEach(function() {});

    describe('passing', function() {
        it('simple test', function() {
            dumpLog('info', 'all is going well');
            expect(true).to.be.true();
        });
    });

    it('broken test', function() {
        firstStep();
        throw new Error('Unknown error');
    });

    it('failed test', function() {
        allure.addLabel('severity', 'trivial');
        expect(false).to.be.true();
    });

    xit('pending test', function() {
        //not implemented yet
    });
});
