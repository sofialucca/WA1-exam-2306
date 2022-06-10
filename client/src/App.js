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
  const [coursesToUpdate, setCoursesUpdate] = useState([]);
  const getCourses = async() => {
    const courses = await API.getAllCourses();
    setCourses(courses);
  }

  const getStudyPlan = async(id) => {
    const studyPlan = await API.getStudyPlan(id);
    setStudyPlan(studyPlan);   
  }

  const deleteCourseStudyPlan = async(course) => {
    const limitations = (studyPlan.isDeletable(course.code));

    if(!limitations.length){
      setCoursesUpdate(oldCourses =>
        [...oldCourses, new Course(course.code,course.name,course.credits,course.maxStudents,course.incompatible,course.preparatory,course.signedStudents-1)]  
      )
      setStudyPlan(oldStudyPlan => {

        return new StudyPlan(
          oldStudyPlan.courses.filter(c => c.code !== course.code),
          user.id,
          oldStudyPlan.type,
          oldStudyPlan.totalCredits-course.credits);
      });      
    }

  }

  //TODO check on max credits
  const addCourseStudyPlan = async(course) => {
    if(studyPlan.notAllowedCourses.every(c => c !== course.code) && !course.isFull() ){
      setStudyPlan(oldStudyPlan => {
        setCoursesUpdate(oldCourses =>
          [...oldCourses, new Course(course.code,course.name,course.credits,course.maxStudents,course.incompatible,course.preparatory,course.signedStudents+1)]  
        )
        return new StudyPlan(
          [...oldStudyPlan.courses, course],
          user.id,
          oldStudyPlan.type,
          oldStudyPlan.totalCredits+course.credits);
      });       
    }
  }
  const cancelEditingStudyPlan = async() => {
    getStudyPlan(user.id);
    getCourses();
  }
  //TODO save study plan
  const deleteStudyPlan = async() => {
    studyPlan.courses.forEach((course) =>
      {
        course.signedStudents--;
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
    await API.modifyCourses(plan.courses);
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
      setMessage('');
      setUser({...user});
      getStudyPlan(user.id);
      return true;
    }catch(err) {

      setMessage({msg: err, type: 'danger'});
      console.log(loggedIn);
      return false;
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
        {/*message && <Row>
          <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
        </Row> */}        
        <Routes>
          <Route path='*' element={<DefaultRoute />} />      
          <Route path = '/login' element = {<LoginRoute login = {handleLogin} loggedIn = {loggedIn}/>/*loggedIn ? <Navigate replace to = '/studyplan'/>:*/ }/>
          <Route path='/' element = {loggedIn ? <StudyPlanRoute user = {user} studyPlan = {studyPlan} courses = {courses} deleteCourse = {deleteCourseStudyPlan} cancelEdit = {cancelEditingStudyPlan} deleteStudyPlan = {deleteStudyPlan} createStudyPlan = {createStudyPlan} addCourseStudyPlan = {addCourseStudyPlan}/>:<CourseRoute courses = {courses}/>}/>
          <Route path = "/logout" element = {loggedIn ? <LogoutRoute user = {user} logout = {handleLogout} studyPlan = {studyPlan}/> :  <Navigate replace to = '/'/>}/>

          {/*<Route path="/studyplan" element = {<Navigate replace to = '/login'/> }/>*/}
        </Routes>
      </Container>

    </BrowserRouter>
  );
}

export default App;
