'use strict'

function StudyPlan(plan, type, id){
    this.type = type;
    this.plan = [...plan];
    this.id = id;
}

exports.StudyPlan = StudyPlan;