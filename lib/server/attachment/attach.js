/*jslint node: true, nomen: true, es5: true */
/**
 * Developed By Carlo Bernaschina (GitHub - B3rn475)
 * www.bernaschina.com
 *
 * Distributed under the MIT Licence
 */
"use strict";

function attach(socket, address) {
    socket.__defineGetter__('originalAddress', function () {
        return address;
    });
}

module.exports = attach;
