const { TokenSet } = require("openid-client");

const AuthCookie = {
  get(req) {
    const cookieValue = req.cookies.auth;
    if (cookieValue) {
      // const raw = JSON.parse(Buffer.from(value, 'base64').toString('utf8'));
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