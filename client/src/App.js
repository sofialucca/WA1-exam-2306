import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Container, Row, Alert } from 'react-bootstrap';
import { BrowserRouter, Routes, Route, Navigate, useNavigate  } from 'react-router-dom';
import {useState, useEffect} from 'react';
import { CourseRoute, DefaultRoute, LoginRoute, StudyPlanRoute, LogoutRoute } from './components/StudyPlanViews';
import {NavbarStudyPlan} from './components/NavbarComponents.js';

import API from './API';
import StudyPlan from './StudyPlan';
import Course from './Course';

function App() {
  const [courses, setCourses] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user,setUser] = useState(null);
  const [studyPlan, setStudyPlan] = useState(null);

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
  }

  const cancelEditingStudyPlan = async() => {
    getStudyPlan(user.id);
    getCourses();
  }
  //TODO delete and save study plan
  const deleteStudyPlan = async() => {
    studyPlan.courses.forEach((course) =>
      {
        setCourses( oldCourses => oldCourses.map(c => 
          c.code === course.code ? 
            new Course(c.code, c.name, c.credits, c.maxStudents, c.incompatible, c.preparatory, c.signedStudents - 1)
            : c
          ));  
      }  
    )
    const plan = studyPlan;
    setStudyPlan(null);
    await API.deleteStudyPlan(plan);
    await API.modifyCourses(plan.courses, 'add');
    getStudyPlan(user.id);
    getCourses();
  }
  const createStudyPlan = async(type) => {
    setStudyPlan(new StudyPlan(null,user.id,type,0));
    await API.createStudyPlan(user.id,type);
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
    setMessage('');
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
//TODO check why doesn't work when i have message
  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setMessage({msg: `Successfull logout`, type: 'success'});
    setUser(null);
    setStudyPlan(null);
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
          <Route path = '/login' element = {<LoginRoute login = {handleLogin} loggedIn = {loggedIn}/>/*loggedIn ? <Navigate replace to = '/studyplan'/>:*/ }/>
          <Route path='/' element = {loggedIn ? <StudyPlanRoute user = {user} studyPlan = {studyPlan} courses = {courses} deleteCourse = {deleteCourseStudyPlan} cancelEdit = {cancelEditingStudyPlan} deleteStudyPlan = {deleteStudyPlan} createStudyPlan = {createStudyPlan}/>:<CourseRoute courses = {courses}/>}/>
          <Route path = "/logout" element = {loggedIn ? <LogoutRoute logout = {handleLogout}/> :  <Navigate replace to = '/'/>}/>

          {/*<Route path="/studyplan" element = {<Navigate replace to = '/login'/> }/>*/}
        </Routes>
      </Container>

    </BrowserRouter>
  );
}

export default App;
