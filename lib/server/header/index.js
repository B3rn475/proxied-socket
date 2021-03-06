/*jslint node: true, nomen: true, es5: true */
/**
 * Developed By Carlo Bernaschina (GitHub - B3rn475)
 * www.bernaschina.com
 *
 * Distributed under the MIT Licence
 */
"use strict";

var proxiedSocket = require('./proxied-socket');
var haproxy = require('./haproxy');

exports.proxiedSocket = proxiedSocket;
exports.haproxy = haproxy;
