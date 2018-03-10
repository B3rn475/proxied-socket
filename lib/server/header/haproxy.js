function parseHeader(header) {
    var parts = header.split(' ');
    if (parts[0] !== 'PROXY') {
        throw new Error('PROXY line missing, is haproxy present?');
    }
    return parts[2];
}

function createParser(socket, connected, headerError) {
    var buffer = '';

    return function () {
        var char;

        try {
            while (true) {
                if ((char = socket.read(1)) === null) {
                    return;
                }
                char = char.toString('ascii');
                if (char === '\n') {
                    break;
                }
                buffer += char;
            }
            // Validate the buffer.
            var clientIp = parseHeader(buffer);
            // Store additonal details for HAProxy.
            socket.__defineGetter__('proxyLine', function () {
                var parts = buffer.split(' ');
                var obj = {
                    clientIp: parts[2],
                    serverIp: parts[3],
                    clientPort: parts[4],
                    serverPort: parts[5],
                };
                console.log(obj);
                return obj;
            });
            connected(clientIp);
        } catch (e) {
            headerError(e);
        }
    };
}

module.exports = createParser;
