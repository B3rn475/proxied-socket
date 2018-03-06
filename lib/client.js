/*jslint node: true, nomen: true, es5: true */
/**
 * Developed By Carlo Bernaschina (GitHub - B3rn475)
 * www.bernaschina.com
 *
 * Distributed under the MIT Licence
 */
"use strict";

var ipaddr = require('ipaddr.js');

function formatIPv4Header(address) {
    var i = 2,
        header = new Buffer(6);
    header.writeUInt8(5, 0);
    header.writeUInt8(0, 1);
    address.toByteArray().forEach(function (octet) {
        header.writeUInt8(octet, i);
        i = i + 1;
    });
    return header;
}

function formatIPv6Header(address) {
    var i = 2,
        header = new Buffer(18);
    header.writeUInt8(17, 0);
    header.writeUInt8(1, 1);
    address.toByteArray().forEach(function (octet) {
        header.writeUInt8(octet, i);
        i = i + 1;
    });
    return header;
}

function formatHeader(address) {
    switch (address.kind()) {
    case 'ipv4':
        return formatIPv4Header(address);
    case 'ipv6':
        return formatIPv6Header(address);
    }
}

function wrap(socket, address) {
    if (typeof socket !== 'object') {
        throw new Error('The input is not an object');
    }
    if (typeof address !== 'string') {
        throw new Error('The address is not a string');
    }

    socket.write(formatIPv4Header(ipaddr.parse(address)));

    return socket;
}

module.exports = wrap;
