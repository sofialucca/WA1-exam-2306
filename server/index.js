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
app.get('/api/courses',  (request, response) => {

  studyPlanDao.listCourses()
    .then((courses) =>{
      return response.json(courses).status(200)      
    })
    .catch(() => response.status(500).end());
  });

//PUT /api/courses/:code
app.put('/api/courses/:code', 
  [
    isLoggedIn,
    check('code').isLength({min:7, max:7}) 
  ], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty())
    return res.status(422).json({errors: errors.array()});

  const courseToUpdate = req.body;
  if(req.params.code === courseToUpdate.code) {
    try {
      await dao.updateCourse(courseToUpdate);
      res.status(200).end();
    }
    catch(err) {
      console.error(err);
      res.status(503).json({error: `Database error while updating ${courseToUpdate.code}.`});
    }
  }
  else {
    res.status(503).json({error: `Wrong exam code in the request body.`});
  }
});

//POST /api/studyplans/:id/:type
app.post('/api/studyplans/:id/:type', isLoggedIn, (request, response) => {
  console.log("enter db");
  studyPlan.createStudyPlan(request.params.id, request.params.type)
  .then(data => response.status(201).end())
  .catch(() => response.status(503).end());
})

// GET /api/studyplans/:id
app.get('/api/studyplans/:id',
[
  isLoggedIn,
  check('code').isLength({min:7, max:7}) 
], (request, response) => {

  studyPlanDao.getStudyPlan(request.params.id)
  .then(studyPlan => response.json(studyPlan).status(200))
  .catch(() => response.status(500).end());
})

// DELETE /api/studyplans/:id
app.delete('/api/studyplans/:id', isLoggedIn, (request, response) => {

  studyPlanDao.deleteStudyPlan(request.params.id)
  .then(data => response.status(204))
  .catch(() => response.status(503).end());
})



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
  if(req.isAuthenticated()) {
    res.json(req.user).status(200);
  }else{
    res.status(401);
  }
    
});

// DELETE /api/session/current
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

app.listen(port, () => console.log(`Server started at http://localhost:${port}.`));