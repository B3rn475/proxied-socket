/*jslint node: true, nomen: true, es5: true */
/**
 * Developed By Carlo Bernaschina (GitHub - B3rn475)
 * www.bernaschina.com
 *
 * Distributed under the MIT Licence
 */
/*global describe, it, beforeEach*/
"use strict";

var streams = require('memory-streams'),
    assert = require('assert'),
    createParser = require('../../lib/server/header/proxied-socket'),
    sinon = require('sinon');

describe('Client', function () {
    it('should be a function', function () {
        assert.equal(typeof createParser, 'function');
    });
    it('should return a function', function () {
        var onConnection = sinon.spy(),
            onHeaderError = sinon.spy(),
            parser = createParser({}, onConnection, onHeaderError);

        assert.equal(typeof parser, 'function');
    });
    it('should reject invalid headers length', function () {
        var socket = new streams.ReadableStream(new Buffer([0])),
            onConnection = sinon.spy(),
            onHeaderError = sinon.spy(),
            parser = createParser(socket, onConnection, onHeaderError);

        parser.call(socket);

        assert.ok(!onConnection.called);
        assert.ok(onHeaderError.calledOnce);
    });
    it('should reject invalid headers type', function () {
        var socket = new streams.ReadableStream(new Buffer([1, 100])),
            onConnection = sinon.spy(),
            onHeaderError = sinon.spy(),
            parser = createParser(socket, onConnection, onHeaderError);

        parser.call(socket);

        assert.ok(!onConnection.called);
        assert.ok(onHeaderError.calledOnce);
    });
    it('should parse IPv4', function () {
        var socket = new streams.ReadableStream(new Buffer([13,  0,  0,  1,  2,
                                                             3,  4,  5,  6,  7,
                                                             8,  9, 10, 11])),
            onConnection = sinon.spy(),
            onHeaderError = sinon.spy(),
            parser = createParser(socket, onConnection, onHeaderError),
            proxy;

        parser.call(socket);

        assert.ok(onConnection.calledOnce);
        assert.ok(!onHeaderError.called);
        assert.ok(onConnection.calledWith(sinon.match.object));
        proxy = onConnection.getCall(0).args[0];
        assert.equal(proxy.remoteFamily, 'IPv4');
        assert.equal(proxy.remoteAddress, '0.1.2.3');
        assert.equal(proxy.remotePort, 1029);
        assert.equal(proxy.localAddress, '6.7.8.9');
        assert.equal(proxy.localPort, 2571);
    });
    it('should parse IPv4 splitted', function () {
        var socket = new streams.ReadableStream(new Buffer([])),
            onConnection = sinon.spy(),
            onHeaderError = sinon.spy(),
            parser = createParser(socket, onConnection, onHeaderError),
            proxy;

        parser.call(socket);
        socket.append(new Buffer([13, 0, 0, 1, 2, 3]));
        parser.call(socket);
        socket.append(new Buffer([4]));
        parser.call(socket);
        socket.append(new Buffer([5, 6]));
        parser.call(socket);
        socket.append(new Buffer([7, 8]));
        parser.call(socket);
        socket.append(new Buffer([9, 10, 11]));
        parser.call(socket);

        assert.ok(onConnection.calledOnce);
        assert.ok(!onHeaderError.called);
        assert.ok(onConnection.calledWith(sinon.match.object));
        proxy = onConnection.getCall(0).args[0];
        assert.equal(proxy.remoteFamily, 'IPv4');
        assert.equal(proxy.remoteAddress, '0.1.2.3');
        assert.equal(proxy.remotePort, 1029);
        assert.equal(proxy.localAddress, '6.7.8.9');
        assert.equal(proxy.localPort, 2571);
    });
    it('should reject invalid IPv4 packets', function () {
        var socket = new streams.ReadableStream(new Buffer([2, 0, 0])),
            onConnection = sinon.spy(),
            onHeaderError = sinon.spy(),
            parser = createParser(socket, onConnection, onHeaderError);

        parser.call(socket);

        assert.ok(!onConnection.called);
        assert.ok(onHeaderError.calledOnce);
    });
    it('should parse IPv6', function () {
        var socket = new streams.ReadableStream(new Buffer([37,  1,  0,  1,  2,
                                                             3,  4,  5,  6,  7,
                                                             8,  9, 10, 11, 12,
                                                            13, 14, 15, 16, 17,
                                                            18, 19, 20, 21, 22,
                                                            23, 24, 25, 26, 27,
                                                            28, 29, 30, 31, 32,
                                                            33, 34, 35])),
            onConnection = sinon.spy(),
            onHeaderError = sinon.spy(),
            parser = createParser(socket, onConnection, onHeaderError),
            proxy;

        parser.call(socket);

        assert.ok(onConnection.calledOnce);
        assert.ok(!onHeaderError.called);
        assert.ok(onConnection.calledWith(sinon.match.object));
        proxy = onConnection.getCall(0).args[0];
        assert.equal(proxy.remoteFamily, 'IPv6');
        assert.equal(proxy.remoteAddress, '1:203:405:607:809:a0b:c0d:e0f');
        assert.equal(proxy.remotePort, 4113);
        assert.equal(proxy.localAddress, '1213:1415:1617:1819:1a1b:1c1d:1e1f:2021');
        assert.equal(proxy.localPort, 8739);
    });
    it('should parse IPv6 splitted', function () {
        var socket = new streams.ReadableStream(new Buffer([37])),
            onConnection = sinon.spy(),
            onHeaderError = sinon.spy(),
            parser = createParser(socket, onConnection, onHeaderError),
            proxy;

        parser.call(socket);
        socket.append(new Buffer([1]));
        parser.call(socket);
        socket.append(new Buffer([0, 1, 2, 3, 4, 5, 6, 7]));
        parser.call(socket);
        socket.append(new Buffer([8, 9, 10, 11, 12, 13, 14, 15, 16, 17]));
        parser.call(socket);
        socket.append(new Buffer([18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]));
        parser.call(socket);
        socket.append(new Buffer([29, 30, 31, 32, 33, 34, 35]));
        parser.call(socket);

        assert.ok(onConnection.calledOnce);
        assert.ok(!onHeaderError.called);
        assert.ok(onConnection.calledWith(sinon.match.object));
        proxy = onConnection.getCall(0).args[0];
        assert.equal(proxy.remoteFamily, 'IPv6');
        assert.equal(proxy.remoteAddress, '1:203:405:607:809:a0b:c0d:e0f');
        assert.equal(proxy.remotePort, 4113);
        assert.equal(proxy.localAddress, '1213:1415:1617:1819:1a1b:1c1d:1e1f:2021');
        assert.equal(proxy.localPort, 8739);
    });
    it('should reject invalid IPv6 packets', function () {
        var socket = new streams.ReadableStream(new Buffer([2, 1, 0])),
            onConnection = sinon.spy(),
            onHeaderError = sinon.spy(),
            parser = createParser(socket, onConnection, onHeaderError);

        parser.call(socket);

        assert.ok(!onConnection.called);
        assert.ok(onHeaderError.calledOnce);
    });
});
