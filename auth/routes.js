const { Router } = require('express');
const { custom } = require('openid-client');
const AuthCookie = require('./auth-cookie');

const router = Router();

router.get('/auth/login', (req, res) => {
  const authUrl = req.app.authClient.authorizationUrl({
    scope: 'openid email profile'
  });

  console.log('Redirecting to', authUrl);
  res.redirect(authUrl);
})

router.get('/auth/callback', async (req, res, next) => {
  console.log('/auth/callback', req.url);
  try {
    const client = req.app.authClient;
    client[custom.http_options] = (url, options) => {
      console.log('>>>>>>> Request to Google >>>>>>>', url.href, {options});
      return { timeout: 0 };
    }

    const params = client.callbackParams(req);
    const tokenSet = await client.callback( // POST call to token endpoint
      `http://localhost:3000/auth/callback`, params, {}
    );

    // Fetches the OIDC userinfo response with the provided Access Token.
    const user = await client.userinfo(tokenSet); // GET call to userinfo endpoint
    AuthCookie.set(res, {tokenSet, user});
    res.redirect('/private');
  } catch(e) {
    console.log('Something went wrong', e);
    return next(e);
  }
})

router.get('/auth/logout', async (req, res, next) => {
  const client = req.app.authClient;
  const tokenSet = req.session.tokenSet;

  try {
    await client.revoke(tokenSet.access_token);
  } catch(e) {
    console.error('error revoking access_token', e);
  }
  res.clearCookie('auth');

  res.redirect('/');
});

module.exports = router;