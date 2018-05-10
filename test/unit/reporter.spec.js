var path = require("path");
var Mocha = require("mocha");
var mockery = require("mockery");
var AssertionError = require("assert").AssertionError;
var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var expect = chai.expect;

chai.use(sinonChai);

describe("Allure reporter", function() {
    var allureMock;
    var runtimeMock;
    var sandbox;
    var reporter;

    beforeEach(function(){
        sandbox = sinon.createSandbox();
        mockery.enable({
            warnOnUnregistered: false,
            warnOnReplace: false,
            useCleanCache: true
        });
        allureMock = sandbox.stub({
                getCurrentTest: function(){},
                setOptions: function() {},
                startSuite: function() {},
                endSuite: function() {},
                getSuite: function() {},
                startCase: function() {},
                endCase: function() {},
                pendingCase: function() {}
            });
        allureMock.getCurrentTest.returns("a test");
        runtimeMock = sandbox.stub({
                createStep: function() {},
                createAttachment: function() {},
                addLabel: function() {}
            });
        runtimeMock.createStep.returns(function() {});
        runtimeMock.createAttachment.returns(function() {});


        mockery.registerMock("allure-js-commons", function() {
            return allureMock;
        });
        mockery.registerMock("allure-js-commons/runtime", function() {
            return runtimeMock;
        });
        reporter = require("../../");
    });

    afterEach(function(){
        sandbox.restore();
        mockery.disable();
    });

    it("should report test results", function(done) {
        var mocha = new Mocha({
            reporter: reporter
        });
        mocha.addFile(path.join(__dirname, "../fixtures/simple.spec.js"));
        mocha.run(function() {
            expect(allureMock.startSuite).callCount(3);
            expect(allureMock.startSuite.secondCall).calledWithExactly("A mocha suite");
            expect(allureMock.startSuite.thirdCall).calledWithExactly("A mocha suite passing");
            expect(allureMock.endSuite).callCount(3);

            expect(allureMock.startCase.firstCall).calledAfter(allureMock.startSuite.secondCall);
            expect(allureMock.startCase.firstCall).calledWithExactly("broken test");
            expect(allureMock.endCase.firstCall).calledWith("broken", sinon.match.instanceOf(Error));

            expect(allureMock.startCase.secondCall).calledWithExactly("failed test");
            expect(allureMock.endCase.secondCall).calledWith("failed", sinon.match.instanceOf(Error));

            expect(allureMock.startCase.thirdCall).calledWithExactly("simple test");
            expect(allureMock.endCase.thirdCall).calledWith("passed");

            expect(allureMock.pendingCase).calledOnce;
            expect(allureMock.pendingCase.firstCall).calledWith("pending test");
            done();
        });
    });
    it("should report test results if there is a failure in a before test hook", function(done) {
        allureMock.getCurrentTest.onFirstCall().returns(undefined);
        allureMock.getCurrentTest.onSecondCall().returns("a test");
        var mocha = new Mocha({
            reporter: reporter
        });
        mocha.addFile(path.join(__dirname, "../fixtures/before_all.spec.js"));
        mocha.run(function(status) {
            expect(allureMock.startSuite).callCount(4);
            expect(allureMock.startSuite.secondCall).calledWithExactly("Before all tests");
            expect(allureMock.startSuite.thirdCall).calledWithExactly("Before all tests broken before");
            expect(allureMock.startSuite.lastCall).calledWithExactly("Before all tests before not broken");
            expect(allureMock.endSuite).callCount(4);

            expect(allureMock.startCase.firstCall).calledAfter(allureMock.startSuite.secondCall);
            expect(allureMock.startCase.firstCall).calledWithExactly('"before all" hook');
            expect(allureMock.endCase.firstCall).calledWith("broken", sinon.match.instanceOf(Error));

            expect(allureMock.startCase.secondCall).calledWithExactly("a test");
            expect(allureMock.endCase).to.have.been.calledTwice;

            expect(status).to.be.equal(1);
            done();
        });
    });
    it("should handle tests using native node module 'assert'", function(done) {
        var mocha = new Mocha({
            reporter: reporter
        });
        mocha.addFile(path.join(__dirname, "../fixtures/assert.spec.js"));
        mocha.run(function() {
            expect(allureMock.startCase).callCount(2);
            expect(allureMock.endCase).callCount(2);

            expect(allureMock.startCase.firstCall).calledWithExactly("passing test");
            expect(allureMock.endCase.firstCall).calledWith("passed");

            expect(allureMock.startCase.secondCall).calledWithExactly("failed test");
            expect(allureMock.endCase.secondCall).calledWith("failed", sinon.match.instanceOf(AssertionError));

            done();
        });
    });
    it("should report test results with 'retries' option", function(done) {
        var mocha = new Mocha({
            reporter: reporter
        });
        mocha.addFile(path.join(__dirname, "../fixtures/retries.spec.js"));
        mocha.run(function() {
            expect(allureMock.startSuite).callCount(2);
            expect(allureMock.startSuite.secondCall).calledWithExactly('A mocha suite with "retries" option');
            expect(allureMock.endSuite).callCount(2);
            expect(allureMock.startCase).callCount(3);
            expect(allureMock.endCase).callCount(3);

            expect(allureMock.startCase.firstCall).calledWithExactly("passing test");
            expect(allureMock.endCase.firstCall).calledWith("passed");

            expect(allureMock.startCase.secondCall).calledWithExactly("failed test");
            expect(allureMock.endCase.secondCall).calledWith("failed", sinon.match.instanceOf(Error));

            expect(allureMock.startCase.thirdCall).calledWithExactly("passing test after retry");
            expect(allureMock.endCase.thirdCall).calledWith("passed");

            done();
        });
    });

    it("should report internal errors", function(done) {
        sinon.stub(console, "error");
        var mocha = new Mocha({
            reporter: reporter
        });
        allureMock.endSuite.onCall(1).throws();
        mocha.addFile(path.join(__dirname, "../fixtures/retries.spec.js"));
        mocha.run(function() {
            expect(console.error).callCount(1);
            expect(console.error).calledWith("Internal error in Allure:", sinon.match.instanceOf(Error));
            console.error.restore();
            done();
        });
    });
});
