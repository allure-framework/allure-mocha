var Base = require('mocha').reporters.Base,
    Allure = require('allure-js-commons');


module.exports = AllureReporter;

/**
 * Initialize a new `Allure` test reporter.
 *
 * @param {Runner} runner
 * @param {Object} opts mocha options
 * @api public
 */

function AllureReporter(runner, opts) {
    Base.call(this, runner);
    var options = (opts && opts.reporterOptions) || {},
        allure = new Allure(options);

    runner.on('suite', function (suite) {
        allure.startSuite(suite.fullTitle());
    });

    runner.on('suite end', function (suite) {
        allure.endSuite(suite.fullTitle());
    });

    runner.on('test', function(test) {
        allure.startCase(test.parent.fullTitle(), test.title);
    });

    runner.on('pending', function(test) {
        allure.pendingCase(test.parent.fullTitle(), test.title);
    });

    runner.on('pass', function(test) {
        addStepsInfo(test.parent);
        allure.endCase(test.parent.fullTitle(), test.title, 'passed');
    });

    runner.on('fail', function(test, err) {
        var status = err.name === 'AssertionError' ? 'failed' : 'broken';
        addStepsInfo(test.parent);
        allure.endCase(test.parent.fullTitle(), test.title, status, err);
    });

    function addStepsInfo(suite) {
        var publishSubsteps = function(step) {
            allure.startStep(suite, step.name, step.start);
            step.steps.forEach(publishSubsteps, this);
            allure.endStep(suite, step.name, step.status, step.stop)
        };

        global.allure.report.steps.forEach(publishSubsteps);
        global.allure.flushReport();
    }
}

AllureReporter.prototype.__proto__ = Base.prototype;
