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
            global.allure.setAllure(this.allure);
        },
        currentMochaSuite = null;

    runner.on('suite', function (suite) {
        currentMochaSuite = new Suite(currentMochaSuite);
        currentMochaSuite.allure.startSuite(suite.fullTitle());
    });

    runner.on('suite end', function (suite) {
        currentMochaSuite.allure.endSuite();
        currentMochaSuite = currentMochaSuite.parent;
    });

    runner.on('test', function(test) {
        currentMochaSuite.allure.startCase(test.title);
    });

    runner.on('pending', function(test) {
        currentMochaSuite.allure.pendingCase(test.title);
    });

    runner.on('pass', function() {
        currentMochaSuite.allure.endCase('passed');
    });

    runner.on('fail', function(test, err) {
        var status = err.name === 'AssertionError' ? 'failed' : 'broken';
        if(global.onError) {
            global.onError();
        }
        currentMochaSuite.allure.endCase(status, err);
    });
}

AllureReporter.prototype.__proto__ = Base.prototype;
