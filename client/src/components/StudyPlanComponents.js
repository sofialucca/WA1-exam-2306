import 'bootstrap-icons/font/bootstrap-icons.css';
import { Table, Col, Button,Row, Form } from 'react-bootstrap';
import  {useState} from 'react';
import StudyPlanInfos from './StudyPlanInfos'

function StudyPlanForm(props){

  return(
    <>
      <StudyPlanInfos studyPlan = {props.studyPlan}
        deleteCourse = {props.deleteCourse} editable = {true}
      />
      <CourseForm/>
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


function CourseForm(props){

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

export default StudyPlanForm;