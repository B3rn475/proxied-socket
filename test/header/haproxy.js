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
    it('should parse address', function () {
        var socket = new streams.ReadableStream(new Buffer('PROXY TCP4 1.2.3.4 5.6.7.8 100 200\n')),
            onConnection = sinon.spy(),
            onHeaderError = sinon.spy(),
            parser = createParser(socket, onConnection, onHeaderError);

        parser.call(socket);

        assert.ok(onConnection.calledOnce);
        assert.ok(onConnection.calledWith('1.2.3.4'));
        assert.ok(!onHeaderError.called);
    });
    it('should parse address (splitted)', function () {
        var socket = new streams.ReadableStream(new Buffer('PROX')),
            onConnection = sinon.spy(),
            onHeaderError = sinon.spy(),
            parser = createParser(socket, onConnection, onHeaderError);

        parser.call(socket);
        socket.append('Y TCP4 1.2.3.4 5.6.7.8 100 200\n');
        parser.call(socket);

        assert.ok(onConnection.calledOnce);
        assert.ok(onConnection.calledWith('1.2.3.4'));
        assert.ok(!onHeaderError.called);
    });
});
