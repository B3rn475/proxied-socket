/*jslint node: true, nomen: true, es5: true */
/**
 * Developed By Carlo Bernaschina (GitHub - B3rn475)
 * www.bernaschina.com
 *
 * Distributed under the MIT Licence
 */
/*global describe, it, beforeEach*/
"use strict";

var assert = require('assert'),
    wrap = require('../lib/client'),
    sinon = require('sinon');

function noop() { return undefined; }

describe('Client', function () {
    it('should be a function', function () {
        assert.equal(typeof wrap, 'function');
    });
    describe('arguments', function () {
        it('should throw with no arguments', function () {
            assert.throws(function () { wrap(); });
        });
        it('should throw with one arguments', function () {
            var socket = {
                write: sinon.spy()
            };
            assert.throws(function () { wrap(socket); });
            assert.ok(!socket.write.called);
        });
        describe('socket', function () {
            it('should throw with undefined', function () {
                assert.throws(function () { wrap(undefined, "0.0.0.0"); });
            });
            it('should throw with string', function () {
                assert.throws(function () { wrap('string', "0.0.0.0"); });
            });
            it('should throw with string (empty)', function () {
                assert.throws(function () { wrap('', "0.0.0.0"); });
            });
            it('should throw with number (zero)', function () {
                assert.throws(function () { wrap(0, "0.0.0.0"); });
            });
            it('should throw with number', function () {
                assert.throws(function () { wrap(1, "0.0.0.0"); });
            });
            it('should throw with function', function () {
                assert.throws(function () { wrap(noop, "0.0.0.0"); });
            });
            it('should throw with boolean', function () {
                assert.throws(function () { wrap(true, "0.0.0.0"); });
            });
            it('should throw with boolean (false)', function () {
                assert.throws(function () { wrap(false, "0.0.0.0"); });
            });
        });
        describe('address', function () {
            var socket;
            beforeEach(function () {
                socket = {
                    write: sinon.spy()
                };
            });
            it('should throw with undefined', function () {
                assert.throws(function () { wrap(socket, undefined); });
                assert.ok(!socket.write.called);
            });
            it('should throw with null', function () {
                assert.throws(function () { wrap(socket, null); });
                assert.ok(!socket.write.called);
            });
            it('should throw with invalid string', function () {
                assert.throws(function () { wrap(socket, 'string'); });
                assert.ok(!socket.write.called);
            });
            it('should throw with invalid string (empty)', function () {
                assert.throws(function () { wrap(socket, ''); });
                assert.ok(!socket.write.called);
            });
            it('should throw with number (zero)', function () {
                assert.throws(function () { wrap(socket, 0); });
                assert.ok(!socket.write.called);
            });
            it('should throw with number', function () {
                assert.throws(function () { wrap(socket, 1); });
                assert.ok(!socket.write.called);
            });
            it('should throw with function', function () {
                assert.throws(function () { wrap(socket, noop); });
                assert.ok(!socket.write.called);
            });
            it('should throw with boolean', function () {
                assert.throws(function () { wrap(socket, true); });
                assert.ok(!socket.write.called);
            });
            it('should throw with boolean (false)', function () {
                assert.throws(function () { wrap(socket, false); });
                assert.ok(!socket.write.called);
            });
        });
    });
    it('should accept ipv4 address', function () {
        var socket = {
            write: sinon.spy()
        };
        wrap(socket, '127.0.0.1');
        assert.ok(socket.write.calledOnce);
        assert.ok(Buffer.isBuffer(socket.write.getCall(0).args[0]));
    });
    it('should accept ipv6 address', function () {
        var socket = {
            write: sinon.spy()
        };
        wrap(socket, '2001:0db8:0000:0042:0000:8a2e:0370:7334');
        assert.ok(socket.write.calledOnce);
        assert.ok(Buffer.isBuffer(socket.write.getCall(0).args[0]));
    });
});
