# mocha-allure-reporter [![Build Status](https://travis-ci.org/allure-framework/mocha-allure-reporter.svg?branch=master)](https://travis-ci.org/allure-framework/mocha-allure-reporter)
Allure reporter for Mocha

## Installation

Assume that you have [mocha](http://mochajs.org/) installed, install reporter via npm:

```
npm install mocha-allure-reporter
```

Then use it as any other mocha reporter

```
mocha --reporter mocha-allure-reporter
```

After tests you get raw tests result into `allure-results` directory.
See [generator list](https://github.com/allure-framework/allure-core/wiki#generating-a-report)
to know how make a report from raw results.

Also check out [mocha-allure-example](https://github.com/allure-examples/mocha-allure-example) to see it in action.

## Supported options

* targetDir _(string)_ – directory where test results will be stored

## Runtime API

Allure is a test framework which allows you to provide more data from tests than usual. Once you added `mocha-allure-reporter` for your tests, you will have global `allure` object with the following API:

* `allure.createStep(name, stepFn)` – define step function. Each call of resulting function will be recorded into report.
* `allure.createAttachement(name, content, [type])` – save attachement to test. If you calling this during step function, attachement will be saved to step function.
    * `name` (*String*) - Name of attachement. Note that it is not a name of the file, actual filename will be generated. 
    * `content` (*Buffer|String|Function*) – attachement content. If you pass Buffer or String, it will be saved in file immediately. If you are passing Funtion, you will get decorated function and you can call it several times to trigger attachement. General purpose of the second case is an ability to create utility function to take screenshot. You can define function for you test framework at once and then call it each time when you need a screenshot
    * `type` (*String*, optional) – MIME-type of attachement. You may omit this argument, then we detect type automatically via [file-type](https://github.com/sindresorhus/file-type) library
* `allure.description(description)` – set detailed description to test, if the test name is not enough.
* `allure.severity(severity)` – set severity of the test. It could be a value from the set: `blocker`, `critical`, `normal`, `minor`, `trivial`. There some constant for it, for example `allure.SEVERITY.BLOKER`
* `allure.feature(featureName)` – assign feature for the test
* `allure.story(storyName)` – assign user story for the test. See [documentation](https://github.com/allure-framework/allure-core/wiki/Features-and-Stories) for details
