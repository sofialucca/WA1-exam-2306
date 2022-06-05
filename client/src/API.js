import Course from './Course.js';
import StudyPlan from './StudyPlan.js';

const SERVER_URL = 'http://localhost:3001';

const getAllCourses = async () => {
  
    const response = await fetch(SERVER_URL + '/api/courses'/*, {
      credentials: 'include',
    }*/);

    const coursesJson = await response.json();
    if(response.ok) {
      return coursesJson.map(c => new Course(c.code, c.name, c.credits, c.maxStudents, c.incompatible, c.preparatory, c.signedStudents));
    }
    else{
      const errDetails = await response.text();
      throw errDetails;
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

  if(response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
}

const getUserInfo = async () => {
  //console.log('TRY CURRENT SESSION');
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    credentials: 'include',
  });
  console.log('current session worked');
  const user = await response.json();
  if (response.ok) {
    return user;
  }else{
    console.log(user);
    return null;
  }
    
};

const logOut = async() => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });

}

const getStudyPlan = async(id) => {
  //const user = await getUserInfo();
  const response = await fetch(SERVER_URL + '/api/studyplans/' + id, {
    credentials: 'include',
  });

  if(response.ok) {
    const studyPlanJson = await response.json();
    return studyPlanJson;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
}

const deleteCourseStudyPlan = async(code,id) => {
  try{
    const response = await fetch(SERVER_URL + `/api/studyplan/${id}/courses/${code}`,
      {
        method: 'DELETE',
        credentials: 'include',
      }
    );
    if(!response.ok){
      const errMessage = await response.json();
      throw errMessage;    
    }else{
      return null;
    }
  }catch(err){
    throw new Error("Can't communicate with server");
  }
}
const API = {getAllCourses,logIn,logOut, getUserInfo, getStudyPlan, deleteCourseStudyPlan};
export default API;