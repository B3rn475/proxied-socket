/*jslint node: true, nomen: true, es5: true */
/**
 * Developed By Carlo Bernaschina (GitHub - B3rn475)
 * www.bernaschina.com
 *
 * Distributed under the MIT Licence
 */
"use strict";

var Server = require('./lib/server'),
    Client = require('./lib/client');

module.exports.Server = Server;
module.exports.Client = Client;

module.exports.wrapServer = Server;
module.exports.wrapClient = Client;
