# mocha-allure-reporter
Allure reporter for Mocha

## Installation

Assume that you have [mocha](http://mochajs.org/) installed, install reporter via npm:

```
npm install mocha-allure-reporter
```

Then use it as any another mocha reporter

```
mocha --reporter mocha-allure-reporter
```

After tests you will get raw tests result into `allure-results` directory. 
See [generator list](https://github.com/allure-framework/allure-core/wiki#generating-a-report) to know how make a 
report from raw results.

## Supported options

* targetDir _(string)_ – directory where will be stored test results
