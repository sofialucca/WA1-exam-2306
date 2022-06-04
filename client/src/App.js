import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Container, Row } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import {useState, useEffect} from 'react';
import { CourseRoute, DefaultRoute, LoginRoute } from './components/StudyPlanViews';
import {NavbarStudyPlan} from './components/NavbarComponents.js';

import API from './API';

function App() {
  const [courses, setCourses] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);


  const getCourses = async() => {
    const courses = await API.getAllCourses();
    setCourses(courses);
  }

  useEffect(() => {
    getCourses();
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      await API.getUserInfo(); // we have the user info here
      setLoggedIn(true);
    };
    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      //setMessage({msg: `Welcome, ${user.name}!`, type: 'success'});
    }catch(err) {
      console.log(err);
      //setMessage({msg: err, type: 'danger'});
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
          <NavbarStudyPlan />
        </Row>
        
        <Routes>
          <Route path='*' element={<DefaultRoute />} />      
          <Route path = '/login' element = {<LoginRoute login = {handleLogin}/>}/>
          <Route path='/' element = {<CourseRoute courses = {courses}/>}/>
        </Routes>
      </Container>

    </BrowserRouter>
  );
}

export default App;
