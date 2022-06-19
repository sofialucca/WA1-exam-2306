import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import { Container, Row, Alert } from "react-bootstrap";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import {
  CourseRoute,
  DefaultRoute,
  LoginRoute,
  StudyPlanRoute,
  LogoutRoute,
} from "./components/StudyPlanViews";
import { NavbarStudyPlan } from "./components/NavbarComponents.js";

import API from "./API";
import StudyPlan from "./StudyPlan";
import Course from "./Course";

function App() {
  const [courses, setCourses] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);
  const [studyPlan, setStudyPlan] = useState(null);
  const [newStudyPlan, setNewStudyPlan] = useState(true);
  const [coursesToUpdate, setCoursesUpdate] = useState([]);

  const getCourses = async () => {
    const courses = await API.getAllCourses();
    setCourses(courses);
  };

  //STUDYPLAN operations  
  const getStudyPlan = async (id) => {
    const studyPlan = await API.getStudyPlan(id);
    if(studyPlan !== null)
      setNewStudyPlan(false);
    else
      setNewStudyPlan(true);
    setStudyPlan(studyPlan);
  };

  const deleteCourseStudyPlan = (course) => {
    setCoursesUpdate((oldCourses) => {
      if (oldCourses.every((oc) => oc.code !== course.code))
        return [
          ...oldCourses,
          new Course(
            course.code,
            course.name,
            course.credits,
            course.maxStudents,
            course.incompatible,
            course.preparatory,
            course.signedStudents - 1
          ),
        ];
      else return oldCourses.filter((oc) => oc.code !== course.code);
    });


    setStudyPlan((oldStudyPlan) => {
      return new StudyPlan(
        oldStudyPlan.courses.filter((c) => c.code !== course.code),
        user.id,
        oldStudyPlan.type,
        oldStudyPlan.totalCredits - course.credits
      );
    });
  };

  const addCourseStudyPlan = async (course) => {
      setCoursesUpdate((oldCourses) => {
        if (oldCourses.every((oc) => oc.code !== course.code))
          return [
            ...oldCourses,
            new Course(
              course.code,
              course.name,
              course.credits,
              course.maxStudents,
              course.incompatible,
              course.preparatory,
              course.signedStudents + 1
            ),
          ];
        else return oldCourses.filter((oc) => oc.code !== course.code);
      });
      setStudyPlan((oldStudyPlan) => {
        return new StudyPlan(
          [...oldStudyPlan.courses, course],
          user.id,
          oldStudyPlan.type,
          oldStudyPlan.totalCredits + course.credits
        );
      });
  };

  const cancelEditingStudyPlan = () => {
    getStudyPlan(user.id);
    getCourses();
    setCoursesUpdate([]);
  };

  const deleteStudyPlan = async () => {
    try{
      if(!newStudyPlan){
        const oldStudyPlan = await API.getStudyPlan(user.id);
        oldStudyPlan.courses.forEach((course) => {
          course.signedStudents--;
          setCourses((oldCourses) =>
            oldCourses.map((c) =>
              c.code === course.code
                ? new Course(
                    c.code,
                    c.name,
                    c.credits,
                    c.maxStudents,
                    c.incompatible,
                    c.preparatory,
                    c.signedStudents - 1
                  )
                : c
            )
          );
        });

        setStudyPlan(null);

        await API.deleteStudyPlan(user.id);
        getStudyPlan(user.id);
        
        setMessage({ msg: `Successfull deletion of study plan`, type: "success" });      
      }else{
        setStudyPlan(null);
      }
        
        getCourses();
        setCoursesUpdate([]);      
      
    }catch(err){
      setMessage({ msg: err.error, type: "danger" })      ;
    }

  };

  const createStudyPlan = async (type) => {
    setStudyPlan(new StudyPlan(null, user.id, type, 0));
  };

  const saveStudyPlan = async () => {
    if (studyPlan && studyPlan.neededCredits() >= 0) {
      try{
        if(coursesToUpdate.length == 0){
          return;
        }
        let msg;
        setCourses(oldCourses =>  
          oldCourses.map(c => {
            if(coursesToUpdate.some(cu => cu.code === c.code)){
              return coursesToUpdate.filter(cu => cu.code === c.code)[0];
            }
            return c
          }
         ))
        if (await API.getStudyPlan(user.id)) {
          msg = `Successfully saved the study plan`;
          await API.modifyStudyPlan(studyPlan);
        } else {
          msg = `Successfully created the study plan`; 
          await API.createStudyPlan(studyPlan);
        }

        getStudyPlan(user.id);
        getCourses();
        setCoursesUpdate([]); 
        setMessage({ msg: msg, type: "success" })      ;       
      }catch(err){
        setMessage({ msg: err.error, type: "danger" })      ;
      }

    } else {
      setMessage({
        msg: (
          <>
            Not enough credits.
            <br />
            Need at least :{-studyPlan.neededCredits()} more
          </>
        ),
        type: "warning",
      });
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const user = await API.getUserInfo(); // we have the user info here
      if (user !== null) {
        setLoggedIn(true);
        setUser(user);
        getStudyPlan(user.id);
      }
    };
    setMessage("");
    checkAuth();
    setCoursesUpdate([]);
    getCourses();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({ msg: `Successfull login`, type: "success" });
      setUser({ ...user });
      getStudyPlan(user.id);
    } catch (err) {
      setMessage({ msg: err, type: "danger" });
    }
  };
  
  const handleLogout = async () => {
    try{
      await API.logOut();
      setLoggedIn(false);
      setMessage({ msg: `Successfull logout`, type: "success" });
      setUser(null);
      setStudyPlan(null);
      setCoursesUpdate([]);      
    }catch (err) {
      setMessage({ msg: err, type: "danger" });
    }

  };

  return (
    <BrowserRouter>
      <Container fluid className="App">
        <Row className="sticky-top">
          <NavbarStudyPlan
            user={user}
            cancelEditingStudyPlan={cancelEditingStudyPlan}
            logout={handleLogout}
          />
          {message && (
            <Alert
              variant={message.type}
              onClose={() => setMessage("")}
              dismissible
            >
              {message.msg}
            </Alert>
          )}
        </Row>

        <Routes>
          <Route path="*" element={<DefaultRoute />} />
          <Route
            path="/login"
            element={
              loggedIn ? (
                <Navigate replace to="/" />
              ) : (
                <LoginRoute login={handleLogin} loggedIn={loggedIn} />
              )
            }
          />
          <Route
            path="/"
            element={
              loggedIn ? (
                <StudyPlanRoute
                  user={user}
                  studyPlan={studyPlan}
                  courses={courses}
                  deleteCourse={deleteCourseStudyPlan}
                  cancelEdit={cancelEditingStudyPlan}
                  deleteStudyPlan={deleteStudyPlan}
                  createStudyPlan={createStudyPlan}
                  addCourseStudyPlan={addCourseStudyPlan}
                  saveStudyPlan={saveStudyPlan}
                />
              ) : (
                <CourseRoute courses={courses} />
              )
            }
          />
          <Route
            path="/logout"
            element={
              loggedIn ? (
                <LogoutRoute
                  user={user}
                  logout={handleLogout}
                  studyPlan={studyPlan}
                />
              ) : (
                <Navigate replace to="/" />
              )
            }
          />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
