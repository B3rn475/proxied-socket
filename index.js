/*jslint node: true, nomen: true, es5: true */
/**
 * Developed By Carlo Bernaschina (GitHub - B3rn475)
 * www.bernaschina.com
 *
 * Distributed under the MIT Licence
 */
"use strict";

var wrapServer = require('./lib/server'),
    sendHeader = require('./lib/client');

module.exports.wrapServer = wrapServer;
module.exports.sendHeader = sendHeader;
