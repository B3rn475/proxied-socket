/*jslint node: true, nomen: true, es5: true */
/** 
 * Developed By Carlo Bernaschina (GitHub - B3rn475) 
 * www.bernaschina.com 
 * 
 * Distributed under the MIT Licence 
 */
"use strict";

var extend = require('util-extend'),
    BigInteger = require('jsbn'),
    v4 = require("ipv6").v4,
    v6 = require("ipv6").v6,
    defaults = {
        method: "override" // available "override" | "attach"
    };

var methods = {
    attach : function (c, address, port) {
        c.__defineGetter__('originalAddress', function () {
            return address;
        });
    },
    override : function (c, address, port) {
        c.__defineGetter__('remoteAddress', function () {
            return address;
        });
    },
};

module.exports = function (server, options) {
    if (typeof server !== 'object') {
        throw new Error('The input is not an object');
    }
    options = extend(defaults, options);
    var manage;
    switch (options.method) {
    case "attach":
    case "override":
        manage = methods[options.method];
        break;
    default:
        throw new Error('Uknown method "' + options.method + '"');
    }
    
    server.listeners("connection").forEach(function (listener) {
        server.on("wrappedconnection", listener);
    });
    server.removeAllListeners("connection");
    server.on("connection", function (c) {
        var length = null,
            buffer = null;
        function readable() {
            if (!length) {
                length = c.read(1);
                if (!length) { return; }
                length = length.readUInt8(0);
                // @TODO Add 0 Handling
            }
            if (!buffer) {
                buffer = c.read(length);
                if (!buffer) { return; }
            }
            c.removeListener('readable', readable);
            var type = buffer.readUInt8(0);
            switch (type) {
            case 0:
                (function () {
                    // @TODO Add length Handling
                    var address = v4.Address.fromInteger(buffer.readUInt32BE()).correctForm();
                    manage(c, address);
                }());
                break;
            case 1:
                (function () {
                    // @TODO Add length Error Handling
                    var address = "",
                        port,
                        i;
                    for (i = 1; i < 17; i = i + 1) {
                        address = address + buffer.readUInt8(i).toString(16);
                    }
                    address = v6.Address.fromBigInteger(new BigInteger(address, 16)).correctForm();
                    manage(c, address);
                }());
                break;
            default:
                // @TODO Add Error Handling
                break;
            }
            server.emit("wrappedconnection", c);
        }
        c.on('readable', readable);
    });
    server.addEventListener = function (event, listener) {
        if (event === "connection") { event = "wrappedconnection"; }
        this.prototype.addEventListener(event, listener);
    };
};