import Course from "./Course";
import StudyPlan from "./StudyPlan";

const SERVER_URL = "http://localhost:3001";

/**********
 * API COURSES
 *
 *
 ***********/

/**
 * GET all courses
 * @returns all courses
 */
const getAllCourses = async () => {
  const response = await fetch(SERVER_URL + "/api/courses");

  const coursesJson = await response.json();

  if (response.ok) {
    return coursesJson.map(
      (c) =>
        new Course(
          c.code,
          c.name,
          c.credits,
          c.maxStudents,
          c.incompatible,
          c.preparatory,
          c.signedStudents
        )
    );
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
};


/**
 * MODIFY course
 * @param {*} course 
 * @returns 
 */
const modifyCourse = async (course) => {
  const response = await fetch(SERVER_URL + `/api/courses/${course.code}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code: course.code,
      name: course.name,
      credits: course.credits,
      maxStudents: course.maxStudents,
      preparatory: course.preparatory,
      signedStudents: course.signedStudents,
    }),
    credentials: "include",
  });
  if (!response.ok) {
    const errMessage = await response.text();
    throw errMessage;
  }else{
    return response;
  }
};

/**
 * 
 * API SESSIONS 
 */

/**
 * LOGIN
 * @param {*} credentials 
 * @returns user logged in
 */
const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + "/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
};


/**
 * 
 * @returns user logged in
 */
const getUserInfo = async () => {
  try {
    const response = await fetch(SERVER_URL + "/api/sessions/current", {
      method: "GET",
      credentials: "include",
    });
    const user = await response.json();
    if (response.ok) {
      return user;
    } else {
      return null;
    }
  } catch (err) {
    throw new Error("Can't communicate with server");
  }
};

/**
 * LOGOUT
 */
const logOut = async () => {
  try{
    const response = await fetch(SERVER_URL + "/api/sessions/current", {
      method: "DELETE",
      credentials: "include",
    });    
  }catch(err){
    throw err;
  }
};

/*****
 * API STUDYPLAN
 */

/**
 * GET studyplan
 * @param {*} id 
 * @returns studyplan
 */
const getStudyPlan = async (id) => {
  const response = await fetch(SERVER_URL + "/api/studyplans/" + id, {
    credentials: "include",
  });

  if (response.ok) {
    const studyPlanJson = await response.json();
    if (studyPlanJson)
      return new StudyPlan(
        studyPlanJson.courses,
        parseInt(studyPlanJson.userId),
        studyPlanJson.type,
        studyPlanJson.totalCredits
      );
    else return null;
  } else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

/**
 * DELETE studyplan
 * @param {*} userId 
 * @returns studyplan
 */
const deleteStudyPlan = async (userId) => {
  const response = await fetch(SERVER_URL + `/api/studyplans/${userId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const message = await response.json();
  if (!response.ok) {
    throw message;
  } else {
    return message;
  }
};

/**
 * CREATE studyplan
 * @param {*} studyPlan 
 */

const createStudyPlan = async (studyPlan) => {
  const response = await fetch(
    SERVER_URL + `/api/studyplans/${studyPlan.userId}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: studyPlan.userId,
        type: studyPlan.type,
        totalCredits: studyPlan.totalCredits,
        courses: studyPlan.courses,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw error;
  }
};

/**
 * MODIFY StudyPlan
 * @param {*} studyPlan 
 */

const modifyStudyPlan = async (studyPlan) => {
  const response = await fetch(
    SERVER_URL + `/api/studyplans/${studyPlan.userId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: studyPlan.userId,
        totalCredits: studyPlan.totalCredits,
        type: studyPlan.type,
        courses: studyPlan.courses,
      }),
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errMessage = await response.json();
    throw errMessage;
  }
};


const API = {
  getAllCourses,
  logIn,
  logOut,
  getUserInfo,
  getStudyPlan,
  deleteStudyPlan,
  modifyCourse,
  createStudyPlan,
  modifyStudyPlan,
};
export default API;
