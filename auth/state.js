const { generators } = require('openid-client');
const { fromBase64, toBase64 } = require('./encoding');

const STATE_COOKIE = 'state';

function serializeAuthState(state) {
  return toBase64({...state, bytes: generators.state()});
}

function deserializeAuthState(value) {
  return fromBase64(value);
}

function setAuthStateCookie(res, state) {
  res.cookie(STATE_COOKIE, state, {
    maxAge: 15 * 60 * 1000,
    httpOnly: true, // no access from js
    sameSite: false, // no cross-site
  });
}

function getAuthStateCookie(req) {
  return req.cookies[STATE_COOKIE];
}

module.exports = {
  STATE_COOKIE,
  serializeAuthState,
  deserializeAuthState,
  setAuthStateCookie,
  getAuthStateCookie
}