/*jslint node: true, nomen: true, es5: true */
/**
 * Developed By Carlo Bernaschina (GitHub - B3rn475)
 * www.bernaschina.com
 *
 * Distributed under the MIT Licence
 */
/*global describe, it, beforeEach */
"use strict";

var assert = require('assert'),
    sinon = require('sinon'),
    wrap = require('../lib/server');

function noop() { return undefined; }

describe('Server', function () {
    it('should be a function', function () {
        assert.equal(typeof wrap, 'function');
    });
    describe('arguments', function () {
        it('should throw with no arguments', function () {
            assert.throws(function () { wrap(); });
        });
        describe('server', function () {
            it('should throw with undefined', function () {
                assert.throws(function () { wrap(undefined); });
            });
            it('should throw with null', function () {
                assert.throws(function () { wrap(undefined); });
            });
            it('should throw with string', function () {
                assert.throws(function () { wrap('string'); });
            });
            it('should throw with string (empty)', function () {
                assert.throws(function () { wrap(''); });
            });
            it('should throw with number (zero)', function () {
                assert.throws(function () { wrap(0); });
            });
            it('should throw with number', function () {
                assert.throws(function () { wrap(1); });
            });
            it('should throw with function', function () {
                assert.throws(function () { wrap(noop); });
            });
            it('should throw with boolean', function () {
                assert.throws(function () { wrap(true); });
            });
            it('should throw with boolean (false)', function () {
                assert.throws(function () { wrap(false); });
            });
        });
        describe('options', function () {
            var server;
            beforeEach(function () {
                server = {
                    on: sinon.spy(),
                    listeners: sinon.spy(function () { return []; }),
                    addEventListener: sinon.spy()
                };
            });
            it('should throw with undefined', function () {
                assert.throws(function () { wrap(server, undefined); });
                assert.ok(!server.on.called);
                assert.ok(!server.addEventListener.called);
            });
            it('should throw with null', function () {
                assert.throws(function () { wrap(server, null); });
                assert.ok(!server.on.called);
                assert.ok(!server.addEventListener.called);
            });
            it('should throw with invalid string', function () {
                assert.throws(function () { wrap(server, 'string'); });
                assert.ok(!server.on.called);
                assert.ok(!server.addEventListener.called);
            });
            it('should throw with invalid string (empty)', function () {
                assert.throws(function () { wrap(server, ''); });
                assert.ok(!server.on.called);
                assert.ok(!server.addEventListener.called);
            });
            it('should throw with number (zero)', function () {
                assert.throws(function () { wrap(server, 0); });
                assert.ok(!server.on.called);
                assert.ok(!server.addEventListener.called);
            });
            it('should throw with number', function () {
                assert.throws(function () { wrap(server, 1); });
                assert.ok(!server.on.called);
                assert.ok(!server.addEventListener.called);
            });
            it('should throw with function', function () {
                assert.throws(function () { wrap(server, noop); });
                assert.ok(!server.on.called);
                assert.ok(!server.addEventListener.called);
            });
            it('should throw with boolean', function () {
                assert.throws(function () { wrap(server, true); });
                assert.ok(!server.on.called);
                assert.ok(!server.addEventListener.called);
            });
            it('should throw with boolean (false)', function () {
                assert.throws(function () { wrap(server, false); });
                assert.ok(!server.on.called);
                assert.ok(!server.addEventListener.called);
            });
            describe('method', function () {
                it('should throw with undefined', function () {
                    assert.throws(function () { wrap(server, {method: undefined}); });
                    assert.ok(!server.on.called);
                    assert.ok(!server.addEventListener.called);
                });
                it('should throw with null', function () {
                    assert.throws(function () { wrap(server, {method: null}); });
                    assert.ok(!server.on.called);
                    assert.ok(!server.addEventListener.called);
                });
                it('should throw with invalid string', function () {
                    assert.throws(function () { wrap(server, {method: 'string'}); });
                    assert.ok(!server.on.called);
                    assert.ok(!server.addEventListener.called);
                });
                it('should throw with invalid string (empty)', function () {
                    assert.throws(function () { wrap(server, {method: ''}); });
                    assert.ok(!server.on.called);
                    assert.ok(!server.addEventListener.called);
                });
                it('should throw with number (zero)', function () {
                    assert.throws(function () { wrap(server, {method: 0}); });
                    assert.ok(!server.on.called);
                    assert.ok(!server.addEventListener.called);
                });
                it('should throw with number', function () {
                    assert.throws(function () { wrap(server, {method: 1}); });
                    assert.ok(!server.on.called);
                    assert.ok(!server.addEventListener.called);
                });
                it('should throw with function', function () {
                    assert.throws(function () { wrap(server, {method: noop}); });
                    assert.ok(!server.on.called);
                    assert.ok(!server.addEventListener.called);
                });
                it('should throw with boolean', function () {
                    assert.throws(function () { wrap(server, {method: true}); });
                    assert.ok(!server.on.called);
                    assert.ok(!server.addEventListener.called);
                });
                it('should throw with boolean (false)', function () {
                    assert.throws(function () { wrap(server, {method: false}); });
                    assert.ok(!server.on.called);
                    assert.ok(!server.addEventListener.called);
                });
            });
            describe('format', function () {
                it('should throw with undefined', function () {
                    assert.throws(function () { wrap(server, {format: undefined}); });
                    assert.ok(!server.on.called);
                    assert.ok(!server.addEventListener.called);
                });
                it('should throw with null', function () {
                    assert.throws(function () { wrap(server, {format: null}); });
                    assert.ok(!server.on.called);
                    assert.ok(!server.addEventListener.called);
                });
                it('should throw with invalid string', function () {
                    assert.throws(function () { wrap(server, {format: 'string'}); });
                    assert.ok(!server.on.called);
                    assert.ok(!server.addEventListener.called);
                });
                it('should throw with invalid string (empty)', function () {
                    assert.throws(function () { wrap(server, {format: ''}); });
                    assert.ok(!server.on.called);
                    assert.ok(!server.addEventListener.called);
                });
                it('should throw with number (zero)', function () {
                    assert.throws(function () { wrap(server, {format: 0}); });
                    assert.ok(!server.on.called);
                    assert.ok(!server.addEventListener.called);
                });
                it('should throw with number', function () {
                    assert.throws(function () { wrap(server, {format: 1}); });
                    assert.ok(!server.on.called);
                    assert.ok(!server.addEventListener.called);
                });
                it('should throw with function', function () {
                    assert.throws(function () { wrap(server, {format: noop}); });
                    assert.ok(!server.on.called);
                    assert.ok(!server.addEventListener.called);
                });
                it('should throw with boolean', function () {
                    assert.throws(function () { wrap(server, {format: true}); });
                    assert.ok(!server.on.called);
                    assert.ok(!server.addEventListener.called);
                });
                it('should throw with boolean (false)', function () {
                    assert.throws(function () { wrap(server, {format: false}); });
                    assert.ok(!server.on.called);
                    assert.ok(!server.addEventListener.called);
                });
            });
        });
    });
    it('should hijack connection events', function () {
        var pre = sinon.spy(),
            post = sinon.spy(),
            other = sinon.spy(),
            on = sinon.spy(),
            listeners = sinon.spy(function () { return [pre]; }),
            addEventListener = sinon.spy(),
            removeAllListeners = sinon.spy(),
            server = {
                on: on,
                listeners: listeners,
                addEventListener: addEventListener,
                removeAllListeners: removeAllListeners
            };

        wrap(server);

        assert.ok(on.calledWith('wrappedConnection', pre));
        assert.ok(!on.calledWith('connection', pre));
        assert.ok(removeAllListeners.calledWith('connection'));

        server.on('connection', post);
        server.on('other', other);

        assert.ok(on.calledWith('wrappedConnection', post));
        assert.ok(!on.calledWith('connection', post));
        assert.ok(on.calledWith('other', other));

        server.addEventListener('connection', post);
        server.addEventListener('other', other);

        assert.ok(addEventListener.calledWith('wrappedConnection', post));
        assert.ok(!addEventListener.calledWith('connection', post));
        assert.ok(addEventListener.calledWith('other', other));
    });
    it('should listen for the connection', function () {
        var serverOn = sinon.spy(),
            socketOn = sinon.spy(),
            server = {
                on: serverOn,
                listeners: sinon.spy(function () { return []; }),
                addEventListener: serverOn,
                removeAllListeners: sinon.spy()
            },
            socket = {
                on: socketOn,
                addEventListener: socketOn,
                removeListener: sinon.spy()
            };

        wrap(server);

        serverOn.withArgs('connection', sinon.match.func)
            .getCall(0)
            .args[1].call(server, socket);

        assert.ok(socketOn.calledWith('readable', sinon.match.func));
        assert.ok(socketOn.calledWith('error', sinon.match.func));
    });
    it('should destroy socket on error', function () {
        var serverOn = sinon.spy(),
            socketOn = sinon.spy(),
            serverEmit = sinon.spy(),
            socketDestroy = sinon.spy(),
            parser = sinon.spy(),
            format = sinon.spy(function () {
                return parser;
            }),
            server = {
                on: serverOn,
                listeners: sinon.spy(function () { return []; }),
                addEventListener: serverOn,
                removeAllListeners: sinon.spy(),
                emit: serverEmit
            },
            socket = {
                on: socketOn,
                addEventListener: sinon.spy(),
                removeListener: sinon.spy(),
                destroy: socketDestroy
            },
            error = new Error();

        socket.__defineGetter__('remoteAddress', function () {
            return 'originAddress';
        });

        wrap(server, {
            format: format
        });

        assert.ok(!format.called);

        serverOn.withArgs('connection', sinon.match.func)
            .getCall(0)
            .args[1].call(server, socket);

        assert.ok(format.calledOnce);
        assert.ok(!parser.called);
        assert.ok(!serverEmit.called);

        socketOn.withArgs('readable', sinon.match.func)
            .getCall(0)
            .args[1].call(socket);

        assert.ok(format.calledOnce);
        assert.ok(parser.calledOnce);
        assert.ok(!serverEmit.called);

        socketOn.withArgs('readable', sinon.match.func)
            .getCall(0)
            .args[1].call(socket);

        assert.ok(format.calledOnce);
        assert.ok(parser.calledTwice);
        assert.ok(!serverEmit.called);

        format.getCall(0).args[2].call(null, error);

        assert.ok(format.calledOnce);
        assert.ok(parser.calledTwice);
        assert.ok(socketDestroy.calledOnce);
        assert.ok(!serverEmit.called);
    });
    it('should forward header errors if listening', function () {
        var serverOn = sinon.spy(),
            serverEmit = sinon.spy(),
            socketOn = sinon.spy(),
            parser = sinon.spy(),
            format = sinon.spy(function () {
                return parser;
            }),
            server = {
                on: serverOn,
                listeners: sinon.spy(function () { return [sinon.spy()]; }),
                addEventListener: serverOn,
                removeAllListeners: sinon.spy(),
                emit: serverEmit,
            },
            socket = {
                on: socketOn,
                addEventListener: sinon.spy(),
                removeListener: sinon.spy()
            },
            error = new Error();

        socket.__defineGetter__('remoteAddress', function () {
            return 'originAddress';
        });

        wrap(server, {
            format: format
        });

        assert.ok(!format.called);
        assert.ok(!serverEmit.called);

        serverOn.withArgs('connection', sinon.match.func)
            .getCall(0)
            .args[1].call(server, socket);

        assert.ok(format.calledOnce);
        assert.ok(!parser.called);
        assert.ok(!serverEmit.called);

        socketOn.withArgs('readable', sinon.match.func)
            .getCall(0)
            .args[1].call(socket);

        assert.ok(format.calledOnce);
        assert.ok(parser.calledOnce);
        assert.ok(!serverEmit.called);

        socketOn.withArgs('readable', sinon.match.func)
            .getCall(0)
            .args[1].call(socket);

        assert.ok(format.calledOnce);
        assert.ok(parser.calledTwice);
        assert.ok(!serverEmit.called);

        format.getCall(0).args[2].call(null, error);

        assert.ok(format.calledOnce);
        assert.ok(parser.calledTwice);
        assert.ok(serverEmit.calledWith('headerError', error, socket));
    });
    it('should respect the format (override)', function () {
        var serverOn = sinon.spy(),
            serverEmit = sinon.spy(),
            socketOn = sinon.spy(),
            parser = sinon.spy(),
            format = sinon.spy(function () {
                return parser;
            }),
            server = {
                on: serverOn,
                listeners: sinon.spy(function () { return []; }),
                addEventListener: serverOn,
                removeAllListeners: sinon.spy(),
                emit: serverEmit,
            },
            socket = {
                on: socketOn,
                addEventListener: sinon.spy(),
                removeListener: sinon.spy()
            },
            overrideAddress = 'overrideAddress',
            realAddress = 'realAddress';

        socket.__defineGetter__('remoteAddress', function () {
            return realAddress;
        });

        wrap(server, {
            method: 'override',
            format: format
        });

        assert.ok(!format.called);
        assert.ok(!serverEmit.called);

        serverOn.withArgs('connection', sinon.match.func)
            .getCall(0)
            .args[1].call(server, socket);

        assert.ok(format.calledOnce);
        assert.ok(!parser.called);
        assert.ok(!serverEmit.called);

        socketOn.withArgs('readable', sinon.match.func)
            .getCall(0)
            .args[1].call(socket);

        assert.ok(format.calledOnce);
        assert.ok(parser.calledOnce);
        assert.ok(!serverEmit.called);

        socketOn.withArgs('readable', sinon.match.func)
            .getCall(0)
            .args[1].call(socket);

        assert.ok(format.calledOnce);
        assert.ok(parser.calledTwice);
        assert.ok(!serverEmit.called);

        format.getCall(0).args[1].call(null, overrideAddress);

        assert.ok(format.calledOnce);
        assert.ok(parser.calledTwice);
        assert.ok(serverEmit.calledWith('wrappedConnection', socket));

        assert.equal(socket.remoteAddress, overrideAddress);
        assert.equal(socket.maskedAddress, realAddress);
        assert.equal(socket.originalAddress, undefined);
    });
    it('should respect the format (attach)', function () {
        var serverOn = sinon.spy(),
            serverEmit = sinon.spy(),
            socketOn = sinon.spy(),
            parser = sinon.spy(),
            format = sinon.spy(function () {
                return parser;
            }),
            server = {
                on: serverOn,
                listeners: sinon.spy(function () { return []; }),
                addEventListener: serverOn,
                removeAllListeners: sinon.spy(),
                emit: serverEmit,
            },
            socket = {
                on: socketOn,
                addEventListener: sinon.spy(),
                removeListener: sinon.spy()
            },
            overrideAddress = 'overrideAddress',
            realAddress = 'realAddress';

        socket.__defineGetter__('remoteAddress', function () {
            return realAddress;
        });

        wrap(server, {
            method: 'attach',
            format: format
        });

        assert.ok(!format.called);
        assert.ok(!serverEmit.called);

        serverOn.withArgs('connection', sinon.match.func)
            .getCall(0)
            .args[1].call(server, socket);

        assert.ok(format.calledOnce);
        assert.ok(!parser.called);
        assert.ok(!serverEmit.called);

        socketOn.withArgs('readable', sinon.match.func)
            .getCall(0)
            .args[1].call(socket);

        assert.ok(format.calledOnce);
        assert.ok(parser.calledOnce);
        assert.ok(!serverEmit.called);

        socketOn.withArgs('readable', sinon.match.func)
            .getCall(0)
            .args[1].call(socket);

        assert.ok(format.calledOnce);
        assert.ok(parser.calledTwice);
        assert.ok(!serverEmit.called);

        format.getCall(0).args[1].call(null, overrideAddress);

        assert.ok(format.calledOnce);
        assert.ok(parser.calledTwice);
        assert.ok(serverEmit.calledWith('wrappedConnection', socket));

        assert.equal(socket.remoteAddress, realAddress);
        assert.equal(socket.maskedAddress, undefined);
        assert.equal(socket.originalAddress, overrideAddress);
    });
});
