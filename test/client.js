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
    sendHeader = require('../lib/client'),
    sinon = require('sinon');

function noop() { return undefined; }

describe('Client', function () {
    it('should be a function', function () {
        assert.equal(typeof sendHeader, 'function');
    });
    describe('arguments', function () {
        it('should throw with no arguments', function () {
            assert.throws(function () { sendHeader(); });
        });
        it('should throw with one arguments', function () {
            var socket = {
                write: sinon.spy()
            };
            assert.throws(function () { sendHeader(socket); });
            assert.ok(!socket.write.called);
        });
        describe('source', function () {
            var target;
            beforeEach(function () {
                target = {
                    remoteFamily: 'IPv4',
                    remoteAddress: '0.0.0.0',
                    remotePort: 0,
                    localAddress: '0.0.0.0',
                    localPort: 0,
                    write: sinon.spy()
                };
            });
            it('should throw with undefined', function () {
                assert.throws(function () { sendHeader(undefined, target); });
                assert.ok(!target.write.called);
            });
            it('should throw with string', function () {
                assert.throws(function () { sendHeader('string', target); });
                assert.ok(!target.write.called);
            });
            it('should throw with string (empty)', function () {
                assert.throws(function () { sendHeader('', target); });
                assert.ok(!target.write.called);
            });
            it('should throw with number (zero)', function () {
                assert.throws(function () { sendHeader(0, target); });
                assert.ok(!target.write.called);
            });
            it('should throw with number', function () {
                assert.throws(function () { sendHeader(1, target); });
                assert.ok(!target.write.called);
            });
            it('should throw with function', function () {
                assert.throws(function () { sendHeader(noop, target); });
                assert.ok(!target.write.called);
            });
            it('should throw with boolean', function () {
                assert.throws(function () { sendHeader(true, target); });
                assert.ok(!target.write.called);
            });
            it('should throw with boolean (false)', function () {
                assert.throws(function () { sendHeader(false, target); });
                assert.ok(!target.write.called);
            });
            it('should throw with missing remoteFamily', function () {
                var source = {
                    remoteAddress: '0.0.0.0',
                    remotePort: 0,
                    localAddress: '0.0.0.0',
                    localPort: 0,
                    write: sinon.spy()
                };
                assert.throws(function () { sendHeader(source, target); });
                assert.ok(!source.write.called);
                assert.ok(!target.write.called);
            });
            it('should throw with invalid remoteFamily', function () {
                var source = {
                    remoteFamily: 'IPvX',
                    remoteAddress: '0.0.0.0',
                    remotePort: 0,
                    localAddress: '0.0.0.0',
                    localPort: 0,
                    write: sinon.spy()
                };
                assert.throws(function () { sendHeader(source, target); });
                assert.ok(!source.write.called);
                assert.ok(!target.write.called);
            });
            it('should throw with missing remotePort', function () {
                var source = {
                    remoteFamily: 'IPv4',
                    remoteAddress: '0.0.0.0',
                    localAddress: '0.0.0.0',
                    localPort: 0,
                    write: sinon.spy()
                };
                assert.throws(function () { sendHeader(source, target); });
                assert.ok(!source.write.called);
                assert.ok(!target.write.called);
            });
            it('should throw with invalid remotePort (<0)', function () {
                var source = {
                    remoteFamily: 'IPv4',
                    remoteAddress: '0.0.0.0',
                    remotePort: -1,
                    localAddress: '0.0.0.0',
                    localPort: 0,
                    write: sinon.spy()
                };
                assert.throws(function () { sendHeader(source, target); });
                assert.ok(!source.write.called);
                assert.ok(!target.write.called);
            });
            it('should throw with invalid remotePort (>65535)', function () {
                var source = {
                    remoteFamily: 'IPv4',
                    remoteAddress: '0.0.0.0',
                    remotePort: 100000,
                    localAddress: '0.0.0.0',
                    localPort: 0,
                    write: sinon.spy()
                };
                assert.throws(function () { sendHeader(source, target); });
                assert.ok(!source.write.called);
                assert.ok(!target.write.called);
            });
            it('should throw with missing localPort', function () {
                var source = {
                    remoteFamily: 'IPv4',
                    remoteAddress: '0.0.0.0',
                    remotePort: 0,
                    localAddress: '0.0.0.0',
                    write: sinon.spy()
                };
                assert.throws(function () { sendHeader(source, target); });
                assert.ok(!source.write.called);
                assert.ok(!target.write.called);
            });
            it('should throw with invalid localPort (<0)', function () {
                var source = {
                    remoteFamily: 'IPv4',
                    remoteAddress: '0.0.0.0',
                    remotePort: 0,
                    localAddress: '0.0.0.0',
                    localPort: -1,
                    write: sinon.spy()
                };
                assert.throws(function () { sendHeader(source, target); });
                assert.ok(!source.write.called);
                assert.ok(!target.write.called);
            });
            it('should throw with invalid localPort (>65535)', function () {
                var source = {
                    remoteFamily: 'IPv4',
                    remoteAddress: '0.0.0.0',
                    remotePort: 0,
                    localAddress: '0.0.0.0',
                    localPort: 100000,
                    write: sinon.spy()
                };
                assert.throws(function () { sendHeader(source, target); });
                assert.ok(!source.write.called);
                assert.ok(!target.write.called);
            });
            it('should throw with missing remoteAddress', function () {
                var source = {
                    remoteFamily: 'IPv4',
                    remotePort: 0,
                    localAddress: '0.0.0.0',
                    localPort: 0,
                    write: sinon.spy()
                };
                assert.throws(function () { sendHeader(source, target); });
                assert.ok(!source.write.called);
                assert.ok(!target.write.called);
            });
            it('should throw with invalid remoteAddress (IPv4)', function () {
                var source = {
                    remoteFamily: 'IPv4',
                    remoteAddress: '2001:0db8:0000:0042:0000:8a2e:0370:7334',
                    remotePort: 0,
                    localAddress: '0.0.0.0',
                    localPort: 0,
                    write: sinon.spy()
                };
                assert.throws(function () { sendHeader(source, target); });
                assert.ok(!source.write.called);
                assert.ok(!target.write.called);
            });
            it('should throw with invalid remoteAddress (IPv6)', function () {
                var source = {
                    remoteFamily: 'IPv6',
                    remoteAddress: '0.0.0.0',
                    remotePort: 0,
                    localAddress: '2001:0db8:0000:0042:0000:8a2e:0370:7334',
                    localPort: 0,
                    write: sinon.spy()
                };
                assert.throws(function () { sendHeader(source, target); });
                assert.ok(!source.write.called);
                assert.ok(!target.write.called);
            });
            it('should throw with missing localAddress', function () {
                var source = {
                    remoteFamily: 'IPv4',
                    remoteAddress: '0.0.0.0',
                    remotePort: 0,
                    localPort: 0,
                    write: sinon.spy()
                };
                assert.throws(function () { sendHeader(source, target); });
                assert.ok(!source.write.called);
                assert.ok(!target.write.called);
            });
            it('should throw with invalid localAddress (IPv4)', function () {
                var source = {
                    remoteFamily: 'IPv4',
                    remoteAddress: '0.0.0.0',
                    remotePort: 0,
                    localAddress: '2001:0db8:0000:0042:0000:8a2e:0370:7334',
                    localPort: 0,
                    write: sinon.spy()
                };
                assert.throws(function () { sendHeader(source, target); });
                assert.ok(!source.write.called);
                assert.ok(!target.write.called);
            });
            it('should throw with invalid localAddress (IPv6)', function () {
                var source = {
                    remoteFamily: 'IPv6',
                    remoteAddress: '2001:0db8:0000:0042:0000:8a2e:0370:7334',
                    remotePort: 0,
                    localAddress: '0.0.0.0',
                    localPort: 0,
                    write: sinon.spy()
                };
                assert.throws(function () { sendHeader(source, target); });
                assert.ok(!source.write.called);
                assert.ok(!target.write.called);
            });
        });
        describe('target', function () {
            var source;
            beforeEach(function () {
                source = {
                    remoteFamily: 'IPv4',
                    remoteAddress: '0.0.0.0',
                    remotePort: 0,
                    localAddress: '0.0.0.0',
                    localPort: 0,
                    write: sinon.spy()
                };
            });
            it('should throw with undefined', function () {
                assert.throws(function () { sendHeader(source, undefined); });
                assert.ok(!source.write.called);
            });
            it('should throw with null', function () {
                assert.throws(function () { sendHeader(source, null); });
                assert.ok(!source.write.called);
            });
            it('should throw with invalid string', function () {
                assert.throws(function () { sendHeader(source, 'string'); });
                assert.ok(!source.write.called);
            });
            it('should throw with invalid string (empty)', function () {
                assert.throws(function () { sendHeader(source, ''); });
                assert.ok(!source.write.called);
            });
            it('should throw with number (zero)', function () {
                assert.throws(function () { sendHeader(source, 0); });
                assert.ok(!source.write.called);
            });
            it('should throw with number', function () {
                assert.throws(function () { sendHeader(source, 1); });
                assert.ok(!source.write.called);
            });
            it('should throw with function', function () {
                assert.throws(function () { sendHeader(source, noop); });
                assert.ok(!source.write.called);
            });
            it('should throw with boolean', function () {
                assert.throws(function () { sendHeader(source, true); });
                assert.ok(!source.write.called);
            });
            it('should throw with boolean (false)', function () {
                assert.throws(function () { sendHeader(source, false); });
                assert.ok(!source.write.called);
            });
        });
    });
    it('should accept ipv4 address', function () {
        var source = {
                remoteFamily: 'IPv4',
                remoteAddress: '0.0.0.0',
                remotePort: 0,
                localAddress: '0.0.0.0',
                localPort: 0,
                write: sinon.spy()
            },
            target = {
                write: sinon.spy()
            };
        sendHeader(source, target);
        assert.ok(!source.write.called);
        assert.ok(target.write.calledOnce);
        assert.ok(Buffer.isBuffer(target.write.getCall(0).args[0]));
    });
    it('should accept ipv6 address', function () {
        var source = {
                remoteFamily: 'IPv6',
                remoteAddress: '2001:0db8:0000:0042:0000:8a2e:0370:7334',
                remotePort: 0,
                localAddress: '2001:0db8:0000:0042:0000:8a2e:0370:7334',
                localPort: 0,
                write: sinon.spy()
            },
            target = {
                write: sinon.spy()
            };
        sendHeader(source, target);
        assert.ok(!source.write.called);
        assert.ok(target.write.calledOnce);
        assert.ok(Buffer.isBuffer(target.write.getCall(0).args[0]));
    });
});
