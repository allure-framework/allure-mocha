var path = require('path'),
    Mocha = require('mocha'),
    mockery = require('mockery'),
    chai = require("chai"),
    sinon = require("sinon"),
    sinonChai = require("sinon-chai"),
    expect = chai.expect;

chai.use(sinonChai);

mockery.enable({
    warnOnUnregistered: false,
    useCleanCache: true
});

var allureMock = sinon.stub({
        setOptions: function() {},
        startSuite: function() {},
        endSuite: function() {},
        getSuite: function() {},
        startCase: function() {},
        endCase: function() {},
        pendingCase: function() {}
    }),
    runtimeMock = sinon.stub({
        createStep: function() {},
        createAttachment: function() {},
        addLabel: function() {}
    });
runtimeMock.createStep.returns(function() {});
runtimeMock.createAttachment.returns(function() {});


mockery.registerMock('allure-js-commons', function() {
    return allureMock;
});
mockery.registerMock('allure-js-commons/runtime', function() {
    return runtimeMock;
});


var reporter = require('../../');
describe("Allure reporter", function() {
    it("should report test results", function(done) {
        var mocha = new Mocha({
            reporter: reporter
        });
        mocha.addFile(path.join(__dirname, '../fixtures/simple.spec.js'));
        mocha.run(function() {
            expect(allureMock.startSuite).callCount(3);
            expect(allureMock.startSuite.secondCall).calledWithExactly('A mocha suite');
            expect(allureMock.startSuite.thirdCall).calledWithExactly('A mocha suite passing');
            expect(allureMock.endSuite).callCount(3);

            expect(allureMock.startCase.firstCall).calledAfter(allureMock.startSuite.secondCall);
            expect(allureMock.startCase.firstCall).calledWithExactly('broken test');
            expect(allureMock.endCase.firstCall).calledWith('broken', sinon.match.instanceOf(Error));

            expect(allureMock.startCase.secondCall).calledWithExactly('failed test');
            expect(allureMock.endCase.secondCall).calledWith('failed', sinon.match.instanceOf(Error));

            expect(allureMock.startCase.thirdCall).calledWithExactly('simple test');
            expect(allureMock.endCase.thirdCall).calledWith('passed');

            expect(allureMock.pendingCase).calledOnce;
            expect(allureMock.pendingCase.firstCall).calledWith('pending test');

            done();
        })
    });
});
