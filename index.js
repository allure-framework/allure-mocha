const Base = require('mocha').reporters.Base;
const Allure = require('allure-js-commons');
const Runtime = require('allure-js-commons/runtime');
const AssertionError = require('chai').AssertionError;
const WebDriverError = require('protractor').error.WebDriverError;

const allureReporter = new Allure();

global.allure = new Runtime(allureReporter);

const ALLURE_OPTIONS = ['targetDir'];
const allureOptions = {};
const reporterOptions = {
    ignoreErrors: true
};

/**
 * Initialize a new `Allure` test reporter.
 *
 * @param {Runner} runner
 * @param {Object} opts mocha options
 * @api public
 */

class AllureReporter extends Base {
    constructor(runner, opts) {
        super(runner);

       this.parseOptions(opts.reporterOptions);

        allureReporter.setOptions(allureOptions);

        this.subscribeOnEvents(runner);
    }

    parseOptions(options) {
        if (!options) {
            return;
        }

        Object.keys(options).forEach(key => {
            if (ALLURE_OPTIONS.includes(key)) {
                allureOptions[key] = options[key];
            } else {
                reporterOptions[key] = options[key];
            }
        });
    }

    subscribeOnEvents(runner) {
        const invokeHandler = (handler) => {
            return function() {
                try {
                    return handler.apply(this, arguments);
                } catch(error) {
                    console.error('Internal error in Allure:', error); // eslint-disable-line no-console
                }
            };
        };

        runner.on('suite', invokeHandler((suite) => {
            allureReporter.startSuite(suite.fullTitle());
        }));

        runner.on('suite end', invokeHandler(() => {
            allureReporter.endSuite();
        }));

        runner.on('test', invokeHandler((test) => {
            if (typeof test.currentRetry !== 'function' || !test.currentRetry()) {
                allureReporter.startCase(test.title);
            }

            allureReporter.endCase();
        }));

        runner.on('pending', invokeHandler((test) => {
            const currentTest = allureReporter.getCurrentTest();

            if (currentTest && currentTest.name === test.title) {
                allureReporter.endCase('skipped');
            } else {
                allureReporter.pendingCase(test.title);
            }
        }));

        runner.on('pass', invokeHandler(() => {
            allureReporter.endCase('passed');
        }));

        runner.on('fail', invokeHandler((test, err) => {
            if (!allureReporter.getCurrentTest()) {
                allureReporter.startCase(test.title);
            }

            let status = 'broken';

            if (err instanceof AssertionError) {
                status = 'failed';
            }

            if (!reporterOptions.ignoreErrors) {
                if (err instanceof WebDriverError
                    || err instanceof TypeError
                    || err instanceof ReferenceError) {
                        status = 'failed';
                    }
            }

            if (typeof global.onError === 'function') {
                global.onError(err);
            }

            allureReporter.endCase(status, err);
        }));

        runner.on('hook end', invokeHandler((hook) => {
            if (hook.title.indexOf('\'after each\' hook') === 0) {
                allureReporter.endCase('passed');
            }
        }));
    }
}

module.exports = AllureReporter;
