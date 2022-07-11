const { Router } = require('express');
const { custom, generators } = require('openid-client');
const AuthCookie = require('./auth-cookie');

const router = Router();

// for PKCE, uncomment code_verifier codes
router.get('/auth/login', (req, res) => {
  // const code_verifier = generators.codeVerifier();s
  // AuthCookie.set(res, code_verifier);
  // console.log({code_verifier});
  // const code_challenge = generators.codeChallenge(code_verifier);
  const authUrl = req.app.authClient.authorizationUrl({
    scope: 'openid email profile',
    // code_challenge,
    // code_challenge_method: 'S256'
  });

  console.log('Redirecting to', authUrl);
  res.redirect(authUrl);
})

router.get('/auth/callback', async (req, res, next) => {
  console.log('/auth/callback', req.url);
  try {
    const client = req.app.authClient;

    // const code_verifier = AuthCookie.get(req);
    // console.log({code_verifier});
    const params = client.callbackParams(req);
    const tokenSet = await client.callback( // POST call to token endpoint
      `http://localhost:3000/auth/callback`, params, {}
      // `http://localhost:3000/auth/callback`, params, {code_verifier}
    );

    // Fetches the OIDC userinfo response with the provided Access Token.
    console.log('received and validated tokens %j', tokenSet);
    console.log('validated ID Token claims %j', tokenSet.claims());
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