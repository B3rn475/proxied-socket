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
            var parts = buffer.split(' ');
            var fields = {
                proto: parts[1],
                clientIp: parts[2],
                serverIp: parts[3],
                clientPort: parseInt(parts[4]),
                serverPort: parseInt(parts[5]),
            };
        // Store details from HAProxy.
            socket.__defineGetter__('proxyLine', function () {
                return fields;
            });
            connected(clientIp);
        } catch (e) {
            headerError(e);
        }
    };
}

module.exports = createParser;
