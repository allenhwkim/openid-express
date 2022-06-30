const { TokenSet } = require('openid-client');

function serialize(data) {
  return JSON.stringify(data);
  // return Buffer.from(JSON.stringify(data)).toString('base64');
}

function deserialize(value) {
  // const raw = JSON.parse(Buffer.from(value, 'base64').toString('utf8'));
  const raw = JSON.parse(value);
  return {...raw, tokenSet: new TokenSet(raw.tokenSet)}
}

module.exports = {
  serialize,
  deserialize
};
