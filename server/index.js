"use strict";

const express = require("express");
const morgan = require("morgan"); // logging middleware
const { check, validationResult } = require("express-validator"); // validation middleware
const studyPlanDao = require("./modules/DAOStudyPlan"); // module for accessing the DB
const userDao = require("./modules/DAOUser");
const cors = require("cors");

// Passport-related imports
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");

// init express
const app = express();
const port = 3001;

// set up the middlewares
app.use(morgan("dev"));
app.use(express.json()); // for parsing json req body
// set uo and enable cors
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));

// Passport: set up local strategy
passport.use(
  new LocalStrategy(async function verify(username, password, cb) {
    const user = await userDao.getUser(username, password);
    if (!user) return cb(null, false, "Incorrect username or password.");

    return cb(null, user);
  })
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (user, cb) {
  // this user is id + email + name
  return cb(null, user);
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Not authorized" });
};

app.use(
  session({
    secret: "secret session message",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.authenticate("session"));

/*** APIs ***/
/**
 * GET /api/courses
 * retrieve al courses
 */
app.get("/api/courses", (req, res) => {
  studyPlanDao
    .listCourses()
    .then((courses) => {
      return res.json(courses).status(200).end();
    })
    .catch(() => res.status(500).end());
});

/**
 *  PUT /api/courses/:code
 * Modify course given the id
 */

app.put(
  "/api/courses/:code",
  [
    isLoggedIn,
    check("code").isLength({ min: 7, max: 7 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });

    const courseToUpdate = req.body;
    if (req.params.code === courseToUpdate.code) {
      try {
        await studyPlanDao.updateCourse(courseToUpdate);
        res.status(200).end();
      } catch (err) {
        res.status(503).json({
          error: `Database error while updating ${courseToUpdate.code}.`,
        });
      }
    } else {
      res.status(503).json({ error: `Wrong exam code in the req body.` });
    }
  }
);

/**
 *  PUT /api/studyplans/:id
 * Modify studyplan given the id
 */
//TODO server side check
app.put(
  "/api/studyplans/:id",
  [
    isLoggedIn,
    check("id").isInt(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(422).json({ errors: errors.array() });
    }
      
    switch (req.body.type) {
      case "full-time":
        if (req.body.totalCredits > 80 || req.body.totalCredits < 60)
          return res.status(422).json({ errors: "Wrong quantity credits" });
        break;
      case "part-time":
        if (req.body.totalCredits > 40 || req.body.totalCredits < 20)
          return res.status(422).json({ errors: "Wrong quantity credits" });
        break;
      default:
        return res.status(422).json({ errors: "Wrong type" });
    }

    studyPlanDao
      .modifyStudyPlan(req.params.id, req.body.totalCredits)
      .then()
      .then(async () => {
        await studyPlanDao.deleteAllCoursesStudyPlan(req.params.id);
        for(let c of req.body.courses){
          await studyPlanDao.addCourseStudyPlan(req.params.id, c.code);
        }
        const courses = await studyPlanDao.getStudentsCourses();
        for( let c of courses){
          await studyPlanDao.updateCourse(c)
        }
        return res.status(201).end();           
      })
      .catch((err) => {
        res.status(503).end();
      });
  }
);
/**
 * POST /api/studyplans/:id
 * create new studyplan
 */
app.post(
  "/api/studyplans/:id",
  [
    isLoggedIn,
    check("id").isInt()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    switch (req.body.type) {
      case "full-time":
        if (req.body.totalCredits > 80 || req.body.totalCredits < 60)
          return res.status(422).json({ errors: "Wrong quantity credits" });
        break;
      case "part-time":
        if (req.body.totalCredits > 40 || req.body.totalCredits < 20)
          return res.status(422).json({ errors: "Wrong quantity credits" });
        break;
      default:
        return res.status(422).json({ errors: "Wrong type" });
    }

    studyPlanDao
      .createStudyPlan(req.params.id, req.body.type, req.body.totalCredits)
      .then(async () => {
        for(let c of req.body.courses){
          await studyPlanDao.addCourseStudyPlan(req.params.id, c.code);
        }
        const courses = await studyPlanDao.getStudentsCourses();
        for( let c of courses){
          await studyPlanDao.updateCourse(c)
        }
        return res.status(201).end(); 
      })
      .catch((err) => res.status(503).end());
  }
);

/**
 * GET /api/studyplans/:id
 * get study plan given user id
 */
app.get(
  "/api/studyplans/:id",
  [isLoggedIn, check("id").isInt()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    studyPlanDao
      .getStudyPlan(req.params.id)
      .then((studyPlan) => res.json(studyPlan).status(200))
      .catch(() => res.status(500).end());
  }
);
/**
 * DELETE /api/studyplans/:id
 * delete studyplan from user id
 */

app.delete(
  "/api/studyplans/:id",
  [isLoggedIn, check("id").isInt()],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    studyPlanDao
      .deleteStudyPlan(req.params.id)
      .then(async(data) => {
        await studyPlanDao.deleteAllCoursesStudyPlan(req.params.id);
        const courses = await studyPlanDao.getStudentsCourses();
        for(let  c of courses){
          await studyPlanDao.updateCourse(c);
        }
        return res.status(204).end();   
      })
      .catch(() => res.status(503).end());
  }
);

/*** User APIs ***/

// POST /api/sessions

app.post("/api/sessions", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).send(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err) return next(err);

      // req.user contains the authenticated user, we send all the user info back
      return res.status(201).json(req.user);
    });
  })(req, res, next);
});

// GET /api/sessions/current
app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user).status(200);
  } else {
    res.status(401);
  }
});

// DELETE /api/session/current
app.delete("/api/sessions/current", (req, res) => {
  req.logout(() => {
    res.status(204).end();
  });
});

app.listen(port, () =>
  console.log(`Server started at http://localhost:${port}.`)
);
