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

    runner.on("suite", function (suite) {
        allureReporter.startSuite(suite.fullTitle());
    });

    runner.on("suite end", function () {
        allureReporter.endSuite();
    });

    runner.on("test", function(test) {
        allureReporter.startCase(test.title);
    });

    runner.on("pending", function(test) {
        allureReporter.pendingCase(test.title);
    });

    runner.on("pass", function() {
        allureReporter.endCase("passed");
    });

    runner.on("fail", function(test, err) {
        var status = err.name === "AssertionError" ? "failed" : "broken";
        if(global.onError) {
            global.onError(err);
        }
        allureReporter.endCase(status, err);
    });
}

module.exports = AllureReporter;
