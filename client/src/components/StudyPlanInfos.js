import 'bootstrap-icons/font/bootstrap-icons.css';
import { Table, Button, Col, Row, Form } from 'react-bootstrap';
import  {useState} from 'react';

function StudyPlanInfos(props){

  return(
    <>
      <Row>
        <p>Type of studies: {props.studyPlan.type}</p>
        </Row>
        <Row>
          <Col>
            Credits chosen:{props.studyPlan.totalCredits} 
          </Col>
          <Col>
            Minimum credits required: {props.studyPlan.type  === 'full-time' ? 60:20}
          </Col>
          <Col>
            Maximum credits available: {props.studyPlan.type  === 'full-time' ? 80:40}
          </Col>
      </Row>
      {
        props.studyPlan.courses.length ? 
        <StudyPlanTable {...props}/> 
        :(<Row>NO COURSES</Row>)
      }
    </>);
}

function StudyPlanTable(props) {
  
    return(
        <Table borderless >
          <thead>
            <tr>
              <th>Code</th>
              <th>Course Name</th>
              {props.editable ? 
              <><th>Credits</th>
               <th>Actions</th></>
               : <><th>Credits</th></>
            }
            </tr> 
          </thead>
          <tbody>
              {
              props.studyPlan.courses.map((c) => 
                <CourseRow course={c} key={`course-${c.code}`} deleteCourse = {props.deleteCourse} editable = {props.editable}/>)
              }
  
          </tbody>
        </Table>   
    );
  }
  
  function CourseRow(props) {
  
      return(
          <tr>
            {props.editable ?
                <>
                    <CourseData course={props.course}/>  
                    <CourseAction course = {props.course} deleteCourse = {props.deleteCourse}/>                      
                </>
                : <CourseData course={props.course}/> 
            }
            
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
        <Button variant='outline-danger' onClick={() => {props.deleteCourse(props.course)}}>
            <i className='bi bi-trash3'></i>
        </Button>
      </td>
    )  
  }
export default StudyPlanInfos;