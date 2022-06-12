'use strict';

function StudyPlan(plan, id, type, totalCredits){
    this.courses = plan ? plan : [];
    this.userId = id;
    this.type = type;
    this.totalCredits = totalCredits;
    this.notAllowedCourses = [];
    this.required = [];
    this.maxCredits = type == "full-time" ? 80:40;

    this.availableCredits = this.maxCredits - this.totalCredits;
    if(plan) {
        plan.forEach(c => {
            if(c.incompatible)
                this.notAllowedCourses = [...this.notAllowedCourses, ...c.incompatible]
            if(c.preparatory)
                this.required.push(c.preparatory)
        })
    }

    this.enoughCredits = ()=>{
        const needCredits = type == "full-time" ? (this.totalCredits - 60) : (this.totalCredits -20);
        return needCredits >= 0
    }
    this.isInPlan = (code)=>{
        return this.courses.some(c => c.code === code)
    }
    this.isDeletable = (code) => {
        return this.courses.filter (c => c.preparatory && c.preparatory === code)
    }

    this.tooManyCredits = (course) => {
        return (this.totalCredits + course.credits > this.maxCredits);
    }

    this.isIncompatible = (code) => {
        return this.courses.filter(c =>c.incompatible && c.incompatible.some(c => c === code));
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