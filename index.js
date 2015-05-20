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
        Suite = function(parent) {
            this.allure = new Allure(options);
            this.parent = parent;
            global.allure = this.allure;
        },
        currentSuite = null;

    runner.on('suite', function (suite) {
        currentSuite = new Suite(currentSuite);
        currentSuite.allure.startSuite(suite.fullTitle());
    });

    runner.on('suite end', function (suite) {
        currentSuite.allure.endSuite(suite.fullTitle());
        currentSuite = currentSuite.parent;
    });

    runner.on('test', function(test) {
        currentSuite.allure.startCase(test.title);
    });

    runner.on('pending', function(test) {
        currentSuite.allure.pendingCase(test.title);
    });

    runner.on('pass', function() {
        currentSuite.allure.endCase('passed');
    });

    runner.on('fail', function(test, err) {
        var status = err.name === 'AssertionError' ? 'failed' : 'broken';
        if(global.onError) {
            global.onError();
        }
        currentSuite.allure.endCase(status, err);
    });
}

AllureReporter.prototype.__proto__ = Base.prototype;
