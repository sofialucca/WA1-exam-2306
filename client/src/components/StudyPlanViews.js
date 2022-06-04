import { Row, Col } from 'react-bootstrap';

import CourseTable from './CourseTable.js';
import { LoginForm } from './AuthComponents';

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

export {DefaultRoute, CourseRoute, LoginRoute};