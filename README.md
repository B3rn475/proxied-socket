proxied-socket
---

[![NPM Version][npm-image]][npm-url]
[![Build][travis-image]][travis-url]
[![Build][appveyor-image]][appveyor-url]
[![Test Coverage][coveralls-image]][coveralls-url]
[![MIT licensed][license-image]][license-url]

Proxies are commonly used to keep undisclosed the Server original IP address to the clients.
Normal TCP level proxies have a big issue, they do even mask the Client IP address to the Server that just sees the Proxy IP address.

__proxied-socket__ is meant to solve this issue.
To do so, __proxied-socket__ provides unobtrusive IP address forwarding support for Node.js sockets.


It is composed of two components the __Client__ and the __Server__.

Client
---
The Client side API allows to add an header that contains an IP address.
Proxies can use it to forward the remote Client IP address.

```js
var ps = require('proxied-socket'),
    net = require('net');

var remote = {port: 1234};

var server = net.wrapServer(function (source) {
    var target = net.connect(options, forwarded);
    ps.sendHeader(source, target); // you just need this
    source.pipe(target).pipe(source);
});
server.listen(80);

```

Server
---
The Server side API allows to intercept the header present at the beginning of every connection and to attach the IP address present in it to relative socket.

The are two methods:

 - __attach__ which attaches the original socket information as the properties __originalRemoteFamily__, __originalRemoteAddress__, __originalRemotePort__, __originalLocalAddress__ and __originalLocalPort__
 - __override__ (default) which moves the original socket information __remoteFamily__, __remoteAddress__, __remotePort__, __localAddress__ and __remotePorts__ to the respective property __maskedRemoteFamily__, __maskedRemoteAddress__, ... while replacing them with the information obtained from the header

And two supported formats:

 - __default__ is compatible with the `proxied-socket.Client`. If you are writing
   both the proxy and server, this is the format to use. It is also the default
   format.
 - __haproxy__ is compatible with the HAProxy PROXY protocol V1. If you are
   writing a server that will be load balanced by HAProxy, this is the format
   you will want. More information about the PROXY protcol can be found at the
   following link. https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt

In both cases the full parsed header is attached to the __proxy__ property of the socket.

```js
var ps = require('proxied-socket'),
    net = require('net');

var server = ps.wrapServer(net.Server(function (client) { // you just need to wrap your server
    console.log(client.remoteAddress);
}),
{
    method: 'override'
    format: 'default',
});
server.listen(1234);

```

Without __proxied-socket__ the server would always log the same address.
With __proxied-socket__ the server instead logs the real address of the remote client.

[npm-image]: https://img.shields.io/npm/v/proxied-socket.svg
[npm-url]: https://npmjs.org/package/proxied-socket
[travis-image]: https://img.shields.io/travis/B3rn475/proxied-socket/master.svg
[travis-url]: https://travis-ci.org/B3rn475/proxied-socket
[appveyor-image]: https://ci.appveyor.com/api/projects/status/github/B3rn475/proxied-socket?svg=true
[appveyor-url]: https://ci.appveyor.com/project/B3rn475/proxied-socket
[coveralls-image]: https://img.shields.io/coveralls/B3rn475/proxied-socket/master.svg
[coveralls-url]: https://coveralls.io/r/B3rn475/proxied-socket?branch=master
[license-image]: https://img.shields.io/badge/license-MIT-blue.svg
[license-url]: https://raw.githubusercontent.com/B3rn475/almostjs-core/master/LICENSE
