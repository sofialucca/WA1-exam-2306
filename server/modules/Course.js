'use strict';

function Course(code,name,credits, maxStudents, incompatible,preparatory, signedStudents){
    this.code = code;
    this.name = name;
    this.credits = credits;
    this.maxStudents = maxStudents;
    this.incompatible = incompatible ? incompatible : [];
    this.preparatory = preparatory;
    this.signedStudents = signedStudents;
}

exports.Course = Course;