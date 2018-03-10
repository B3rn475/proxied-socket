/*jslint node: true, nomen: true, es5: true */
/**
 * Developed By Carlo Bernaschina (GitHub - B3rn475)
 * www.bernaschina.com
 *
 * Distributed under the MIT Licence
 */
"use strict";

function attach(proxy, socket) {
    var remoteFamily = proxy.remoteFamily,
        remoteAddress = proxy.remoteAddress,
        remotePort = proxy.remotePort,
        localAddress = proxy.localAddress,
        localPort = proxy.localPort;
    socket.__defineGetter__('originalRemoteFamily', function () {
        return remoteFamily;
    });
    socket.__defineGetter__('originalRemoteAddress', function () {
        return remoteAddress;
    });
    socket.__defineGetter__('originalRemotePort', function () {
        return remotePort;
    });
    socket.__defineGetter__('originalLocalAddress', function () {
        return localAddress;
    });
    socket.__defineGetter__('originalLocalPort', function () {
        return localPort;
    });
    socket.__defineGetter__('proxyHeader', function () {
        return proxy;
    });
}

module.exports = attach;
