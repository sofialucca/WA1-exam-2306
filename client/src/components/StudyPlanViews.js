import { Row, Col,Button } from 'react-bootstrap';

import CourseTable from './CourseTable.js';
import { LoginForm } from './AuthComponents';
import StudyPlanTable from './StudyPlanComponents.js';

function DefaultRoute() {
    return(
        <>
          <Row>
            <Col>
              <h1>ERROR 404: Page not found</h1>
              <p>Nothing can be found at this route</p>
            </Col>
          </Row>
        </>
      );    
}

//TODO Link for not logged user
function notLogged(){
  return(
    <>
      <Row>
        <Col>
          <h1>ERROR 401: Not Authorized</h1>
          <p>Need to be logged in to access this page</p>
          <Button>
            LOGIN
          </Button>
        </Col>
      </Row>
    </>
  );  
}

function CourseRoute(props){
    return(
        <>
          <Row>
            <Col>
              <h1 className = 'title-table'>Courses</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <CourseTable courses={props.courses} />
            </Col>
          </Row>
        </>
      );
}

function LoginRoute(props){
  return(
    <>
      <Row>
        <Col>
          <h1 className = 'title-table'>Login</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <LoginForm login={props.login} />
        </Col>
      </Row>
    </>
  )
}

function StudyPlanRoute(props){
  //console.log(props.studyPlan);
  return(
      <>
        <Row>
          <Col>
            <h1 className = 'title-table'>Study Plan</h1>
          </Col>
        </Row>
        <Row>
         <Col>
            {props.studyPlan ? 
              <StudyPlanTable studyPlan={props.studyPlan} deleteCourse = {props.deleteCourse}/> :
              <Button>NEW STUDY PLAN</Button>
            }
            
          </Col>
        </Row>      
        <Row>
          <Col>
            <h1 className = 'title-table'>Courses</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <CourseTable courses={props.courses} />
          </Col>
        </Row>

      </>
    );
}

export {DefaultRoute, CourseRoute, LoginRoute,StudyPlanRoute };