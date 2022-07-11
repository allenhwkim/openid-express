const { TokenSet } = require("openid-client");

// FYI, Base64 encoding / decoding
// decode : JSON.parse(Buffer.from(value, 'base64').toString('utf8')); 
// encode : Buffer.from(JSON.stringify(data)).toString('base64');
const AuthCookie = {
  get(req) {
    if (req.cookies.auth) {
      const auth = JSON.parse(req.cookies.auth);
      auth.tokenSet = new TokenSet(auth.tokenSet);
      return auth;
    } 
  },

  set(res, value) {
    res.cookie('auth', JSON.stringify(value), {
      httpOnly: true,
      expires: new Date(Date.now() + 9000000),
    })
  }
}

module.exports = AuthCookie;