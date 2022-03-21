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
var proxyV2 = require('./proxy-v2');

exports.proxiedSocket = proxiedSocket;
exports.haproxy = haproxy;
exports.proxyV2 = proxyV2;
