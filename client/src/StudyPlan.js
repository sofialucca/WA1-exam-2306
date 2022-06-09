'use strict';

function StudyPlan(plan, id, type, totalCredits){
    this.courses = plan ? plan : [];
    this.userId = id;
    this.type = type;
    this.totalCredits = totalCredits;
}

export default StudyPlan;