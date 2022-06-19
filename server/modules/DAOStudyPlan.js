'use strict';


const {Course} = require("./Course");
const {StudyPlan} = require("./StudyPlan");

const { db } = require('./db');

//get all Courses
exports.incompatibleCourses = (code) => {
    return new Promise((resolve,reject) => {

        const sql = 'SELECT * FROM IncompatibleCourses WHERE course = ?';
        db.all(sql, [code], (err,rows) => {
            if(err) reject(err);
            else{
                if(rows)
                    resolve(
                    rows.map(
                      (row) =>row.incompatibleCourse
                    )
                  )
                else
                    resolve(null);

            }
        })
    })
}
exports.listCourses = () => {
    return new Promise(async function(resolve,reject){
        const sql = 'SELECT * FROM Courses ORDER BY name';
        db.all(sql, [], (err,rows) => {

            if(err) reject(err);
            else{
                if(rows) 
                    resolve(rows.map( row => new Course(row.code,row.name,row.credits,row.maxStudents,null,row.preparatory, row.enrolledStudents)))
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
        const sql = "SELECT * FROM StudyPlan, UserCourse, Courses WHERE studentMatricola = student AND courseCode = code AND student = ?" ;
        db.all(sql, [id], (err,rows) => {
            if(err)
                reject(err);
            else{
                if(rows){
                    const courses = rows.map( row => new Course(row.code,row.name,row.credits,row.maxStudents,null,row.preparatory, row.enrolledStudents));
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

exports.getStudentsCourses = () => {
    return new Promise(async function(resolve,reject){
        const sql = 'SELECT code, name, credits, maxStudents, preparatory, COUNT(DISTINCT studentMatricola) as signedStudents FROM Courses LEFT JOIN UserCourse ON courseCode = code GROUP BY code  ORDER BY name';
        db.all(sql, [], (err,rows) => {

            if(err) reject(err);
            else{
                if(rows){
                    resolve(rows.map(row => 
                        new Course(row.code,row.name,row.credits,row.maxStudents,null,row.preparatory, row.signedStudents)
                    ))
                }else(
                    resolve([])
                )
            }                    
        })
    }) 
}
