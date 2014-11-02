/*jslint node: true, nomen: true, es5: true */
/** 
 * Developed By Carlo Bernaschina (GitHub - B3rn475) 
 * www.bernaschina.com 
 * 
 * Distributed under the MIT Licence 
 */
"use strict";
var extend = require('util-extend'),
    defaults = {
        method: "override" // available "override" | "attach"
    };

function formatAddressIPV4(address) {
    return address[0].toString() + "." + address[1].toString() + "." + address[2].toString() + "." + address[3].toString();
}

function formatAddressIPV6(address) {
    var partials = [],
        min0 = 0,
        ret = "";
    address.forEach(function (part) {
        if (part !== 0) {
            partials.push(part);
        } else {
            var last = partials[partials.length - 1];
            if (last < 0) {
                last = last - 1;
                partials[partials.length - 1] = last;
            } else {
                partials.push(-1);
                last = -1;
            }
            min0 = Math.min(min0, last);
        }
    });
    if (partials.length === 1) { return "::"; } //all zeros
    partials.forEach(function (part) {
        if (part > 0) {
            ret = ret + part.toString(0);
        } else {
            if (part === min0) {
                ret = ret + ":";
                min0 = 0;
            } else {
                while (part < 0) {
                    ret = ret + "0:";
                    part = part + 1;
                }
            }
        }
        ret = ret + ":";
    });
    return ret.substr(0, ret.length - 1); //remove last :
}

var methods = {
    attach : {
        ipv4 : function (c, address, port) {
            address = formatAddressIPV4(address);
            c.__defineGetter__('originalAddress', function () {
                return address;
            });
            c.__defineGetter__('originalPort', function () {
                return port;
            });
        },
        ipv6 : function (c, address, port) {
            address = formatAddressIPV6(address);
            c.__defineGetter__('originalAddress', function () {
                
                return address;
            });
            c.__defineGetter__('originalPort', function () {
                return port;
            });
        }
    },
    override : {
        ipv4 : function (c, address, port) {
            address = formatAddressIPV4(address);
            c.__defineGetter__('remoteAddress', function () {
                return address;
            });
            c.__defineGetter__('originalPort', function () { // @TODO Check this
                return port;
            });
        },
        ipv6 : function (c, address, port) {
            address = formatAddressIPV6(address);
            c.__defineGetter__('remoteAddress', function () {
                
                return address;
            });
            c.__defineGetter__('originalPort', function () { // @TODO Check this
                return port;
            });
        }
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
                    var address = [],
                        i,
                        port;
                    for (i = 1; i < 4; i = i + 1) {
                        address.push(buffer.readUInt8(i));
                    }
                    port = buffer.readUInt16(5);
                    manage.ipv4(c, address, port);
                }());
                break;
            case 1:
                (function () {
                    // @TODO Add length Error Handling
                    var address = [],
                        i,
                        port;
                    for (i = 1; i < 9; i = i + 1) {
                        address.push(buffer.readUInt8(i));
                    }
                    port = buffer.readUInt16(9);
                    manage.ipv6(c, address, port);
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