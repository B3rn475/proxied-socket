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

var server = net.Server(function (client) {
    var socket = net.connect(options, forwarded);
    ps.Client(socket, client.remoteAddress); // you just need this
    client.pipe(socket).pipe(client);
});
server.listen(80);

```

Server
---
The Server side API allows to intercept the header present at the beginning of every connection and to attach the IP address present in it to relative socket.

The are two methods:

 - __attach__ that attaches the address as the property __originalAddress__
 - __override__ (default) that moves the original __remoteAddress__ to the property __maskedAddress__ and attaches the address present in the header to the property __remoteAddress__

```js
var ps = require('proxied-socket'),
    net = require('net');

var server = ps.Server(net.Server(function (client) { // you just need to wrap your server
    console.log(client.remoteAddress);
}),
{
    method: 'override'
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
