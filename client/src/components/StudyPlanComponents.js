import "bootstrap-icons/font/bootstrap-icons.css";
import { Table, Col, Button, Row, Form } from "react-bootstrap";
import { useState } from "react";
import StudyPlanInfos from "./StudyPlanInfos";

function StudyPlanForm(props) {
  return (
    <>
      <StudyPlanInfos studyPlan={props.studyPlan} />

      <Row>
        <Col>
          <Button
            variant="outline-success"
            onClick={() => props.saveStudyPlan()}
          >
            SAVE
          </Button>
        </Col>
        <Col>
          <Button variant="outline-warning" onClick={() => props.cancelEdit()}>
            CANCEL
          </Button>
        </Col>
        <Col>
          <Button
            variant="outline-danger"
            onClick={() => props.deleteStudyPlan()}
          >
            DELETE
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default StudyPlanForm;
