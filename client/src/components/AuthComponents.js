import { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";


function LoginForm(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };
    props.login(credentials);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group as = {Row} controlId="username">
        <Form.Label column sm = {6}>Email</Form.Label>
        <Col sm = {4}>
          <Form.Control
            type="email"
            value={username}
            onChange={(ev) => setUsername(ev.target.value)}
            required={true}
            
          />
        </Col>

      </Form.Group>

      <Form.Group as = {Row} controlId="password" className = "mt-4">
        <Form.Label column sm = {6}>Password</Form.Label>
        <Col sm = {4}>
          <Form.Control
            type="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            required={true}
            minLength={6}
          />          
        </Col>

      </Form.Group>

      <Button className="btn-purple mt-5" variant="" type="submit">
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
    <Button className="pb-3" variant="link" size="sm" onClick={props.logout}>
      <i
        className="bi bi bi-box-arrow-right text-white "
        role="img"
        alt="logo logout"
        
      />
    </Button>
  );
}

export { LoginForm, LogoutButton, LogoutIcon };
