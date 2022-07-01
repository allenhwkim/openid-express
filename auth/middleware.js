const { Issuer, custom } = require('openid-client');
const { deserialize, serialize } = require('./session');

async function initialize(req, res, next) {
  if (req.app.authIssuer) return next();
  
  // Discover Google's OpenID Connect provider
  const googleIssuer = await Issuer.discover('https://accounts.google.com');

  console.log('OpenId issuer created:', googleIssuer.issuer);

  const client = new googleIssuer.Client({
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uris: [`http://localhost:3000/auth/callback`],
    response_types: ['code']
  });

  req.app.authIssuer = googleIssuer;
  req.app.authClient = client;

  next();
}

async function session(req, res, next) {
  const sessionCookie = req.cookies['auth'];;
  if (!sessionCookie) return next();  // no session cookie, do nothing

  // get cookie and parse it
  const client = req.app.authClient;
  client[custom.http_options] = (url, options) => {
    console.log('>>>>>>> Request to Google >>>>>>>', url.href, {options});
    return { timeout: 0 };
  }
  const session = deserialize(sessionCookie);

  // refresh token if needed
  if (session.tokenSet.expired()) {
    try {
      const refreshedTokenSet = await client.refersh(session.tokenSet);
      session.tokenSet = refreshedTokenSet;
      res.cookie('auth', serialize(session), {
        httpOnly: true,
        expires: new Date(Date.now() + 9000000),
      })
    } catch(err) { // logout completely
      res.clearCookie('auth')
      return next();
    }
  }

  // cookie is valid. Now validate the token
  const validate = req.app.authClient?.validateIdToken;
  try {
    console.log('validating token', session.tokenSet);
    await validate.call(client, session.tokenSet);
  } catch(err) {
    console.error(err);
    console.log('bad token signature found in auth cookie');
    return next(new Error("Bad Token in Auth Cookie!"));
  }

  req.session = session;

  next();
}

module.exports = {
  initialize,
  session
}