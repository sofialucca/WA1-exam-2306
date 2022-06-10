'use strict';

function StudyPlan(plan, id, type, totalCredits){
    this.courses = plan ? plan : [];
    this.userId = id;
    this.type = type;
    this.totalCredits = totalCredits;
    this.notAllowedCourses = [];
    this.required = [];
    this.maxCredits = type == "full-time" ? 80:40;
    if(plan) {
        plan.forEach(c => {
            if(c.incompatible)
                this.notAllowedCourses = [...this.notAllowedCourses, ...c.incompatible]
            if(c.preparatory)
                this.required.push(c.preparatory)
        })
    }

    this.isDeletable = (code) => {
        return this.courses.filter (c => c.preparatory === code)
    }

    this.tooManyCredits = (course) => {
        return (this.totalCredits + course.credits > this.maxCredits);
    }

    this.isIncompatible = (code) => {
        return this.courses.map(c =>{ 
            if(c.incompatible.some(c => c === code)){
                return c;
        }})
    }
    this.limitationCourse = (course) => {
        const limitations = {
            required : !this.isDeletable(course.code) ?
            {
                courses : this.courses.filter(c => c.preparatory.some(ci => ci === course.code))
            } : false,
            incompatible : this.incompatible.some(c => c === course.code) ?
                {
                    courses : this.courses.filter(c => c.incompatible.some(ci => ci === course.code))
                } : false,
            full: course.isFull(),
            studyPlanFull: (this.totalCredits + course.credits > this.maxCredits)
        }
        return limitations;
    }
}

export default StudyPlan;