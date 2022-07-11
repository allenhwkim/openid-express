const { TokenSet } = require("openid-client");

// FYI, Base64 encoding / decoding
// decode : JSON.parse(Buffer.from(value, 'base64').toString('utf8')); 
// encode : Buffer.from(JSON.stringify(data)).toString('base64');
const AuthCookie = {
  get(req) {
    const cookieValue = req.cookies.auth;
    if (cookieValue) {
      const auth = JSON.parse(cookieValue);
      auth.tokenSet = new TokenSet(auth.tokenSet);
      return auth;
    } else {
      return null
    }
  },

  set(res, value) {
    const cookieValue = JSON.stringify(value);
    res.cookie('auth', cookieValue, {
      httpOnly: true,
      expires: new Date(Date.now() + 9000000),
    })
  }
}

module.exports = AuthCookie;