function parseHeader(header) {
    var parts = header.split(' ')[2];
    if (parts[0] !== 'PROXY') {
        throw new Error('PROXY line missing, is haproxy is present?');
    }
    return parts[2];
}

function createParser(socket, connected, headerError) {
    var buffer = '';

    return function () {
        var char;

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
        connected(parseHeader(buffer));
    };
}

module.exports = createParser;
