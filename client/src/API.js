import Course from './Course';
import StudyPlan from './StudyPlan';

const SERVER_URL = 'http://localhost:3001';

const getAllCourses = async () => {
  try{
    const response = await fetch(SERVER_URL + '/api/courses');

    const coursesJson = await response.json();

    if(response.ok) {
      return coursesJson.map(c => new Course(c.code, c.name, c.credits, c.maxStudents, c.incompatible, c.preparatory, c.signedStudents));
    }
    else{
      const errDetails = await response.text();
      throw errDetails;
    }
  }catch(err){
    throw new Error("Can't communicate with server");
  }
};

const logIn = async(credentials) => {

    const response = await fetch(SERVER_URL + '/api/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
   // console.log(response);
    if(response.ok) {
      const user = await response.json();
      return user;
    }else {
      const errDetails = await response.text();
      throw errDetails;
    }
}

const getUserInfo = async () => {
  try{
    const response = await fetch(SERVER_URL + '/api/sessions/current', {
      method: 'GET',
      credentials: 'include',
    });
    const user = await response.json();
    if (response.ok) {
      return user;
    }else{
      return null;
    }
  }catch(err){
    throw new Error("Can't communicate with server");
  }
    
};

const logOut = async() => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });

}

const getStudyPlan = async(id) => {
  const response = await fetch(SERVER_URL + '/api/studyplans/' + id, {
      credentials: 'include',
    });

    if(response.ok) {
      const studyPlanJson = await response.json();
      if(studyPlanJson)
        return new StudyPlan(studyPlanJson.courses, parseInt(studyPlanJson.userId), studyPlanJson.type, studyPlanJson.totalCredits);
      else
        return null
    }
    else {
      const errDetails = await response.text();
      throw errDetails;
    }

}


const deleteStudyPlan = async(plan) => {
  const response = await fetch(SERVER_URL+ `/api/studyplans/${plan.userId}`,
    {
      method: 'DELETE',
      credentials: 'include',
    });
  const message = await response.json();
  if(!response.ok){
      throw message;    
  }else{
    return message;
  }

}

const createStudyPlan = async(studyPlan) => {
  const response = await fetch(SERVER_URL+ `/api/studyplans/${studyPlan.userId}`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          user: studyPlan.userId,
          type: studyPlan.type,
          credits: studyPlan.totalCredits,
          courses: studyPlan.courses
        }
      ),
    });
  const message = await response.json();
  if(!response.ok){      
    throw message;    
  }else{
    return message;
  }
}
const modifyStudyPlan = async(studyPlan) => {
  const response = await fetch(SERVER_URL + `/api/studyplans/${studyPlan.userId}`,
    {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
          {
            userId: studyPlan.userId,
            totalCredits:studyPlan.totalCredits,
            credits: studyPlan.credits,
            courses: studyPlan.courses
          }
        ),
        credentials: 'include'
      });

  if(!response.ok){
    const errMessage = await response.json();
    throw errMessage;        
  }
}
/*
const modifyStudyPlan = async(studyPlan,add,remove) => {
  const response = await fetch(SERVER_URL + `/api/studyplans/${studyPlan.userId}`,
    {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(
          {
            userId: studyPlan.userId,
            totalCredits:studyPlan.totalCredits,
            credits: studyPlan.credits,
            add: add,
            remove: remove
          }
        ),
        credentials: 'include'
      });
  console.log(response);
  if(!response.ok){
    const errMessage = await response.json();
    throw errMessage;        
  }
}*/

const modifyCourse = async(course) => {
  const response = await fetch(SERVER_URL + `/api/courses/${course.code}`,
      {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(
            {
              code: course.code,
              name:course.name,
              credits: course.credits,
              maxStudents: course.maxStudents,
              preparatory: course.preparatory,
              signedStudents: course.signedStudents,
            }
          ),
          credentials: 'include'
        });
  if(!response.ok){
      const errMessage = await response.json();
      throw errMessage;        
  }
  /*  
  if(response.ok) {
    return null;
  }
  else{
    const errMessage = await response.json();
    throw errMessage; 
  }*/

}
const API = {getAllCourses,logIn,logOut, getUserInfo, getStudyPlan, deleteStudyPlan, modifyCourse,createStudyPlan, modifyStudyPlan};
export default API;