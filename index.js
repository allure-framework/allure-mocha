"use strict";
var Base = require("mocha").reporters.Base;
var Allure = require("allure-js-commons");
var allureReporter = new Allure();
var Runtime = require("allure-js-commons/runtime");

global.allure = new Runtime(allureReporter);

/**
 * Initialize a new `Allure` test reporter.
 *
 * @param {Runner} runner
 * @param {Object} opts mocha options
 * @api public
 */
function AllureReporter(runner, opts) {
    Base.call(this, runner);
    allureReporter.setOptions(opts.reporterOptions || {});

    function invokeHandler(handler) {
        return function() {
            try {
                return handler.apply(this, arguments);
            } catch(error) {
                console.error("Internal error in Allure:", error); // eslint-disable-line no-console
            }
        };
    }

    runner.on("suite", invokeHandler(function (suite) {
        allureReporter.startSuite(suite.fullTitle());
    }));

    runner.on("suite end", invokeHandler(function () {
        allureReporter.endSuite();
    }));

    runner.on("test", invokeHandler(function(test) {
        if (typeof test.currentRetry !== "function" || !test.currentRetry()) {
          allureReporter.startCase(test.title);
        }
    }));

    runner.on("pending", invokeHandler(function(test) {
        var currentTest = allureReporter.getCurrentTest();
        if(currentTest && currentTest.name === test.title) {
            allureReporter.endCase("skipped");
        } else {
            allureReporter.pendingCase(test.title);
        }
    }));

    runner.on("pass", invokeHandler(function() {
        allureReporter.endCase("passed");
    }));

    runner.on("fail", invokeHandler(function(test, err) {
        if(!allureReporter.getCurrentTest()) {
            allureReporter.startCase(test.title);
        }
        var isAssertionError = err.name === "AssertionError" || err.code === "ERR_ASSERTION";
        var status = isAssertionError ? "failed" : "broken";
        if(global.onError) {
            global.onError(err);
        }
        allureReporter.endCase(status, err);
    }));

    runner.on("hook end", invokeHandler(function(hook) {
        if(hook.title.indexOf('"after each" hook') === 0) {
            allureReporter.endCase("passed");
        }
    }));
}

module.exports = AllureReporter;
