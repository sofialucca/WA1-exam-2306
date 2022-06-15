import "bootstrap-icons/font/bootstrap-icons.css";
import { Table, Col, Button, Row, Form } from "react-bootstrap";
import { useState } from "react";

function StudyPlanCreator(props) {
  const [type, setType] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    props.createStudyPlan(type);
  };
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Label>Select a type of study plan:</Form.Label>
      <div key="default-radio" className="mb-3">
        <Form.Check
          type="radio"
          id="default-radio-full"
          label="Full-time"
          name="type-plan"
          onClick={() => {
            setType("full-time");
          }}
        />

        <Form.Check
          type="radio"
          id="default-radio-part"
          label="Part-time"
          name="type-plan"
          onClick={() => {
            setType("part-time");
          }}
        />
      </div>

      <Button
        className="btn-purple"
        variant=""
        type="submit"
        disabled={type === "" ? true : false}
      >
        CREATE
      </Button>
    </Form>
  );
}

export default StudyPlanCreator;
