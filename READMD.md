# OpenID + Google

## To get Google Oauth2 credentials, 

 1. Go to Google Developers Console.
    https://console.cloud.google.com/apis/dashboard
   
 2. Click "Credentials" on left-slide navigation
 
 3. Then, Click "+ CREATE CREDENTIALS" 
    From Dropdown, click "OAuth Client ID"
 
 4. Chose "Web Application" form "Application type *"
    Enter "Web client 1" as "Name *"
 
 5. On section, "Authorized redirect URIs", click "+ Add URI"
    Enter "http://localhost:3000/auth/callback" as the value of "URIs 1 *"
 
 6. Click "CREATE"
 
 7. DONE, Copy the "Client ID" and "Client Secret"

### Issuer Example
  ```
  const googleIssuer = new Issuer({
    issuer: 'https://accounts.google.com',
    authorization_endpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    token_endpoint: 'https://www.googleapis.com/oauth2/v4/token',
    userinfo_endpoint: 'https://www.googleapis.com/oauth2/v3/userinfo',
    jwks_uri: 'https://www.googleapis.com/oauth2/v3/certs',
  }); // => Issuer
  ```

### authorization_endpoint: 

  The authorization endpoint is used to interact with the resource
  owner and obtain an authorization grant. 

  ```
  e.g. https://accounts.google.com/o/oauth2/v2/auth?
    client_id=xxxx
    &scope=openid%20email%20profile
    &response_type=code
    &redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback
  ```

  When it's successful, it redirects to the redirect_uri with a code.
  ```
   e.g, GET http://localhost:3000/auth/callback?
     code=CODE_RECEIVED_WITH_REDIRECT_URI
     &scope=xxxxxx
     &authuser=0
     &prompt=consent
  ```

### token_endpoint:

  It returns access tokens, ID tokens, and refresh tokens depending on the request parameters. 
  ```
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
  ```

### userinfo_endpoint:

  It returns consented claims, or assertions, about the logged in end-user. 
  The claims are typically packaged in a JSON object where the sub member denotes the subject (end-user) identifier. 
  Clients can alternatively be registered to receive the claims in a JWT.

  ```
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

## Flow Diagram
```
    ============                 ================               ==============
     Browser                      NodeJS+Express                 Google
    ============                 ================               ==============
      
      GET /auth/login  
      -------------------------------->
    
       302 Redirect 
       https://accounts.google.com/o/oauth2/v2/auth?
       client_id=x&scope=x&redirect_uri=x...
      <----------------------------------
       GET https://accounts.google.com/o/oauth2/v2/auth?clent_id=x&...
      ------------------------------------------------------------------>
    
       200 ok login.html
      <------------------------------------------------------------------
      
       POST login
      ------------------------------------------------------------------->
       302 Redirect /auth/callback?code=x&state=x
      <-------------------------------------------------------------------
    
    
       GET /auth/callback?code=x&state=x 
      --------------------------------->
      
                                         POST https://oauth2.google.com/token
                                         code / client_id / client_secret /
                                         redirect_uri / grant_type / scope
                                        --------------------------------->
                                         200 ok
                                         access_token / id_token
                                        <----------------------------------
    
       202 ok
       Set-cookie: session=x
      <---------------------------------
    
       GET /private
       cookie: session=x
      --------------------------------->
       200 ok
       cookie: session=x
      <---------------------------------