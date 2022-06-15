"use strict";

import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function LoginForm(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };
    const result = props.login(credentials);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="username">
        <Form.Label>email</Form.Label>
        <Form.Control
          type="email"
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
          required={true}
        />
      </Form.Group>

      <Form.Group controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          required={true}
          minLength={6}
        />
      </Form.Group>

      <Button className="btn-purple" variant="" type="submit">
        LOGIN
      </Button>
    </Form>
  );
}

function LogoutButton(props) {
  return (
    <Row>
      <Col>
        <Button variant="outline-danger" onClick={props.logout}>
          LOGOUT
        </Button>
      </Col>
    </Row>
  );
}

function LogoutIcon(props) {
  return (
    <Button className="pb-3" variant="link" size="sm">
      <i
        className="bi bi bi-box-arrow-right text-white "
        role="img"
        alt="logo logout"
        onClick={props.logout}
      />
    </Button>
  );
}

export { LoginForm, LogoutButton, LogoutIcon };
