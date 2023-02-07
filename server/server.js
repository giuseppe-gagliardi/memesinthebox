const express = require('express');
const dao = require('./dao');
const morgan = require('morgan');
const session = require('express-session'); // session middleware

const { check, validationResult } = require('express-validator');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userDao = require('./dao-user');



// initialize and configure passport
passport.use(new LocalStrategy((username, password, done) => {
  userDao.getUser(username, password).then(user => {
    if (user)
      return done(null, user);
    else
      return done(null, false, { message: 'Username and/or password wrong' });
  }).catch(err => {
    return done(err);
  });
}));

//automatically called whenever passport want to store information into the session
passport.serializeUser((user, done) => {
  done(null, user.id); // user.id
});
//when server reiceves session cookies, it extracts information and it calls done
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user);
    }).catch(err => {
      done(err, null);
    });
});

const port = 3001;
const app = new express();

app.use(express.json());
app.use(morgan('dev'));

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();
  return res.status(401).json({ error: 'not authenticated' });
}

//session cookies
app.use(session({
  secret: 'a secret string',
  resave: false,
  saveUninitialized: false
}));

//tell passport to use session cookies
app.use(passport.initialize());
app.use(passport.session());

/** API Login **/

// login
app.post('/api/sessions', [
  check('username').isString().notEmpty(),
  check('password').isString().notEmpty()
], function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);
      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json({ id: req.user.id, username: req.user.username });
    });
  })(req, res, next);
});

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Unauthenticated user!' });
});


/** API memes **/

app.get('/api/memes', (req, res) => {
  dao.getAll()
    .then((memes) => { res.json(memes); })
    .catch((error) => { res.status(500).json(error) })
})

app.post('/api/memes', [
  isLoggedIn,
  check('title').isString().notEmpty(),
],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const meme = {
      id: req.body.id,
      title: req.body.title,
      image: req.body.image,
      top: req.body.top,
      center: req.body.center,
      bottom: req.body.bottom,
      font: req.body.font,
      color: req.body.color,
      visibility: req.body.visibility,
      creator: req.body.creator
    };
    dao.createMeme(meme)
      .then((id) => { res.status(200).end(); })
      .catch((error) => { res.status(500).json(error) })
  })

app.delete('/api/memes/:id', isLoggedIn, (req, res) => {
  dao.deleteMeme(req.params.id)
    .then(() => { res.status(200).end() })
    .catch((error) => { res.status(500).json(error) })
})


// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});