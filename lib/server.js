/*jslint node: true, nomen: true, es5: true */
/**
 * Developed By Carlo Bernaschina (GitHub - B3rn475)
 * www.bernaschina.com
 *
 * Distributed under the MIT Licence
 */
"use strict";

var extend = require('util-extend'),
    ipaddr = require('ipaddr.js'),
    defaults = {
        method: 'override' // available 'override' | 'attach'
    };

function noop() {}

function invalidHeader(c, message, data) {
    var error = new Error(message);
    error.data = data;
    if (server.listeners("headerError").length > 0) {
        server.emit("headerError", error, c);
    } else {
        c.destroy();
    }
}

function defaultParser(c, manage) {
    // parses format used by Client, part of this library.
    var length = null,
    buffer = null;

    if (!length) {
        length = c.read(1);
        if (length === null) {
            return;
        }
        length = length.readUInt8(0);
        if (length === 0) {
            c.removeListener('readable', readable);
            return invalidHeader(c, "Invalid Header Length", {length: length});
        }
    }
    if (!buffer) {
        buffer = c.read(length);
        if (!buffer) {
            return;
        }
    }
    c.removeListener('readable', defaultParser);
    var type = buffer.readUInt8(0);
    switch (type) {
    case 0:
        if (length !== 5) {
            return invalidHeader(c, "Invalid Header Length", {type: type, length: length});
        }
        (function () {
            var address = '',
                i;
            for (i = 0; i < 4; i = i + 1) {
                address = address + '.';
                address = address + buffer.readUInt8(i + 1).toString(10);
            }
            address = address.substring(1);
            address = ipaddr.parse(address).toString();
            manage(c, address);
        }());
        break;
    case 1:
        if (length !== 9) {
            return invalidHeader(c, "Invalid Header Length", {type: type, length: length});
        }
        (function () {
            var address = '',
                i;
            for (i = 0; i < 8; i = i + 1) {
                address = address + ':';
                address = address + buffer.readUInt16BE(i * 2 + 1).toString(16);
            }
            address = address.substring(1);
            address = ipaddr.parse(address).toString();
            manage(c, address);
        }());
        break;
    default:
        return invalidHeader(c, "Invalid Header Type", {type: type, length: length});
    }
}

function haproxyParser(c, manage) {
    // parses format used by HAPROXY, stud, etc.
    // https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt
    var preamble = c.read(5);
    if (preamble !== 'PROXY') {
        return invalidHeader(c, "Invalid Header, missing PROXY", { preamble: preamble});
    }
    var header = '';
    var char;
    while (true) {
        char = c.read(1);
        if (char === '\n') {
            break;
        }
        header += char;
    }
    c.removeListener('readable', haproxyParser);
    var address = header.split(' ')[1];
    manage(c, address);
}

var methods = {
    attach: function (c, address) {
        c.__defineGetter__('originalAddress', function () {
            return address;
        });
    },
    override: function (c, address) {
        var getter = c.__lookupGetter__('remoteAddress');
        c.__defineGetter__('remoteAddress', function () {
            return address;
        });
        c.__defineGetter__('maskedAddress', getter);
    },
};

var formats = {
    'default': defaultParser,
    'haproxy': haproxyParser,
}

module.exports = function (server, options) {
    if (typeof server !== 'object') {
        throw new Error('The input is not an object');
    }
    options = extend(defaults, options);
    var manage;
    switch (options.method) {
    case 'attach':
    case 'override':
        manage = methods[options.method];
        break;
    default:
        throw new Error('Uknown method "' + options.method + '"');
    }
    var parser;
    options.format = options.format || 'default';
    parser = formats[options.format];
    if (parser === undefined) {
        throw new Error('Unknown method "' + options.format + '"');
    }

    server.listeners('connection').forEach(function (listener) {
        server.on('wrappedConnection', listener);
    });
    server.removeAllListeners('connection');
    server.on('connection', function(c) {
        c.on('readable', function(c) {
            parser(c, manage);
            server.emit('wrappedConnection', c);
        });
        c.on('error', noop);
    });
    server.addEventListener = function (event, listener) {
        if (event === 'connection') {
            event = 'wrappedConnection';
        }
        this.prototype.addEventListener(event, listener);
    };
    return server;
};
