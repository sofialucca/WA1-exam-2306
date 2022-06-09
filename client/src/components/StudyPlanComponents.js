import 'bootstrap-icons/font/bootstrap-icons.css';
import { Table, Col, Button,Row, Form } from 'react-bootstrap';
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
      <StudyPlanForm/>
      <Row>
        <Col>
          <Button>
            SAVE
          </Button>        
        </Col>
        <Col>
          <Button onClick = {() => props.cancelEdit()}>
            CANCEL
          </Button>        
        </Col>
        <Col>
          <Button onClick =  {() => props.deleteStudyPlan()}>
            DELETE
          </Button>
        </Col> 
      </Row>      
    </>

  )    
}
function StudyPlanTable(props) {
  
  return(
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
      <Button variant='outline-danger' onClick={() => {props.deleteCourse(props.course)}}>
          <i className='bi bi-trash3'></i>
      </Button>
    </td>
  )  
}

function StudyPlanForm(props){

  const [course, setCourse] = useState('');

 
  const handleSubmit = (event) => {
    event.preventDefault();


  }
  
  return(
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Course</Form.Label>
        <Form.Select onChange={event => setCourse(event.target.value)}>
          <option>Select a course</option>

        </Form.Select>
      </Form.Group>


      <Button variant="primary" type="submit">ADD</Button>

    </Form>
  )  
}

export default StudyPlanInfos;