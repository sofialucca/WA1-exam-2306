import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Container, Row, Alert } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Navigate, useNavigate  } from 'react-router-dom';
import {useState, useEffect} from 'react';
import { CourseRoute, DefaultRoute, LoginRoute, StudyPlanRoute } from './components/StudyPlanViews';
import {NavbarStudyPlan} from './components/NavbarComponents.js';

import API from './API';
import StudyPlan from './StudyPlan';
import Course from './Course';

function App() {
  const [courses, setCourses] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user,setUser] = useState({});
  const [studyPlan, setStudyPlan] = useState();

  const getCourses = async() => {
    const courses = await API.getAllCourses();
    setCourses(courses);
  }

  const getStudyPlan = async(id) => {
    const studyPlan = await API.getStudyPlan(id);
    setStudyPlan(studyPlan);   
  }
  const deleteCourseStudyPlan = async(course) => {
    setStudyPlan(oldStudyPlan => {

      return new StudyPlan(
        oldStudyPlan.courses.filter(c => c.code !== course.code),
        user.id,
        oldStudyPlan.type,
        oldStudyPlan.totalCredits-course.credits);
    });
    /*
    setCourses( oldCourses => oldCourses.map(c => 
      c.code === course.code ? 
        new Course(c.code, c.name, c.credits, c.maxStudents, c.incompatible, c.preparatory, c.signedStudents - 1)
        : c
      ));*/
  }

  const cancelEditingStudyPlan = async() => {
    getStudyPlan(user.id);
    getCourses();
  }
  //TODO delete and save study plan
  const deleteStudyPlan = async(plan) => {
    plan.courses.forEach((course) =>
      {
        setCourses( oldCourses => oldCourses.map(c => 
          c.code === course.code ? 
            new Course(c.code, c.name, c.credits, c.maxStudents, c.incompatible, c.preparatory, c.signedStudents - 1)
            : c
          ));  
      }  
    )

    setStudyPlan(null);
    await API.deleteStudyPlan(plan);
    getStudyPlan(user.id);
  }
  
  useEffect(() => {
    
    const checkAuth = async () => {
      const user = await API.getUserInfo(); // we have the user info here
      if(user !== null){
        setLoggedIn(true);
        setUser(user);
        getStudyPlan(user.id);         
      }
      
    };
    checkAuth();
   
    getCourses();

  }, []);

  const handleLogin = async (credentials) => {
    try {
      
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({msg: `Welcome, ${user.name}!`, type: 'success'});
      setUser({...user});
      getStudyPlan(user.id);
      return true;
    }catch(err) {
      console.log(err);
      setMessage({msg: err, type: 'danger'});
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
  };

  return (
    
    <BrowserRouter>
      <Container fluid className = 'App'>

        <Row className = "sticky-top">
          <NavbarStudyPlan user = {user}/>
        </Row>
        {message && <Row>
          <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
        </Row> }        
        <Routes>
          <Route path='*' element={<DefaultRoute />} />      
          <Route path = '/login' element = {loggedIn ? <Navigate replace to = '/studyplan'/>:<LoginRoute login = {handleLogin}/>}/>
          <Route path='/' element = {<CourseRoute courses = {courses}/>}/>
          <Route path="/studyplan" element = {loggedIn ? <StudyPlanRoute user = {user} studyPlan = {studyPlan} courses = {courses} deleteCourse = {deleteCourseStudyPlan} cancelEdit = {cancelEditingStudyPlan} />:<Navigate replace to = '/login'/> }/>
        </Routes>
      </Container>

    </BrowserRouter>
  );
}

export default App;
