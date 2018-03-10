/*jslint node: true, nomen: true, es5: true */
/**
 * Developed By:
 * - Ben Timby (GitHub - btimby) ben.timby.com
 * - Carlo Bernaschina (GitHub - B3rn475) www.bernaschina.com
 *
 * Distributed under the MIT Licence
 */
"use strict";

function protoToFamily(proto) {
    switch (proto) {
    case 'TCP4':
        return 'IPv4';
    case 'TCP6':
        return 'IPv6';
    default:
        throw new Error('Invalid proto field in PROXY line');
    }
}

function parseHeader(header) {
    var parts = header.split(' '),
        fields;
    if (parts[0] !== 'PROXY') {
        throw new Error('PROXY line missing, is haproxy present?');
    }
    fields = {
        proto: parts[1],
        remoteFamily: protoToFamily(parts[1]),
        remoteAddress: parts[2],
        localAddress: parts[3],
        remotePort: parseInt(parts[4], 10),
        localPort: parseInt(parts[5], 10),
    };
    return fields;
}

function createParser(socket, connected, headerError) {
    var buffer = '';

    return function () {
        var char;

        try {
            while (true) {
                char = socket.read(1);
                if (char === null) {
                    return;
                }
                char = char.toString('ascii');
                if (char === '\n') {
                    break;
                }
                buffer += char;
            }
            connected(parseHeader(buffer));
        } catch (e) {
            headerError(e);
        }
    };
}

module.exports = createParser;
