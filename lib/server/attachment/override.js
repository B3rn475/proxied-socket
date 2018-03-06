/*jslint node: true, nomen: true, es5: true */
/**
 * Developed By Carlo Bernaschina (GitHub - B3rn475)
 * www.bernaschina.com
 *
 * Distributed under the MIT Licence
 */
"use strict";

function override(socket, address) {
    var getter = socket.__lookupGetter__('remoteAddress');
    socket.__defineGetter__('remoteAddress', function () {
        return address;
    });
    socket.__defineGetter__('maskedAddress', getter);
}

module.exports = override;
