
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Navbar, Form, FormControl, Button } from 'react-bootstrap';
import {Link} from 'react-router-dom';

function NavbarStudyPlan(props) {
    return (
        <Navbar className="NavBar justify-content-between text-white" >
            <Navbar.Toggle className="navbar-dark" />
            <i className = "bi bi-journals fs-2"/>
            <Navbar.Brand href="/">
                <label className='title-nav text-white vertical-centered'>
                {(props.user !== null ? props.user.name + " " : "")}Study Plan
                </label>
            </Navbar.Brand>
            <Navbar.Text>
                <span className = "text-white vertical-centered ">
                   {(props.user !== null ? "Hi: " + props.user.name : "")} 
                </span>
                &nbsp;
                {props.user === null ?
                    (<Link to = '/login' className = "text-light">
                        <i className="bi bi-person-circle fs-2 not-logged-icon" role="img" alt="logo user" />
                    </Link>)
                    :(<Link to = "/logout" className = "text-light">
                        <i className="bi bi-person-circle fs-2" role="img" alt="logo user" />
                    </Link> )              
                }
                
            </Navbar.Text>

        </Navbar>
    );
}

export {NavbarStudyPlan};