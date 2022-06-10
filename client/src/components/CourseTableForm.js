import 'bootstrap-icons/font/bootstrap-icons.css';
import { Table, Col, Button } from 'react-bootstrap';
import  {useState, useEffect} from 'react';

function CourseTableForm(props) {
  return(<>
      <Table borderless >
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
          {
            props.courses.map((c) => 
              <CourseRow 
              deleteCourse = {props.deleteCourse} 
              addCourseStudyPlan = {props.addCourseStudyPlan}
              studyPlan = {props.studyPlan} 
              course={c} 
              key={`course-${c.code}`}/>)
          }
        </tbody>
      </Table>
    </>
  );
}

function CourseRow(props) {
    const [expanded, setExpanded] = useState(false);
    const [deleteLimitations, setDeleteLimitations] = useState([]);
    const [addLimitations, setAddLimitations] = useState([]);
    const showInfoCourse = () => {
        setExpanded(oldStatus => !oldStatus);
    }
    /*
    const printDeleteLimitations= () => {
      if(deleteLimitations.length > 1)
        return(
        <ul>
          {deleteLimitations.map(c => <li key = {c.code}>{c.code} - {c.name}</li>)}
        </ul>)
      return(
        <span>
          {deleteLimitations[0].code - deleteLimitations[0].name}
        </span>
      )                     

    }*/
    useEffect(() => {
      
      if(props.studyPlan && props.studyPlan.isInPlan(props.course.code)){
        setDeleteLimitations([...props.studyPlan.isDeletable(props.course.code)]);
      }

      if(props.StudyPlan && !props.StudyPlan.isInPlan(props.course.code)){
        console.log(props.studyPlan.isIncompatible("ciao" + props.course.code));  
        setAddLimitations([...props.studyPlan.isIncompatible(props.course.code)]);
        
      }
      
    },[props.studyPlan])
    
    return(
        <>
            <tr className = {(expanded || deleteLimitations.length)? "":"row-separation"}>
                <CourseAction isDeletable = {deleteLimitations.length} isAddable = {addLimitations.length} course = {props.course} studyPlan = {props.studyPlan} deleteCourse = {props.deleteCourse} addCourseStudyPlan = {props.addCourseStudyPlan}/>
                <CourseData course={props.course}/>
                <td>
                  <Button variant = "outline-white" className = "button-course"  onClick = {showInfoCourse}>
                      <i className = {`bi bi-caret-${expanded ? 'up-fill' : 'down-fill' }`}/>
                  </Button>                    
                </td>
   
            </tr>

              {
                (deleteLimitations.length !== 0) ?
                (<tr className = {(expanded)? "":"row-separation"}>
                  <td colSpan = "7">
                    {props.course.name} is preparatory for <br/>
                    <ul>
                      {deleteLimitations.map(c => <li key = {c.code}>{c.code} - {c.name}</li>)}
                    </ul>
                  </td>
                </tr>):(<></>)
              }
            
            <tr className = {expanded? "row-separation":"d-none"}>
                <CourseDescription course={props.course} />   
            </tr>                   
        </>

    );
}
function CourseAction(props){
    //console.log(props.studyPlan);
    return(
      <td >
        {
            (props.studyPlan && props.studyPlan.isInPlan(props.course.code)) ?
            <>
                <Button disabled = {props.isDeletable} variant='outline-danger' onClick={() => {props.deleteCourse(props.course)}}>
                    <i className='bi bi-trash3'></i>
                </Button>                
            </>
            :<>
                <Button disabled = {props.isAddable} variant='outline-success' onClick = {() => {props.addCourseStudyPlan(props.course)}} >
                    <i className='bi bi-check-lg'></i>
                </Button>                   
            </>
        }

      </td>
    )  
  }
function CourseData(props) {
  return(
    <>
      <td>{props.course.code}</td>
      <td>{props.course.name}</td>
      <td>{props.course.credits}</td>
      <td className = {props.course.isFull() ? "text-danger":"text-success"}>{props.course.signedStudents}</td>
      <td>{props.course.maxStudents != null ? props.course.maxStudents : '-'}</td>
    </>
  );
}

function CourseDescription(props){
    return(
      <>
        <td colSpan = "3" className = "text-start">
          {props.course.printIncompatible()}
        </td>
        <td colSpan = "4" className = "text-end">
          {props.course.printPreparatory()}
        </td>
      </>        
    )
}

export default CourseTableForm;