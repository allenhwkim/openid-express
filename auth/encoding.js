function fromBase64(value) {
  return JSON.parse(Buffer.from(value, 'base64').toString('utf8'));
}

function toBase64(data) {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

module.exports = {
  fromBase64,
  toBase64
}