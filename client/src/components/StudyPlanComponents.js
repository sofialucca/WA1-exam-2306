import 'bootstrap-icons/font/bootstrap-icons.css';
import { Table, Col, Button,Row, Form } from 'react-bootstrap';
import  {useState} from 'react';
import StudyPlanInfos from './StudyPlanInfos'

function StudyPlanForm(props){

  return(
    <>
      <StudyPlanInfos studyPlan = {props.studyPlan}/>
      {/*<CourseForm courses = {props.courses}/>*/}
      
      <Row>
        <Col>
          <Button variant = "outline-success">
            SAVE
          </Button>        
        </Col>
        <Col>
          <Button variant = "outline-warning" onClick = {() => props.cancelEdit()}>
            CANCEL
          </Button>        
        </Col>
        <Col>
          <Button variant = "outline-danger" onClick =  {() => props.deleteStudyPlan()}>
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
      
        <Form.Group className="mb-3" as= {Row}>
        
          <Form.Label column sm = {2}>Course</Form.Label>
        
          <Col sm = {8}>
          <Form.Select onChange={event => setCourse(event.target.value)}>
            <option>Select a course</option>

          </Form.Select>            
          </Col>
        
        <Col>
          <Button variant="primary" type="submit">ADD</Button> 
        </Col>
        </Form.Group>


    </Form>
  )  
}

export default StudyPlanForm;