/*jslint node: true, nomen: true, es5: true */
/** 
 * Developed By Carlo Bernaschina (GitHub - B3rn475) 
 * www.bernaschina.com 
 * 
 * Distributed under the MIT Licence 
 */
"use strict";

var ipaddr = require('ipaddr.js');

module.exports = function (socket, address) {
    if (typeof socket !== 'object') {
        throw new Error('The input is not an object');
    }
    if (typeof address !== 'string') {
        throw new Error('The address is not a string');
    }
	var addr = ipaddr.parse(address),
		buffer;
	switch (addr.kind()) {
	case "ipv4":
		(function () {
			var i = 2;
			buffer = new Buffer(6);
			buffer.writeUInt8(5, 0);
            buffer.writeUInt8(0, 1);
			addr.toByteArray().forEach(function (octet) {
				buffer.writeUInt8(octet, i);
				i = i + 1;
			});
		}());
		break;
	case "ipv6":
		(function () {
			var i = 2;
			buffer = new Buffer(18);
			buffer.writeUInt8(17, 0);
            buffer.writeUInt8(1, 1);
			addr.toByteArray().forEach(function (octet) {
				buffer.writeUInt8(octet, i);
				i = i + 1;
			});
		}());
		break;
	}
	socket.write(buffer);
	return socket;
};