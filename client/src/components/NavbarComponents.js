
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
                <label className='title-nav text-white vertical-centered'>Study Plan</label>
            </Navbar.Brand>
            <Link to = '/login'>
                <i className="bi bi-person-circle fs-2" role="img" alt="logo user" />
            </Link>
        </Navbar>
    );
}

export {NavbarStudyPlan};