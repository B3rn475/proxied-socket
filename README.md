proxied-socket
==============

This is a simple Server and Client wrapper for standard nodejs Socket Servers and Clients that allow to proxy requests in a transparent way.

Proxies are meant to mask the Server IP address to the Client that can just see the Proxy IP address.
Normal TCP level proxies have a big issue, they do even mask the Client IP address to the Server that can just see the Proxy IP address.

proxied-socket is meant to solve this issue.
It is composed of two parts the client and the server.

Client
---
At Client side (the proxy) before sending any data to the server you can use the API provided to add an header that contains the ip address of the remote Client.

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
At the Server side you can wrap your listening Server (TCP, UnixSocket, TLS, HTTP or HTTPS) with the API provided.
At each connection the API decodes the header and attaches the address to the socket.

```js
var ps = require('proxied-socket'),
    net = require('net');

var server = ps.Server(net.Server(function (client) { // you just need to wrap your server
    console.log(client.remoteAddress);
}),
{
    method: 'override'
});
server.listen(80);

```

Without proxied-socket the server would always log the same address.
With proxied-socket the server instead logs the real address of the remote client.

The are two methods:
    
 - __attach__ that attaches the address present in the header as the property __originalAddress__
 - __override__ (default) that moves the original __remoteAddress__ to the property __maskedAddress__ and attaches the address present in the header to the property __remoteAddress__