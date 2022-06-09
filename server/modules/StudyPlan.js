'use strict'

function StudyPlan(plan, id, type, totalCredits){
    this.courses = plan;
    this.userId = id;
    this.type = type;
    this.totalCredits = totalCredits;
}

exports.StudyPlan = StudyPlan;