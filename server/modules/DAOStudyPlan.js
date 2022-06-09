'use strict';


const {Course} = require("./Course");
const {StudyPlan} = require("./StudyPlan");

const { db } = require('./db');

//get all Courses

exports.listCourses = () => {
    return new Promise((resolve,reject) => {
        const sql = 'SELECT * FROM Courses ORDER BY name';
        db.all(sql, [], (err,rows) => {
            console.log("enter db");
            if(err) reject(err);
            else{
                rows
                ? resolve(
                    rows.map(
                      (row) =>
                        new Course(row.code,row.name,row.credits,row.maxStudents,row.incompatible ? row.incompatible.split(" "):null,row.preparatory, row.enrolledStudents)
                    )
                  )
                : resolve(null);

            }
        })
    })
}

exports.getStudyPlan = (id) => {
    return new Promise((resolve,reject) => {
        const sql = "SELECT * FROM courses , studyPlan, UserCourse  WHERE  code = courseCode AND studentMatricola = ? AND studentMatricola = student";
        db.all(sql, [id], (err,rows) => {
            if(err)
                reject(err);
            else{
                if(rows){
                  const courses = rows.map(
                                        (row) =>
                                        new Course(row.code,row.name,row.credits,row.maxStudents,row.incompatible,row.preparatory)
                                    );
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

