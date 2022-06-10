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
            Minimum credits required: {props.studyPlan.type  === 'full-time' ? 60:20}
          </Col>
          <Col>
            Maximum credits available: {props.studyPlan.maxCredits}
          </Col>
      </Row>
      {
        props.studyPlan.courses.length ? 
        <StudyPlanTable {...props}/> 
        :(<Row>NO COURSES</Row>)
      }
      <Col>

            Total credits:{props.studyPlan.totalCredits} 
      </Col>
    </>
    );
}

function StudyPlanTable(props) {
  
    return(
        <Table borderless >
          <thead>
            <tr>
              <th>Code</th>
              <th>Course Name</th>
              <th>Credits</th>
            </tr> 
          </thead>
          <tbody>
              {
              props.studyPlan.courses.map((c) => 
                <CourseRow course={c} key={`course-${c.code}`} />)
              }
  
          </tbody>
        </Table>   
    );
  }
  
  function CourseRow(props) {
  
      return(
          <tr className = "row-separation">
            <CourseData course={props.course}/> 
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
  
export default StudyPlanInfos;