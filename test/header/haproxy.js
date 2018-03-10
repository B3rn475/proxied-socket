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
    createParser = require('../../lib/server/header/haproxy'),
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
    it('should reject invalid headers preamble', function () {
        var socket = new streams.ReadableStream(new Buffer('FOOBAR TCP4 1.2.3.4 5.6.7.8 100 200\n')),
            onConnection = sinon.spy(),
            onHeaderError = sinon.spy(),
            parser = createParser(socket, onConnection, onHeaderError);

        parser.call(socket);

        assert.ok(!onConnection.called);
        assert.ok(onHeaderError.calledOnce);
    });
    it('should reject invalid proto', function () {
        var socket = new streams.ReadableStream(new Buffer('PROXY FOOBAR 1.2.3.4 5.6.7.8 100 200\n')),
            onConnection = sinon.spy(),
            onHeaderError = sinon.spy(),
            parser = createParser(socket, onConnection, onHeaderError);

        parser.call(socket);

        assert.ok(!onConnection.called);
        assert.ok(onHeaderError.calledOnce);
    });
    it('should parse address (IPv4)', function () {
        var socket = new streams.ReadableStream(new Buffer('PROXY TCP4 1.2.3.4 5.6.7.8 100 200\n')),
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
        assert.equal(proxy.remoteAddress, '1.2.3.4');
        assert.equal(proxy.remotePort, 100);
        assert.equal(proxy.localAddress, '5.6.7.8');
        assert.equal(proxy.localPort, 200);
    });
    it('should parse address (IPv6)', function () {
        var socket = new streams.ReadableStream(new Buffer('PROXY TCP6 1:203:405:607:809:a0b:c0d:e0f 1213:1415:1617:1819:1a1b:1c1d:1e1f:2021 101 201\n')),
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
        assert.equal(proxy.remotePort, 101);
        assert.equal(proxy.localAddress, '1213:1415:1617:1819:1a1b:1c1d:1e1f:2021');
        assert.equal(proxy.localPort, 201);
    });
    it('should parse address (IPv4 splitted)', function () {
        var socket = new streams.ReadableStream(new Buffer('PROX')),
            onConnection = sinon.spy(),
            onHeaderError = sinon.spy(),
            parser = createParser(socket, onConnection, onHeaderError),
            proxy;

        parser.call(socket);
        socket.append('Y TCP4 1.2.3.4 5.6.7.8 100 200\n');
        parser.call(socket);

        assert.ok(onConnection.calledOnce);
        assert.ok(!onHeaderError.called);
        assert.ok(onConnection.calledWith(sinon.match.object));
        proxy = onConnection.getCall(0).args[0];
        assert.equal(proxy.remoteFamily, 'IPv4');
        assert.equal(proxy.remoteAddress, '1.2.3.4');
        assert.equal(proxy.remotePort, 100);
        assert.equal(proxy.localAddress, '5.6.7.8');
        assert.equal(proxy.localPort, 200);
    });
    it('should parse address (IPv6)', function () {
        var socket = new streams.ReadableStream(new Buffer('PROXY TCP6 1:203:405:607:809:a0b:c0d:e0f')),
            onConnection = sinon.spy(),
            onHeaderError = sinon.spy(),
            parser = createParser(socket, onConnection, onHeaderError),
            proxy;

        parser.call(socket);
        socket.append(' 1213:1415:1617:1819:1a1b:1c1d:1e1f:2021 101 201\n');
        parser.call(socket);

        assert.ok(onConnection.calledOnce);
        assert.ok(!onHeaderError.called);
        assert.ok(onConnection.calledWith(sinon.match.object));
        proxy = onConnection.getCall(0).args[0];
        assert.equal(proxy.remoteFamily, 'IPv6');
        assert.equal(proxy.remoteAddress, '1:203:405:607:809:a0b:c0d:e0f');
        assert.equal(proxy.remotePort, 101);
        assert.equal(proxy.localAddress, '1213:1415:1617:1819:1a1b:1c1d:1e1f:2021');
        assert.equal(proxy.localPort, 201);
    });
});
