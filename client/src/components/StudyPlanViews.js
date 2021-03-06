import { Row, Col } from "react-bootstrap";

import CourseTable from "./CourseTable.js";
import { LoginForm, LogoutButton } from "./AuthComponents";
import StudyPlanForm from "./StudyPlanForm.js";
import StudyPlanCreator from "./StudyPlanCreator.js";
import StudyPlanInfos from "./StudyPlanInfos";
import CourseTableForm from "./CourseTableForm.js";
function DefaultRoute() {
  return (
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

function LogoutRoute(props) {
  return (
    <>
      <Row>
        <Col>
          <h1 className="title-table">{props.user.name}'s Study Plan</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          {props.studyPlan ? (
            <StudyPlanInfos studyPlan={props.studyPlan} />
          ) : (
            <Col sm = {{span:4, offset:4}} className = "font-italic border border-2 border-warning fw-bold py-2 mb-3 rounded">
              NO StudyPlan Defined 
            </Col>
          )}

          <LogoutButton logout={props.logout} />
        </Col>
      </Row>
    </>
  );
}

function CourseRoute(props) {
  return (
    <>
      <Row>
        <Col>
          <h1 className="title-table">Courses</h1>
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

function LoginRoute(props) {
  return (
    <>
      <Row>
        <Col>
          <h1 className="title-table">Login</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <LoginForm login={props.login} loggedIn={props.loggedIn} />
        </Col>
      </Row>
    </>
  );
}

function StudyPlanRoute(props) {
  return (
    <>
      <Row>
        <Col>
          <h1 className="title-table"> {props.studyPlan !== null ? "Edit " : "Create "} Study Plan</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          {props.studyPlan !== null ? (
            <StudyPlanForm
              studyPlan={props.studyPlan}
              deleteCourse={props.deleteCourse}
              cancelEdit={props.cancelEdit}
              deleteStudyPlan={props.deleteStudyPlan}
              saveStudyPlan={props.saveStudyPlan}
            />
          ) : (
            <StudyPlanCreator createStudyPlan={props.createStudyPlan} />
          )}
        </Col>
      </Row>
      <Row>
        <Col className = "mt-4">
          <h2 className="title-table sub-title">Courses</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          {props.studyPlan ? (
            <CourseTableForm
              courses={props.courses}
              studyPlan={props.studyPlan}
              deleteCourse={props.deleteCourse}
              addCourseStudyPlan={props.addCourseStudyPlan}
            />
          ) : (
            <CourseTable courses={props.courses} />
          )}
        </Col>
      </Row>
    </>
  );
}

export { DefaultRoute, CourseRoute, LoginRoute, StudyPlanRoute, LogoutRoute };
