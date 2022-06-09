'use strict';

import { useState } from 'react';
import {Form, Button, Row, Col} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
      event.preventDefault();
      const credentials = { username, password };
      const result = props.login(credentials);
      if(result)
        navigate('/');
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId='username'>
          <Form.Label>email</Form.Label>
          <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} required={true} />
      </Form.Group>

      <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} required={true} minLength={6}/>
      </Form.Group>

      <Button type="submit">Login</Button>
  </Form>
  )
};

function LogoutButton(props) {
  return(
    <Row>
      <Col>
        <Button variant="outline-primary" onClick={() => {props.logout()}}>Logout</Button>
      </Col>
    </Row>
  )
}

export { LoginForm, LogoutButton };