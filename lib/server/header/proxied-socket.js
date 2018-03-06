/*jslint node: true, nomen: true, es5: true */
/**
 * Developed By Carlo Bernaschina (GitHub - B3rn475)
 * www.bernaschina.com
 *
 * Distributed under the MIT Licence
 */
"use strict";

var ipaddr = require('ipaddr.js');

function invalidHeader(message, data) {
    var error = new Error(message);
    error.type = data.type;
    error.length = data.length;
    return error;
}

function parseIPv4Header(buffer, length) {
    if (length !== 5) {
        throw invalidHeader("Invalid Header Length", {type: 0, length: length});
    }
    var address = '',
        i;
    for (i = 0; i < 4; i = i + 1) {
        address = address + '.';
        address = address + buffer.readUInt8(i + 1).toString(10);
    }
    address = address.substring(1);
    return ipaddr.parse(address).toString();
}

function parseIPv6Header(buffer, length) {
    if (length !== 17) {
        throw invalidHeader("Invalid Header Length", {type: 1, length: length});
    }
    var address = '',
        i;
    for (i = 0; i < 8; i = i + 1) {
        address = address + ':';
        address = address + buffer.readUInt16BE(i * 2 + 1).toString(16);
    }
    address = address.substring(1);
    return ipaddr.parse(address).toString();
}

function parseHeader(buffer, length) {
    var type = buffer.readUInt8(0);
    switch (type) {
    case 0:
        return parseIPv4Header(buffer, length);
    case 1:
        return parseIPv6Header(buffer, length);
    default:
        throw invalidHeader("Invalid Header Type", {type: type, length: length});
    }
}

function createParser(socket, connected, headerError) {
    var length,
        buffer;

    return function () {
        try {
            if (!length) {
                length = socket.read(1);
                if (length === null) {
                    return;
                }
                length = length.readUInt8(0);
                if (length === 0) {
                    throw invalidHeader("Invalid Header Length", {length: length});
                }
            }
            buffer = socket.read(length);
            if (!buffer) {
                return;
            }
            connected(parseHeader(buffer, length));
        } catch (e) {
            headerError(e);
        }
    };
}

module.exports = createParser;
