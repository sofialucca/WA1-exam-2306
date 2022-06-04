import Course from './Course.js';

const SERVER_URL = 'http://localhost:3001';

const getAllCourses = async () => {
  
    const response = await fetch(SERVER_URL + '/api/courses'/*, {
      credentials: 'include',
    }*/);

    const coursesJson = await response.json();
    if(response.ok) {
      return coursesJson.map(c => new Course(c.code, c.name, c.credits, c.maxStudents, c.incompatible, c.preparatory, c.signedStudents));
    }
    else
      throw coursesJson;
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
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  }
};

const logOut = async() => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok)
    return null;
}
const API = {getAllCourses,logIn,logOut, getUserInfo};
export default API;