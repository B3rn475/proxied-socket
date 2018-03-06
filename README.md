proxied-socket
---

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
    format: 'default',
});
server.listen(1234);

```

Without __proxied-socket__ the server would always log the same address.
With __proxied-socket__ the server instead logs the real address of the remote client.


Options
---

 - `method` - Controls the way that the "real" client address is retrieve. With the `"attach"` method, the address will be located at `client.originalAddress`. With the `'replace'` method, `client.remoteAddress` is overidden.
 - `format` - Conrols the expected format of the client IP header. `'default'` is the internal format, `'haproxy'` is the HAProxy PROXY protocol V1.

More information about HAProxy's PROXY protocol can be found below:

https://www.haproxy.org/download/1.8/doc/proxy-protocol.txt
