/*jslint node: true, nomen: true, es5: true */
/**
 * Developed By Carlo Bernaschina (GitHub - B3rn475)
 * www.bernaschina.com
 *
 * Distributed under the MIT Licence
 */
"use strict";

var ipaddr = require('ipaddr.js');

function formatIPv4Header(socket) {
    var header = new Buffer(14);
    header.writeUInt8(13, 0);
    header.writeUInt8(0, 1);
    ipaddr.IPv4.parse(socket.remoteAddress).toByteArray().forEach(function (octet, index) {
        header.writeUInt8(octet, 2 + index);
    });
    header.writeUInt16BE(socket.remotePort, 6);
    ipaddr.IPv4.parse(socket.localAddress).toByteArray().forEach(function (octet, index) {
        header.writeUInt8(octet, 8 + index);
    });
    header.writeUInt16BE(socket.localPort, 12);
    return header;
}

function formatIPv6Header(socket) {
    var header = new Buffer(38);
    header.writeUInt8(37, 0);
    header.writeUInt8(1, 1);
    ipaddr.IPv6.parse(socket.remoteAddress).toByteArray().forEach(function (octet, index) {
        header.writeUInt8(octet, 2 + index);
    });
    header.writeUInt16BE(socket.remotePort, 18);
    ipaddr.IPv6.parse(socket.localAddress).toByteArray().forEach(function (octet, index) {
        header.writeUInt8(octet, 20 + index);
    });
    header.writeUInt16BE(socket.localPort, 36);
    return header;
}

function formatHeader(socket) {
    if (typeof socket.remotePort !== 'number' || socket.remotePort < 0 || socket.remotePort > 65535) {
        throw new Error('The remote port must be a number between 0 and 65535');
    }
    if (typeof socket.localPort !== 'number' || socket.localPort < 0 || socket.localPort > 65535) {
        throw new Error('The local port must be a number between 0 and 65535');
    }
    switch (socket.remoteFamily) {
    case 'IPv4':
        return formatIPv4Header(socket);
    case 'IPv6':
        return formatIPv6Header(socket);
    default:
        throw new Error('The remote family muast be IPv4 or IPv6');
    }
}

function sendHeader(source, target) {
    if (typeof source !== 'object') {
        throw new Error('The source socket is not an object');
    }
    if (typeof target !== 'object') {
        throw new Error('The target socket is not an object');
    }

    target.write(formatHeader(source));

    return target;
}

module.exports = sendHeader;
