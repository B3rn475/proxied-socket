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
    createParser = require('../../lib/server/header/proxy-v2'),
    sinon = require('sinon');

const PROXY_V2_HEADER = '0d0a0d0a000d0a515549540a21110021'
const PROXY_V2_IPV6_HEADER = '0d0a0d0a000d0a515549540a21220039'
const PROXY_V2_DATA = 'ac190001ac190003c200276805001262697374726f322e6661726c65792e6f7267'
const PROXY_V2_IPV6_DATA = 'ac190001ac190001ac190001ac190001ac190003ac190003ac190003ac190003c200276805001262697374726f322e6661726c65792e6f7267'

describe('Client: proxy_v2', function () {
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
        var invalid = '00' + PROXY_V2_HEADER.substring(0, 30);
        var socket = new streams.ReadableStream(Buffer.from(invalid, 'hex')),
            onConnection = sinon.spy(),
            onHeaderError = sinon.spy(),
            parser = createParser(socket, onConnection, onHeaderError);

        parser.call(socket);

        assert.ok(!onConnection.called);
        assert.ok(onHeaderError.calledOnce);
    });
    it('should reject invalid proto', function () {
        // protocol is lower nibble of 0x0d byte.
        var invalid = PROXY_V2_HEADER.substring(0, 11) + 'aa' + PROXY_V2_HEADER.substring(13);
        var socket = new streams.ReadableStream(Buffer.from(invalid, 'hex')),
            onConnection = sinon.spy(),
            onHeaderError = sinon.spy(),
            parser = createParser(socket, onConnection, onHeaderError);

        parser.call(socket);

        assert.ok(!onConnection.called);
        assert.ok(onHeaderError.calledOnce);
    });
    it('should parse address (IPv4)', function () {
        var socket = new streams.ReadableStream(Buffer.from(PROXY_V2_HEADER + PROXY_V2_DATA, 'hex')),
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
        assert.equal(proxy.remoteAddress, '172.25.0.1');
        assert.equal(proxy.remotePort, 49664);
        assert.equal(proxy.localAddress, '172.25.0.3');
        assert.equal(proxy.localPort, 10088);
        assert.equal(proxy.tlv[0].type, 'UNIQUE_ID')
        assert.equal(proxy.tlv[0].value, 'bistro2.farley.org')        
    });
    it('should parse address (IPv6)', function () {
        var socket = new streams.ReadableStream(Buffer.from(PROXY_V2_IPV6_HEADER + PROXY_V2_IPV6_DATA, 'hex')),
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
        assert.equal(proxy.remoteAddress, 'ac19:1:ac19:1:ac19:1:ac19:1');
        assert.equal(proxy.remotePort, 49664);
        assert.equal(proxy.localAddress, 'ac19:3:ac19:3:ac19:3:ac19:3');
        assert.equal(proxy.localPort, 10088);
        assert.equal(proxy.tlv[0].type, 'UNIQUE_ID')
        assert.equal(proxy.tlv[0].value, 'bistro2.farley.org')        
    });
    it('should parse address (IPv4 splitted)', function () {
        var socket = new streams.ReadableStream(Buffer.from(PROXY_V2_HEADER, 'hex')),
            onConnection = sinon.spy(),
            onHeaderError = sinon.spy(),
            parser = createParser(socket, onConnection, onHeaderError),
            proxy;

        parser.call(socket);
        socket.append(Buffer.from(PROXY_V2_DATA, 'hex'));
        parser.call(socket);

        assert.ok(onConnection.calledOnce);
        assert.ok(!onHeaderError.called);
        assert.ok(onConnection.calledWith(sinon.match.object));
        proxy = onConnection.getCall(0).args[0];
        assert.equal(proxy.remoteFamily, 'IPv4');
        assert.equal(proxy.remoteAddress, '172.25.0.1');
        assert.equal(proxy.remotePort, 49664);
        assert.equal(proxy.localAddress, '172.25.0.3');
        assert.equal(proxy.localPort, 10088);
        assert.equal(proxy.tlv[0].type, 'UNIQUE_ID')
        assert.equal(proxy.tlv[0].value, 'bistro2.farley.org')        
    });
    it('should parse address (IPv6 splitted)', function () {
        var socket = new streams.ReadableStream(Buffer.from(PROXY_V2_IPV6_HEADER, 'hex')),
            onConnection = sinon.spy(),
            onHeaderError = sinon.spy(),
            parser = createParser(socket, onConnection, onHeaderError),
            proxy;

        parser.call(socket);
        socket.append(Buffer.from(PROXY_V2_IPV6_DATA, 'hex'));
        parser.call(socket);

        assert.ok(onConnection.calledOnce);
        assert.ok(!onHeaderError.called);
        assert.ok(onConnection.calledWith(sinon.match.object));
        proxy = onConnection.getCall(0).args[0];
        assert.equal(proxy.remoteFamily, 'IPv6');
        assert.equal(proxy.remoteAddress, 'ac19:1:ac19:1:ac19:1:ac19:1');
        assert.equal(proxy.remotePort, 49664);
        assert.equal(proxy.localAddress, 'ac19:3:ac19:3:ac19:3:ac19:3');
        assert.equal(proxy.localPort, 10088);
        assert.equal(proxy.tlv[0].type, 'UNIQUE_ID')
        assert.equal(proxy.tlv[0].value, 'bistro2.farley.org')        
    });
});
