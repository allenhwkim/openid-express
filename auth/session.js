const { TokenSet } = require('openid-client');
const { fromBase64, toBase64 } = require('./encoding');

function serialize(session) {
  return toBase64(session);
}

function deserialize(value) {
  const raw = fromBase64(value);
  return {...raw, tokenSet: new TokenSet(raw.tokenSet)}
}

module.exports = {
  serialize,
  deserialize
};
