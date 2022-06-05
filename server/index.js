'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const {check, validationResult} = require('express-validator'); // validation middleware
const studyPlanDao = require('./modules/DAOStudyPlan'); // module for accessing the DB
const userDao = require('./modules/DAOUser');
const cors = require('cors');

// Passport-related imports
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

// init express
const app = express();
const port = 3001;

// set up the middlewares
app.use(morgan('dev'));
app.use(express.json()); // for parsing json request body
// set uo and enable cors
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials:true,  
};
app.use(cors(corsOptions));

// Passport: set up local strategy
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await userDao.getUser(username, password)
  if(!user)
    return cb(null, false, 'Incorrect username or password.');
    
  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) { // this user is id + email + name
  return cb(null, user);
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
});

const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

app.use(session({
  secret: "secret session message",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

/*** APIs ***/

// GET /api/courses
app.get('/api/courses', (request, response) => {

  studyPlanDao.listCourses()
    .then(courses => response.json(courses).status(200))
    .catch(() => response.status(500).end());
  });

// GET /api/studyplans/:id
app.get('/api/studyplans/:id', isLoggedIn, (request, response) => {

  studyPlanDao.getStudyPlan(request.params.id)
  .then(studyPlan => response.json(studyPlan).status(200))
  .catch(() => response.status(500).end());
})

// DELETE /api/studyplan/:id/courses/:code

app.delete('/api/studyplan/:id/:code'), isLoggedIn, async (req, res) => {
  
  try {
    await studyPlanDao.deleteCourseStudyPlan(req.params.id,req.params.code);
    res.status(204).end();
  } catch(err) {
    res.status(503).json({ error: `Database error during the deletion of exam ${req.params.code}.`});
  }  
}

/*** User APIs ***/

  // POST /api/sessions

app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).send(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        return res.status(201).json(req.user);
      });
  })(req, res, next);
});

/* If we aren't interested in sending error messages... 
app.post('/api/sessions', passport.authenticate('local'), (req, res) => {
  res.status(201).json(req.user);
});*/

// GET /api/sessions/current
app.get('/api/sessions/current', (req, res) => {
  console.log('check aUTH');
  if(req.isAuthenticated()) {
    res.json(req.user).status(200);}
  else
    res.status(401);
});

// DELETE /api/session/current
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

app.listen(port, () => console.log(`Server started at http://localhost:${port}.`));