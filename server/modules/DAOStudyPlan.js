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
        const sql = 'SELECT * FROM Courses LEFT JOIN IncompatibleCourses ON course = code  ORDER BY name';
        db.all(sql, [], (err,rows) => {

            if(err) reject(err);
            else{
                let lastAdded;
                if(rows.length){
                    const courses = [];
                    for(let row of rows){
                        if(lastAdded !== row.code || courses.length == 0){
                            lastAdded = row.code;
                            courses.push(new Course(row.code,row.name,row.credits,row.maxStudents,row.incompatibleCourse,row.preparatory, row.enrolledStudents))
                            
                        }else{
                            courses[courses.length - 1].incompatible.push(row.incompatibleCourse); 
                        }
                                                   
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
        const sql = "SELECT * FROM StudyPlan  LEFT JOIN ((courses INNER JOIN  UserCourse ON code = courseCode ) LEFT JOIN IncompatibleCourses ON course = code) ON studentMatricola = student WHERE student = ?" ;
        db.all(sql, [id], (err,rows) => {
            if(err)
                reject(err);
            else{
                if(rows.length){
                    let lastAdded;
                    const courses = [];
                    if(rows[0].code !== null){
                        for(let row of rows){
                            if(lastAdded !== row.code ){
                                lastAdded = row.code;
                                courses.push(new Course(row.code,row.name,row.credits,row.maxStudents,row.incompatibleCourse,row.preparatory, row.enrolledStudents))
                                
                            }else{
                                courses[courses.length - 1].incompatible.push(row.incompatibleCourse);
                            }
                                                        
                        }                        
                    }
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

exports.deleteAllCoursesStudyPlan = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM UserCourse WHERE studentMatricola = ?';
        db.run(sql, [id], (err) => {
          if (err) reject(err);
          else resolve(null);
        });
    })    
}
exports.createStudyPlan = (id, type,credits) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO StudyPlan(student, type,totalCredits) VALUES (?, ?, ?)';
        db.run(sql, [id,type,credits], function (err) {
          if (err) 
            reject(err);
          else 
            resolve(this.lastID);
        });
      });
}

exports.modifyStudyPlan = (id,credits) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE StudyPlan SET totalCredits=? WHERE student=?';
        db.run(sql, [credits,id], function(err) {
          if(err) reject(err);
          else resolve(this.lastID);
        });
      });    
}

exports.addCourseStudyPlan = (id,course) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO UserCourse(studentMatricola,courseCode) VALUES(?,?)';
        db.run(sql, [id,course], (err) => {
          if (err) reject(err);
          else resolve(null);
        });
    })     
}

exports.deleteCourseStudyPlan = (id,code) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM UserCourse WHERE studentMatricola = ? AND courseCode = ?';
        db.run(sql, [id,code], (err) => {
          if (err) reject(err);
          else resolve(null);
        });
    })
};

