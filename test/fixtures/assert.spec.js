/*eslint-env mocha*/
'use strict';
let assert = require('assert');

describe('Tests using assert', function() {
    it('passing test', function() {
        assert.ok(true);
    });

    it('failed test', function() {
        assert.ok(false);
    });
});
