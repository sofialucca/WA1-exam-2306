'use strict'

function StudyPlan(plan, type, id){
    this.type = type;
    this.courses = [...plan];
    this.id = id;
}

exports.StudyPlan = StudyPlan;