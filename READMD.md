# OpenID + Google

Flow
```
============                 ================               ==============
 Browser                      NodeJS+Express                 Google
============                 ================               ==============
  
  GET /auth/login  
  --------------------------------->

   302 Redirect 
   https://accounts.google.com/o/oauth2/v2/auth?
   client_id=x&scope=x&redirect_uri=x...
  <----------------------------------
   GET https://accounts.google.com/o/oauth2/v2/auth?clent_id=x&...
  ------------------------------------------------------------------>

   200 ok login.html
  <------------------------------------------------------------------
  
   POST login
  -000--------------------------------------------------------------->

   302 Redirect
   /auth/callback?code=x&state=x
  <-------------------------------------------------------------------
   GET /auth/callback?code=x&state=x 
  
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
  ---------------------------------->
   200 ok
   cookie: session=x
  <---------------------------------
```

1. Google Developers Console.
  

2. click "Credentials"
   CREATE CREDENTIALS - OAuth Client ID - Web Application
  
  Client Id
  1015354952364-qfma5fkgse257kksbj1ut2sv37jk5fp3.apps.googleusercontent.com

  Client Secret
  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

Error 400: redirect_uri_mismatch
Authorized redirect URIs
  http://localhost:3000/auth/callback