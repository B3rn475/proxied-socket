/*jslint node: true, nomen: true, es5: true */
/**
 * Developed By Carlo Bernaschina (GitHub - B3rn475)
 * www.bernaschina.com
 *
 * Distributed under the MIT Licence
 */
"use strict";

function override(proxy, socket) {
    var remoteFamily = proxy.remoteFamily,
        remoteAddress = proxy.remoteAddress,
        remotePort = proxy.remotePort,
        localAddress = proxy.localAddress,
        localPort = proxy.localPort;
    socket.__defineGetter__('maskedRemoteFamily', socket.__lookupGetter__('remoteFamily'));
    socket.__defineGetter__('maskedRemoteAddress', socket.__lookupGetter__('remoteAddress'));
    socket.__defineGetter__('maskedRemotePort', socket.__lookupGetter__('remotePort'));
    socket.__defineGetter__('maskedLocalAddress', socket.__lookupGetter__('localAddress'));
    socket.__defineGetter__('maskedLocalPort', socket.__lookupGetter__('localPort'));
    socket.__defineGetter__('remoteFamily', function () {
        return remoteFamily;
    });
    socket.__defineGetter__('remoteAddress', function () {
        return remoteAddress;
    });
    socket.__defineGetter__('remotePort', function () {
        return remotePort;
    });
    socket.__defineGetter__('localAddress', function () {
        return localAddress;
    });
    socket.__defineGetter__('localPort', function () {
        return localPort;
    });
    socket.__defineGetter__('proxyHeader', function () {
        return proxy;
    });
}

module.exports = override;
