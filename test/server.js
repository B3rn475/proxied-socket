/*jslint node: true, nomen: true, es5: true */
/**
 * Developed By Carlo Bernaschina (GitHub - B3rn475)
 * www.bernaschina.com
 *
 * Distributed under the MIT Licence
 */
/*global describe, it*/
"use strict";

var assert = require('assert'),
    wrap = require('../lib/server.js');

describe('Server', function () {
    it('should be a function', function () {
        assert.equal(typeof wrap, 'function');
    });
    it('should throw with no arguments', function () {
        assert.throws(function () { wrap(); });
    });
});
