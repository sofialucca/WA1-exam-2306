import "bootstrap-icons/font/bootstrap-icons.css";
import { Table, Col, Button } from "react-bootstrap";
import { useState, useEffect } from "react";

function CourseTableForm(props) {
  return (
    <>
      <Table borderless>
        <thead>
          <tr>
            <th>Actions</th>
            <th>Code</th>
            <th>Course Name</th>
            <th>Credits</th>
            <th>Enrolled Students</th>
            <th>Maximum possible enrolled students</th>
          </tr>
        </thead>
        <tbody>
          {props.courses ? (
            props.courses.map((c) => (
              <CourseRow
                deleteCourse={props.deleteCourse}
                addCourseStudyPlan={props.addCourseStudyPlan}
                studyPlan={props.studyPlan}
                course={c}
                key={`course-${c.code}`}
              />
            ))
          ) : (
            <></>
          )}
        </tbody>
      </Table>
    </>
  );
}

function CourseRow(props) {
  const [expanded, setExpanded] = useState(false);
  const [deleteLimitations, setDeleteLimitations] = useState([]);
  const [addLimitations, setAddLimitations] = useState([]);
  const [needPreparatory, setNeedPreparatory] = useState(false);
  const [isEnabled, setEnabled] = useState(true);
  const showInfoCourse = () => {
    setExpanded((oldStatus) => !oldStatus);
  };

  useEffect(() => {
    setEnabled(true);
    
    //check if exam can be deleted
    if (
      props.studyPlan &&
      props.studyPlan.isInPlan(props.course.code) &&
      props.studyPlan.isDeletable(props.course.code).length
    ) {
      setDeleteLimitations([...props.studyPlan.isDeletable(props.course.code)]);
      setEnabled(false);
    }

    //check if preparatory in plan
    if (props.studyPlan && !props.studyPlan.isInPlan(props.course.code)) {
      if (
        props.course.preparatory &&
        !props.studyPlan.isInPlan(props.course.preparatory)
      ) {
        setNeedPreparatory(true);
        setEnabled(false);
      }
    }

    //check if in plan there are incompatible exams
    if (
      props.studyPlan &&
      !props.studyPlan.isInPlan(props.course.code) &&
      props.studyPlan.isIncompatible(props.course.code).length
    ) {
      setAddLimitations([...props.studyPlan.isIncompatible(props.course.code)]);
      setEnabled(false);
    }

    //check if #credits for studyplan
    if (
      props.studyPlan &&
      !props.studyPlan.isInPlan(props.course.code) &&
      props.studyPlan.tooManyCredits(props.course)
    ) {
      setEnabled(false);
    }
    if (
      props.studyPlan &&
      !props.studyPlan.isInPlan(props.course.code) &&
      props.course.isFull()
    ) {
      setEnabled(false);
    }
  }, [props.studyPlan.courses]);

  return (
    <>
      <tr
        className={`${expanded || !isEnabled ? "" : "row-separation"}`}
        key={`course-${props.course.code}-infos`}
      >
        <CourseAction
          className={!isEnabled ? "bg-secondary" : ""}
          isDisabled={!isEnabled}
          course={props.course}
          studyPlan={props.studyPlan}
          deleteCourse={props.deleteCourse}
          addCourseStudyPlan={props.addCourseStudyPlan}
        />
        <CourseData course={props.course} />
        <td colSpan={7}>
          <Button
            variant="outline-white"
            className="button-course"
            onClick={showInfoCourse}
          >
            <i
              className={`bi bi-caret-${expanded ? "up-fill" : "down-fill"}`}
            />
          </Button>
        </td>
      </tr>
      <tr
        className={`border-3 border-warning ${!isEnabled ? "" : "d-none"} `}
        key={`course-${props.course.code}-limitations`}
      >
        <td colSpan={7}>
          {deleteLimitations.length !== 0 ? (
            <p>
              {props.course.name} is preparatory for
              {deleteLimitations.map((c) => (
                <>
                  <br />
                  {c.code} - {c.name}
                </>
              ))}
            </p>
          ) : (
            <></>
          )}
          {addLimitations.length !== 0 ? (
            <p>
              {props.course.name} is incompatible with:
              {addLimitations.map((c) => (
                <>
                  <br />
                  {c.code} - {c.name}
                </>
              ))}
            </p>
          ) : (
            <></>
          )}
          {needPreparatory ? (
            <p>
              {props.course.name} needs in the study plan:{" "}
              {props.course.preparatory}
            </p>
          ) : (
            <></>
          )}
          {props.studyPlan &&
          !props.studyPlan.isInPlan(props.course.code) &&
          props.course.isFull() ? (
            <p>{props.course.name} is full</p>
          ) : (
            <></>
          )}
          {props.studyPlan &&
          !props.studyPlan.isInPlan(props.course.code) &&
          props.studyPlan.tooManyCredits(props.course) ? (
            <p>
              {props.course.name} has too many credits for this study plan
              <br />
              Available credits for your studyplan:{" "}
              {props.studyPlan.availableCredits}
            </p>
          ) : (
            <></>
          )}
        </td>
      </tr>
      <tr
        className={expanded ? "row-separation" : "d-none"}
        key={`course-${props.course.code}-description`}
      >
        <CourseDescription course={props.course} />
      </tr>
    </>
  );
}
function CourseAction(props) {
  return (
    <td>
      {/*
            (props.studyPlan && props.studyPlan.isInPlan(props.course.code)) ?*/}
      <>
        <Button
          className={
            props.studyPlan.isInPlan(props.course.code) ? "" : "d-none"
          }
          disabled={props.isDisabled}
          variant="outline-danger"
          onClick={() => {
            props.deleteCourse(props.course);
          }}
        >
          <i className="bi bi-trash3"></i>
        </Button>
      </>
      <>
        <Button
          className={
            !props.studyPlan.isInPlan(props.course.code) ? "" : "d-none"
          }
          disabled={props.isDisabled}
          variant="outline-success"
          onClick={() => {
            props.addCourseStudyPlan(props.course);
          }}
        >
          <i className="bi bi-check-lg"></i>
        </Button>
      </>
    </td>
  );
}
function CourseData(props) {
  return (
    <>
      <td>{props.course.code}</td>
      <td>{props.course.name}</td>
      <td>{props.course.credits}</td>
      <td className={props.course.isFull() ? "text-danger" : "text-success"}>
        {props.course.signedStudents}
      </td>
      <td>
        {props.course.maxStudents != null ? props.course.maxStudents : "-"}
      </td>
    </>
  );
}

function CourseDescription(props) {
  return (
    <>
      <td colSpan="3" className="text-start">
        {props.course.printIncompatible()}
      </td>
      <td colSpan="4" className="text-end">
        {props.course.printPreparatory()}
      </td>
    </>
  );
}

export default CourseTableForm;
