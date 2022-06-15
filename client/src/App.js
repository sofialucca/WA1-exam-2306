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
  const [coursesToAdd, setCoursesToAdd] = useState([]);
  const [coursesToRemove, setCoursesToRemove] = useState([]);
  
  const getCourses = async() => {
    const courses = await API.getAllCourses();
    setCourses(courses);
  }

  const getStudyPlan = async(id) => {
    const studyPlan = await API.getStudyPlan(id);
    setStudyPlan(studyPlan);   
  }

  const deleteCourseStudyPlan = (course) => {
    const limitations = (studyPlan.isDeletable(course.code));

    if(!limitations.length){
      setCoursesToAdd(oldCourses => oldCourses.filter(oc=> oc !== course.code));
      setCoursesToRemove(oldCourses => [...oldCourses,course.code]);
      /*setCoursesUpdate(oldCourses =>{
        if(oldCourses.length !== 0 && oldCourses.some(oc => oc.code === course.code)){
          setCoursesToRemove((old)=>old.filter(oc => oc !== course.code));
          return oldCourses.filter(oc => oc.code !== course.code);
        }else{
          setCoursesToRemove((old) => [...old,course.code]);
          return [new Course(course.code,course.name,course.credits,course.maxStudents,course.incompatible,course.preparatory,course.signedStudents-1),...oldCourses ];  
        }
      })*/

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
  const addCourseStudyPlan = async (course) => {
    if(studyPlan.notAllowedCourses.every(c => c !== course.code) && !course.isFull() ){
      setCoursesToRemove(oldCourses => oldCourses.filter(oc=> oc !== course.code));
      setCoursesToAdd(oldCourses => [...oldCourses,course.code]);
      /*setCoursesUpdate((oldCourses) =>{
        if(oldCourses.length !== 0 && oldCourses.some(oc => oc.code === course.code)){
          setCoursesToAdd((old)=>old.filter(oc => oc !== course.code))
          return oldCourses.filter(oc => oc.code !== course.code);
        }else{
          setCoursesToAdd(old => [...old,course.code]);
          return [...oldCourses, new Course(course.code,course.name,course.credits,course.maxStudents,course.incompatible,course.preparatory,course.signedStudents+1)]
        }
            
      })*/
      console.log("add");
      console.log(coursesToAdd);
      console.log("remove");
      console.log(coursesToRemove);
      setStudyPlan(oldStudyPlan => {

        return new StudyPlan(
          [...oldStudyPlan.courses, course],
          user.id,
          oldStudyPlan.type,
          oldStudyPlan.totalCredits+course.credits);
      });       
    }
  }
  const cancelEditingStudyPlan = () => {
    getStudyPlan(user.id);
    getCourses();
    setCoursesUpdate([]);
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

    const plan = new StudyPlan(studyPlan.courses,studyPlan.userId,studyPlan.type,studyPlan.totalCredits);
    setStudyPlan(null);

    await plan.courses.forEach(async (c) => await API.modifyCourse(c));
    await API.deleteStudyPlan(plan);
    getStudyPlan(user.id);
    getCourses();
  }
  const createStudyPlan = async(type) => {
    setStudyPlan(new StudyPlan(null,user.id,type,0));
    //getStudyPlan(user.id);
  }
  //TODO modification of courses enrolled when saving
  const saveStudyPlan = async() => {
    if(studyPlan && studyPlan.enoughCredits()){
      setCourses(oldCourses => {
        oldCourses.map(c => {
          //const newCourse = coursesToUpdate.filter(cu => cu.code === c.code);
          if(coursesToAdd.some(ca => ca===c.code))
            return new Course(c.code,c.name,c.credits,c.maxStudents,c.incompatible,c.preparatory,c.signedStudents+1)
          else if(coursesToRemove.some(ca => ca===c.code))
            return new Course(c.code,c.name,c.credits,c.maxStudents,c.incompatible,c.preparatory,c.signedStudents-1)
          else
            return c
        })
      }) 
      console.log(courses);
      //const newStudyPlan = new StudyPlan(studyPlan.courses,user.id,studyPlan.type,studyPlan.totalCredits);
      if(await API.getStudyPlan(user.id))
        await API.modifyStudyPlan(studyPlan,coursesToAdd,coursesToRemove);
      else
        await API.createStudyPlan(studyPlan);

      await courses.forEach(async (c) => await API.modifyCourse(c));
      getStudyPlan(user.id);
      getCourses();
      setCoursesToAdd([]);
      setCoursesToRemove([]);
      setCoursesUpdate([]);      
    }

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
    
    setCoursesUpdate([]);
  }, []);


  const handleLogin = async (credentials) => {
    try {
      
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage('');
      setUser({...user});
      console.log(user.id);
      getStudyPlan(user.id);
      //return true;
    }catch(err) {

      setMessage({msg: err, type: 'danger'});
      console.log(loggedIn);
      //return false;
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
          <NavbarStudyPlan user = {user} cancelEditingStudyPlan = {cancelEditingStudyPlan}/>
        </Row>
        {/*message && <Row>
          <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
        </Row> */}        
        <Routes>
          <Route path='*' element={<DefaultRoute />} />      
          <Route path = '/login' element = {loggedIn ? <Navigate replace to = '/'/>:<LoginRoute login = {handleLogin} loggedIn = {loggedIn}/>}/>
          <Route path='/' element = {loggedIn ? <StudyPlanRoute user = {user} studyPlan = {studyPlan} courses = {courses} deleteCourse = {deleteCourseStudyPlan} cancelEdit = {cancelEditingStudyPlan} deleteStudyPlan = {deleteStudyPlan} createStudyPlan = {createStudyPlan} addCourseStudyPlan = {addCourseStudyPlan} saveStudyPlan = {saveStudyPlan}/>:<CourseRoute courses = {courses}/>}/>
          <Route path = "/logout" element = {loggedIn ? <LogoutRoute user = {user} logout = {handleLogout} studyPlan = {studyPlan}/> :  <Navigate replace to = '/'/>}/>

          {/*<Route path="/studyplan" element = {<Navigate replace to = '/login'/> }/>*/}
        </Routes>
      </Container>

    </BrowserRouter>
  );
}

export default App;
