'use strict';

function Course(code,name,credits, maxStudents, incompatible,preparatory, signedStudents){
    this.code = code;
    this.name = name;
    this.credits = credits;
    this.maxStudents = maxStudents;
    this.incompatible = incompatible === null ? []:incompatible;
    this.preparatory = preparatory;
    this.signedStudents = signedStudents;

    this.isFull = () => {
        return this.maxStudents === this.signedStudents ? true : false;
    }
    /*
    this.addStudent = () => {
        this.signedStudents++;
    }

    this.removeStudent = () => {
        this.signedStudents--;
    }
    */
    this.printIncompatible = () => {

        if(!this.incompatible){
            return `${this.name} doesn't have any incompatible course`
        }
        let stringReturn = `Incompatible course`;
        stringReturn += (this.incompatible.length > 1) ? "s:" : ":";
        return(
            < >
                <span>{stringReturn}</span>
                <br/>
                <ul>
                    {
                        this.incompatible.map((iCourse) => <li key = {iCourse}>{iCourse}</li>)
                    }
                </ul>                
            </>
        );
    }

    this.printPreparatory = () => {
        return (this.preparatory ?
        `Preparatory course : ${this.preparatory}`
        : `${this.name} doesn't have any preparatory course`);
    }
}

export default Course;