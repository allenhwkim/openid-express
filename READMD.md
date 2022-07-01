# OpenID + Google

## To get Google client id and client secret
1. Google Developers Console.
  
2. click "Credentials"
   CREATE CREDENTIALS - OAuth Client ID - Web Application
   Also Add Authorized redirect URIs as 'http://localhost:3000/auth/callback'
  
Issuer Example
```
  const googleIssuer = new Issuer({
    issuer: 'https://accounts.google.com',
    authorization_endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    token_endpoint: 'https://www.googleapis.com/oauth2/v4/token',
    userinfo_endpoint: 'https://www.googleapis.com/oauth2/v3/userinfo',
    jwks_uri: 'https://www.googleapis.com/oauth2/v3/certs',
  }); // => Issuer
```

authorization_endpoint: 
  The authorization endpoint is used to interact with the resource
  owner and obtain an authorization grant. 

  e.g. https://accounts.google.com/o/oauth2/v2/auth?
    client_id=xxxx
    &scope=openid%20email%20profile
    &response_type=code
    &redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback

  When it's successful, it redirects to the redirect_uri with a code.
   e.g, GET http://localhost:3000/auth/callback?
     code=CODE_RECEIVED_WITH_REDIRECT_URI
     &scope=xxxxxx
     &authuser=0
     &prompt=consent
  
  token_endpoint:
    xxxxxxxxxxxxxxxxxx

    e.g. POST https://oauth2.googleapis.com/token
      Payload: 
        grant_type: 'authorization_code'
        code: CODE_RECEIVED_WITH_REDIRECT_URI
      Headers
        Accept: 'application/json'
        Authorization: 'Basic BASE64(CLIENT_ID:CLIENT_SECRET)'

      Response: 
      {
        access_token: ACCESS_TOKEN_FROM_TOKEN_ENDPOINT,
        expires_at: 1656695403,
        scope: 'userinfo.email openid userinfo.profile',
        token_type: 'Bearer',
        id_token: A JWT Token, which is BASE64(header.payload.signature)
      }

  userinfo_endpoint:

    e.g. GET https://openidconnect.googleapis.com/v1/userinfo?
      Headers 
        Accept: 'application/json'
        Authorization: 'Bearer ACCESS_TOKEN_FROM_TOKEN_ENDPOINT'

    Response:
      user: {
        sub: '115268371356946173373',
        name: 'Allen Kim',
        picture: 'https://lh3.googleusercontent.com/a-/AOh14GhvhxwCndRw2VJkl5oqMi6k47oRqlyAw040t-_j=s96-c',
        email: 'allenhwkim@gmail.com'
      }


```
    ============                 ================               ==============
     Browser                      NodeJS+Express                 Google
    ============                 ================               ==============
      
      GET /auth/login  
      -------------------------------->
       302 https://accounts.google.com/o/oauth2/v2/auth?
       client_id=x&scope=x&redirect_uri=x...
      <----------------------------------
      --GET------------------------------------------------------------->
       200 login.html
      <------------------------------------------------------------------
      

       username/password. Then POST login
      ------------------------------------------------------------------->
       302 Redirect /auth/callback?code=x&scope=x&prompt=x&authuser=x
      <------------------------------------------------------------------
      --GET---------------------------->
      

                                         POST https://oauth2.google.com/token
                                         code + client_id + client_secret 
                                        --------------------------------->
                                         200 ok access_token / id_token(a JWT)
                                        <----------------------------------
    

                                         GET https://oauth2.google.com/userinfo
                                         access_token
                                        --------------------------------->
                                         200 {user}
                                        <----------------------------------


       302 /private
       Set-cookie: auth={user, tokenSet}
      <---------------------------------
      --GET---------------------------->
        200 cookie: auth={user, tokenSet}
      <---------------------------------
```