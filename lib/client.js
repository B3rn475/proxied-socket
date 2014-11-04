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
	// @TODO check inputs
	var addr = ipaddr.parse(address),
		buffer;
	switch (addr.kind()) {
	case "ipv4":
		(function () {
			var i = 1;
			buffer = new Buffer(5);
			buffer.writeUInt8(4,0);
			addr.toByteArray().forEach(function (octet) {
				buffer.writeUInt8(octet, i);
				i = i + 1;
			});
		}());
		break;
	case "ipv6":
		(function () {
			var i = 1;
			buffer = new Buffer(17);
			buffer.writeUInt8(16,0);
			addr.toByteArray().forEach(function (octet) {
				buffer.writeUInt8(octet, i);
				i = i + 1;
			});
		}());
		break;
	}
	socket.write(buffer);
	return socket;
}