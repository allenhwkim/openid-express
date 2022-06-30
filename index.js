const express = require('express');
require('dotenv').config();
const mustacheExpress = require('mustache-express');
const cookieParser = require('cookie-parser');

console.log(`
  USING
  HOST: ${process.env.HOST}:${process.env.PORT},
  GOOGLE_CLIENT_ID: ${process.env.GOOGLE_CLIENT_ID},
  GOOGLE_CLIENT_SECRET: ${process.env.GOOGLE_CLIENT_SECRET}
`)

const app = express();
const { initialize, session } = require('./auth/middleware');
const authRoutes = require('./auth/routes');

// View engine
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// Middlewares
app.use(cookieParser());
app.use(initialize); // initialise the Issuer and the Client
app.use(session); // Deals with the user session 
app.use(authRoutes); // Addds OAuth/OpenId routes

app.get('/', (req, res) => {
  res.render('index');
})

app.get('/private', (req, res) => {
  if (!req.session) {
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