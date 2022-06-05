import 'bootstrap-icons/font/bootstrap-icons.css';
import { Table, Col, Button } from 'react-bootstrap';
import  {useState} from 'react';

function StudyPlanTable(props) {

  return(<>
      <Table borderless >
        <thead>
          <tr>
            <th>Code</th>
            <th>Course Name</th>
            <th>Credits</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {
            props.studyPlan.courses.map((c) => 
              <CourseRow course={c} key={`course-${c.code}`} deleteCourse = {props.deleteCourse}/>)
          }
        </tbody>
      </Table>
    </>
  );
}

function CourseRow(props) {

    return(
        <tr>
            <CourseData course={props.course}/>  
            <CourseAction course = {props.course} deleteCourse = {props.deleteCourse}/>              
        </tr>

    );
}

function CourseData(props) {
  return(
    <>
      <td>{props.course.code}</td>
      <td>{props.course.name}</td>
      <td>{props.course.credits}</td>
    </>
  );
}

function CourseAction(props){
  return(
    <td >
      <Button variant='outline-danger' onClick={() => {props.deleteCourse(props.course.code)}}>
          <i className='bi bi-trash3'></i>
      </Button>
    </td>
  )  
}

export default StudyPlanTable;