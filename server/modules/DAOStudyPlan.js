'use strict';


const {Course} = require("./Course");
const {StudyPlan} = require("./StudyPlan");

const { db } = require('./db');

//get all Courses
exports.incompatibleCourses = (code) => {
    return new Promise((resolve,reject) => {

        const sql = 'SELECT * FROM IncompatibleCourses WHERE courseCode = ?';
        db.all(sql, [code], (err,rows) => {
            if(err) reject(err);
            else{
                rows.length
                ? resolve(
                    rows.map(
                      (row) =>row.incompatibleCourse
                    )
                  )
                : resolve(null);

            }
        })
    })
}

exports.listCourses = () => {
    return new Promise(async function(resolve,reject){
        const sql = 'SELECT * FROM Courses LEFT JOIN IncompatibleCourses ON courseCode = code  ORDER BY name';
        db.all(sql, [], (err,rows) => {

            if(err) reject(err);
            else{
                let lastAdded;
                if(rows.length){
                    const courses = [];
                    for(let row of rows){
                        if(lastAdded !== row.code){
                            lastAdded = row.code;
                            courses.push(new Course(row.code,row.name,row.credits,row.maxStudents,row.incompatibleCourse,row.preparatory, row.enrolledStudents))
                            
                        }else
                            courses[courses.length - 1].incompatible.push(row.incompatibleCourse);                        
                    }

                    resolve(courses);
                }                    
                else 
                    resolve(null);

            }
        })
    })
}

exports.updateCourse = (course) => {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE Courses SET enrolledStudents=? WHERE code=?';
      db.run(sql, [course.signedStudents, course.code], function(err) {
        if(err) reject(err);
        else resolve(this.lastID);
      });
    });
  };

exports.getStudyPlan = (id) => {
    return new Promise((resolve,reject) => {
        const sql = "SELECT * FROM studyPlan  LEFT JOIN (courses INNER JOIN  UserCourse ON code = courseCode ) ON studentMatricola = student WHERE student = ?" ;
        db.all(sql, [id], (err,rows) => {
            if(err)
                reject(err);
            else{
                if(rows.length){
                    const courses = (rows[0].code !== null) ?
                        rows.map(
                            (row) =>
                                new Course(row.code,row.name,row.credits,row.maxStudents,row.incompatible,row.preparatory)
                            )
                        :null;
                    resolve(new StudyPlan(courses, id, rows[0].type, rows[0].totalCredits));  
                }else
                    resolve(null);
            }
      
        })
    })
};

exports.deleteStudyPlan = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM StudyPlan WHERE student = ?';
        db.run(sql, [id], (err) => {
          if (err) reject(err);
          else resolve(null);
        });
    })
}

exports.createStudyPlan = (id, type) => {
    return new Promise((resolve, reject) => {

        const sql = 'INSERT INTO StudyPlan(student, type) VALUES(?, ?)';
        db.run(sql, [id,type], function (err) {
          if (err) 
            reject(err);
          else 
            resolve(this.lastID);
        });
      });
}

exports.deleteCourseStudyPlan = (id,code) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM StudyPlan WHERE coursecode=? AND studentMatricola = ?';
        db.run(sql, [code,id], (err) => {
          if (err) reject(err);
          else resolve(null);
        });
    })
};

exports.addCourseStudyPlan = (id,course,type) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO StudyPlan(studentMatricola,courseCode,type) VALUES(?,?,?)";
        db.run(sql, [id,course,type],(err) =>{
            if(err)
                reject(err);
            else
                resolve(this.lastId);
        });
    });
}

