/*jslint node: true, nomen: true, es5: true */
/**
 * Developed By Carlo Bernaschina (GitHub - B3rn475)
 * www.bernaschina.com
 *
 * Distributed under the MIT Licence
 */
"use strict";

var attachment = require('./attachment'),
    header = require('./header');

// istanbul ignore next
function noop() { return undefined; }

var methods = {
    'attach': attachment.attach,
    'override': attachment.override
};

var formats = {
    'default': header.proxiedSocket,
    'proxied-socket': header.proxiedSocket,
    'haproxy': header.haproxy,
    'haproxy-v2': header.haproxyV2,
};

function wrap(server, options) {
    if (typeof server !== 'object') {
        throw new Error('The first argument must be a server');
    }
    options = options || {};
    if (typeof options !== 'object') {
        throw new Error('The options must be an object');
    }
    if (options.method !== undefined &&
            typeof options.method !== 'string' &&
            typeof options.method !== 'function') {
        throw new Error('The method must be a string or function');
    }
    if (options.format !== undefined &&
            typeof options.format !== 'string' &&
            typeof options.format !== 'function') {
        throw new Error('The format must be a string or function');
    }

    var method = options.method || 'override',
        format = options.format || 'default',
        attach,
        createParser;

    if (typeof method === 'string') {
        attach = methods[method];
        if (attach === undefined) {
            throw new Error('Uknown method "' + method + '"');
        }
    } else {
        attach = method;
    }

    if (typeof format === 'string') {
        createParser = formats[format];
        if (createParser === undefined) {
            throw new Error('Uknown format "' + format + '"');
        }
    } else {
        createParser = format;
    }

    server.listeners('connection').forEach(function (listener) {
        server.on('wrappedConnection', listener);
    });
    server.removeAllListeners('connection');
    server.on('connection', function (socket) {
        var parse;

        function onConnection(proxy) {
            socket.removeListener('readable', parse);
            attach(proxy, socket);
            server.emit('wrappedConnection', socket);
        }

        function onHeaderError(error) {
            socket.removeListener('readable', parse);
            if (server.listeners("headerError").length > 0) {
                server.emit("headerError", error, socket);
            } else {
                socket.destroy();
            }
        }

        parse = createParser(socket, onConnection, onHeaderError);

        socket.on('readable', parse);
        socket.on('error', noop);
    });

    server._on = server.on;
    server.on = function (event, listener) {
        if (event === 'connection') {
            event = 'wrappedConnection';
        }
        server._on(event, listener);
    };

    server._addEventListener = server.addEventListener;
    server.addEventListener = function (event, listener) {
        if (event === 'connection') {
            event = 'wrappedConnection';
        }
        server._addEventListener(event, listener);
    };
    return server;
}

module.exports = wrap;
