'use strict';

const sqlite = require('sqlite3');
const {Course} = require('./Course');
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

exports.studyPlan = (id) => {
    return new Promise((resolve,reject) => {
        const sql = "SELECT * FROM courses , studyPlan  WHERE  code = courseCode AND studentMatricola = ?";
        db.get(sql, [id], (err,rows) => {
            if(err)
                reject(err);
            else{
                if(rows){
                  const courses = rows.map(
                                        (row) =>
                                        new Course(row.code,row.name,row.credits,row.maxStudents,row.incompatibel,row.preparatory)
                                    );
                    resolve(new StudyPlan(courses, rows[0].type, id));  
                }else
                    resolve(null);
            }
      
        })
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