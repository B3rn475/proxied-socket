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

function toArray(buffer, offset, length) {
    var array = [],
        i;
    array.length = length;
    for (i = 0; i < length; i += 1) {
        array[i] = buffer[offset + i];
    }
    return array;
}

function parseIPv4Header(header, length) {
    if (length !== 13) {
        throw invalidHeader("Invalid IPv4 Header Length", {type: 0, length: length});
    }
    return {
        remoteFamily: 'IPv4',
        remoteAddress: ipaddr.fromByteArray(toArray(header, 1, 4)).toString(),
        remotePort: header.readUInt16BE(5),
        localAddress: ipaddr.fromByteArray(toArray(header, 7, 4)).toString(),
        localPort: header.readUInt16BE(11)
    };
}

function parseIPv6Header(header, length) {
    if (length !== 37) {
        throw invalidHeader("Invalid IPv6 Header Length", {type: 1, length: length});
    }
    return {
        remoteFamily: 'IPv6',
        remoteAddress: ipaddr.fromByteArray(toArray(header, 1, 16)).toString(),
        remotePort: header.readUInt16BE(17),
        localAddress: ipaddr.fromByteArray(toArray(header, 19, 16)).toString(),
        localPort: header.readUInt16BE(35)
    };
}

function parseHeader(header, length) {
    var type = header.readUInt8(0);
    switch (type) {
    case 0:
        return parseIPv4Header(header, length);
    case 1:
        return parseIPv6Header(header, length);
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
