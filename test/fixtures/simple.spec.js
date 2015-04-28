var expect = require('chai').expect;
describe('A mocha suite', function() {
    beforeEach(function() {

    });

    describe("passing", function() {
        it("simple test", function() {
            expect(true).to.be.true;
        });
    });

    it("broken test", function() {
        throw new Error('Unknown error')
    });

    it("failed test", function() {
        expect(false).to.be.ok;
    });

    xit("pending test", function() {
        //not implemented yet
    });
});
