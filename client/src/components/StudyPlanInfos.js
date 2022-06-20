import "bootstrap-icons/font/bootstrap-icons.css";
import { Table, Col, Row } from "react-bootstrap";

function StudyPlanInfos(props) {
  return (
    <>
      <Row>
        <p>Type of studies: <u className = " text-capitalize fw-bold">{props.studyPlan.type}</u></p>
      </Row>
      <Row className = "mb-3">
        <Col>
          Minimum credits required:{" "}
          {props.studyPlan.minCredits}
        </Col>
        <Col>
          Maximum credits available:{" "} 
          {props.studyPlan.maxCredits}
        </Col>
      </Row>
      {props.studyPlan.courses.length ? (
        <StudyPlanTable {...props} />
      ) : (
        <Col sm = {{span:4, offset:4}} className = "rounded font-italic border border-2 border-warning fw-bold py-2">
            NO COURSES 
        </Col>
      )}
      <Col className = "my-3">Total credits: {" "} <span className = {props.studyPlan.neededCredits() < 0 ? "text-warning" : "text-success"}>{props.studyPlan.totalCredits}</span></Col>
    </>
  );
}

function StudyPlanTable(props) {
  return (
    <Table borderless>
      <thead>
        <tr>
          <th>Code</th>
          <th>Course Name</th>
          <th>Credits</th>
        </tr>
      </thead>
      <tbody>
        {props.studyPlan.courses.map((c) => (
          <CourseRowStudyPlan course={c} key={`course-${c.code}-studyplan`} />
        ))}
      </tbody>
    </Table>
  );
}

function CourseRowStudyPlan(props) {
  return (
    <tr className="row-separation">
      <td>{props.course.code}</td>
      <td>{props.course.name}</td>
      <td>{props.course.credits}</td>
    </tr>
  );
}


export default StudyPlanInfos;
