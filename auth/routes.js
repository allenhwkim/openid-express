const { Router } = require('express');
const { setSessionCookie, clearSessionCookie } = require('./cookie');
const { serialize } = require('./session');
const { getDomain } = require('./middleware');
const {
  serializeAuthState,
  deserializeAuthState,
  getAuthStateCookie,
  setAuthStateCookie
} = require('./state');

function authRoutesMiddleware() {
  const router = Router();

  router.get('/auth/login', (req, res) => {
    const backToPath = req.query.backTo || '/private';
    const state = serializeAuthState({ backToPath });

    const authUrl = req.app.authClient.authorizationUrl({
      scope: 'openid email profile',
      state,
    });

    console.log('Setting state cookie', state);
    setAuthStateCookie(res, state);

    console.log('Redirecting to', authUrl);
    res.redirect(authUrl);
  })

  router.get('/auth/callback', async (req, res, next) => {
    console.log('/auth/callback');
    try {
      console.log('req.cookies', req.cookies);
      const state = getAuthStateCookie(req);
      console.log('state', state);
      const { backToPath } = deserializeAuthState(state);
      console.log('state', backToPath);
      const client = req.app.authClient;

      const params = client.callbackParams(req);
      const tokenSet = await client.callback(
        `${getDomain()}/auth/callback`, params, {state}
      );
      const user = await client.userinfo(tokenSet);

      const sessionCookie = serialize({ tokenSet, user });
      setSessionCookie(res, sessionCookie);

      res.redirect(backToPath);
    } catch(e) {
      console.log('Something went wrong', e);
      return next(e);
    }
  })

  router.get('/auth/logout', async (req, res, next) => {
    const client = req.app.authClient;
    const tokenSet = req.session.tokenSet;

    try {
      await client.revoke(tokenSet.accessToken);
    } catch(e) {
      console.error('error revoking access_token', e);
    }
    clearSessionCookie(res);

    res.redirect('/');
  });

  router.get('/auth/logout/sso', async (req, res, next) => {
    const client = req.app.authClient;
    const tokenSet = req.session.tokenSet;

    clearSessionCookie(res);

    const endSessionUrl = client.endSessionUrl();
    res.redirect(endSessionUrl);
  })

  return router;
}

module.exports = authRoutesMiddleware;