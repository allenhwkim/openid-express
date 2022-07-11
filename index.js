const express = require('express');
const mustacheExpress = require('mustache-express');
const cookieParser = require('cookie-parser');

require('dotenv').config(); // read process.env from `.env` file
console.log(`
  HOST: ${process.env.HOST}:${process.env.PORT},
  GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID},
  GOOGLE_CLIENT_SECRET: ${process.env.GOOGLE_CLIENT_SECRET}
`)

const app = express();
const session = require('./auth/session');
const authRoutes = require('./auth/routes');

// View engine
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// Middlewares
app.use(cookieParser());
app.use(session); // initialise oauth2 issuer/client, and deals with the user session 
app.use(authRoutes); // Adds OAuth/OpenId routes

app.get('/', (req, res) => {
  res.render('index');
})

app.get('/private', (req, res, next) => {
  if (!req.session) { // set by session middleware when 'auth' cookie is not expired and valid
    return next(new Error('unauthorized'));
  }

  const claims = req.session.tokenSet.claims();

  res.render('private', {
    email: claims.email,
    picture: claims.picture,
    name: claims.name
  })
})

app.listen(3000, () => console.log('Listening on port 3000'));