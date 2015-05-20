# mocha-allure-reporter [![Build Status](https://travis-ci.org/allure-framework/mocha-allure-reporter.svg?branch=master)](https://travis-ci.org/allure-framework/mocha-allure-reporter)
Allure reporter for Mocha 

## Installation

Assume that you have [mocha](http://mochajs.org/) installed, install reporter via npm:

```
npm install allure-js-commons
npm install mocha-allure-reporter
```

Then use it as any other mocha reporter

```
mocha --reporter mocha-allure-reporter -r 'allure-js-commons/runtime'
```

After tests you get raw tests result into `allure-results` directory. 
See [generator list](https://github.com/allure-framework/allure-core/wiki#generating-a-report) to know how make a 
report from raw results.

## Supported options

* targetDir _(string)_ – directory where test results will be stored 
