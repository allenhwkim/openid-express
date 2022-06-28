const SESSION_COOKIE = 'auth';

function setSessionCookie(res, session) {
  res.cookie('auth', session, {
    httpOnly: true,
    expires: new Date(Date.now() + 9000000),
  })
}

function getSessionCookie(req) {
  return req.cookies[SESSION_COOKIE];
}

function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE);
}

module.exports = {
  setSessionCookie,
  getSessionCookie,
  clearSessionCookie,
};