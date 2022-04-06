/*jslint node: true, nomen: true, es5: true */
/**
 * Developed By:
 * - Ben Timby (GitHub - btimby) ben.timby.com
 * - Carlo Bernaschina (GitHub - B3rn475) www.bernaschina.com
 *
 * Distributed under the MIT Licence
 */
"use strict";

const MAGIC = '\r\n\r\n\x00\r\nQUIT\n';
const TLV_TYPES = {
    0x01: 'ALPN',
    0x02: 'AUTHORITY',
    0x03: 'CRC32C',
    0x04: 'NOOP',
    0x05: 'UNIQUE_ID',
    0x020: 'SSL',
    0x021: 'SSL_VERSION',
    0x022: 'SSL_CN',
    0x023: 'SSL_CIPHER',
    0x024: 'SSL_SIG_ALG',
    0x025: 'SSL_KEY_ALG',
    0x030: 'NETNS',
}

function decodeV4Address(buf, offset) {
  let i;
  const address = new Array(4);
  for (i = 0; i < 4; i++) {
    address[i] = Number(buf[offset + i]).toString();
  }

  return address.join('.');
}

function decodeV6Address(buf, offset) {
  let i;
  const address = new Array(8);
  for (i = 0; i < 8; i++) {
    address[i] = Number(buf.readUInt16BE(offset + i * 2, true)).toString(16);
  }

  return address.join(':').replace(/:(?:0:)+/, '::');
}

function parseTLV(buffer, offset) {
  const type = buffer.readUInt8(offset);
  const length = buffer.readUInt16BE(offset++);
  offset += 2;
  const value = buffer.subarray(offset, offset + length).toString();
  const typeName = TLV_TYPES[type];
  if (!typeName) {
    throw new Error(`Invalid TLV type: ${type.toString('hex')}`);
  }
  return { type: typeName, length: length + 3, value };
}

function parseProxyData(header, buffer) {
  const fields = {
    tlv: [],
  };

  let offset = 0;
  if (header.family === 0x00) {
    // No address information.
    fields.remoteFamily = 'Unspecified';
    fields.remoteAddress = null;
    fields.localAddress = null;
    fields.remotePort = null;
    fields.localPort = null;
    offset += 2;
  } else if (header.family === 0x01) {
    fields.remoteFamily = 'IPv4';
    fields.remoteAddress = decodeV4Address(buffer, offset);
    fields.localAddress = decodeV4Address(buffer, offset += 4);
    fields.remotePort = buffer.readUInt16BE(offset += 4);
    fields.localPort = buffer.readUInt16BE(offset += 2);
    offset += 2;
  } else if (header.family === 0x02) {
    fields.remoteFamily = 'IPv6';
    fields.remoteAddress = decodeV6Address(buffer, offset);
    fields.localAddress = decodeV6Address(buffer, offset += 16);
    fields.remotePort = buffer.readUInt16BE(offset += 16);
    fields.localPort = buffer.readUInt16BE(offset += 2);
    offset += 2;
  } else if (header.family === 0x03) {
    fields.remoteFamily = 'UNIX';
    fields.remoteAddress = buffer.read(offset, offset += 108).toString('binary');
    fields.localAddress = buffer.read(offset, offset += 108).toString('binary');
    fields.remotePort = null;
    fields.localPort = null;
    offset += 2;
  } else {
    throw new Error(`Invalid protocol family: ${header.family.toString('hex')}`);
  }

  while (offset < header.length) {
    const record = parseTLV(buffer, offset);
    fields.tlv.push(record);
    offset += record.length;
  }

  fields.length = offset;

  return fields;
}

function parseProxyHeader(buffer) {
  const fields = {};

  // check magic:
  const preamble = buffer.subarray(0, 12);
  if (preamble.toString() !== MAGIC) {
    throw new Error(`Invalid proxy protocol preamble: ${preable.toString('hex')}`);
  }

  const famProt = buffer.readUInt8(13);
  fields.length = buffer.readUInt16BE(14);
  fields.family = (famProt & 0xf0) >> 4;
  fields.protocol = famProt & 0x0f;

  return fields;
}

function createParser(socket, connected, headerError) {
    var buffer = '';
    var header = null;

    return function () {
        var char;

        try {
            while (true) {
                char = socket.read(1);
                if (char === null) {
                    return;
                }
                buffer += char.toString('binary');
                if (header === null && buffer.length === 16) {
                    header = parseProxyHeader(Buffer.from(buffer, 'binary'));
                    buffer = '';
                }
                if (header && buffer.length === header.length) {
                    break;
                }
            }
            connected(parseProxyData(header, Buffer.from(buffer, 'binary')));
        } catch (e) {
            headerError(e);
        }
    }
}

module.exports = createParser;
