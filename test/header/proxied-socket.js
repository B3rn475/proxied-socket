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
        var socket = new streams.ReadableStream(new Buffer([5, 0, 1, 2, 3, 4])),
            onConnection = sinon.spy(),
            onHeaderError = sinon.spy(),
            parser = createParser(socket, onConnection, onHeaderError);

        parser.call(socket);

        assert.ok(onConnection.calledOnce);
        assert.ok(onConnection.calledWith('1.2.3.4'));
        assert.ok(!onHeaderError.called);
    });
    it('should parse IPv4 splitted', function () {
        var socket = new streams.ReadableStream(new Buffer([])),
            onConnection = sinon.spy(),
            onHeaderError = sinon.spy(),
            parser = createParser(socket, onConnection, onHeaderError);

        parser.call(socket);
        socket.append(new Buffer([5]));
        parser.call(socket);
        socket.append(new Buffer([0]));
        parser.call(socket);
        socket.append(new Buffer([1]));
        parser.call(socket);
        socket.append(new Buffer([2]));
        parser.call(socket);
        socket.append(new Buffer([3]));
        parser.call(socket);
        socket.append(new Buffer([4]));
        parser.call(socket);

        assert.ok(onConnection.calledOnce);
        assert.ok(onConnection.calledWith('1.2.3.4'));
        assert.ok(!onHeaderError.called);
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
        var socket = new streams.ReadableStream(new Buffer([17, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16])),
            onConnection = sinon.spy(),
            onHeaderError = sinon.spy(),
            parser = createParser(socket, onConnection, onHeaderError);

        parser.call(socket);

        assert.ok(onConnection.calledOnce);
        assert.ok(onConnection.calledWith('102:304:506:708:90a:b0c:d0e:f10'));
        assert.ok(!onHeaderError.called);
    });
    it('should parse IPv6 splitted', function () {
        var socket = new streams.ReadableStream(new Buffer([17, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])),
            onConnection = sinon.spy(),
            onHeaderError = sinon.spy(),
            parser = createParser(socket, onConnection, onHeaderError);

        parser.call(socket);
        socket.append(new Buffer([16]));
        parser.call(socket);

        assert.ok(onConnection.calledOnce);
        assert.ok(onConnection.calledWith('102:304:506:708:90a:b0c:d0e:f10'));
        assert.ok(!onHeaderError.called);
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
