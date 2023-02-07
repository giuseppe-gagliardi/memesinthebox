import { useState } from 'react';
import { Form, Button, Col, Modal, FormControl } from 'react-bootstrap';

function LogoutButton(props) {
    return (
        <Col>
            <Button variant="outline-info" className="myButtonLog" onClick={props.logout}>Logout</Button>
        </Col>
    )
}

function LoginButton(props) {
    return (
        <Col>
            <Button variant="info" className="myButtonLog" onClick={() => { props.setShow(true); }}> Login </Button>
        </Col>
    );
}

function ModalLogin(props) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(false);

    const handleClose = (event)=>{
        event.preventDefault();
        setErrorMessage(false);
        props.onHide(false);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        const credentials = { username, password };
        // SOME VALIDATION
        let valid = true;
        if (!username.match(/^[a-zA-Z0-9.]+$/g) || password === '')
            valid = false;

        if (valid){
            props.login(credentials).then((user)=>{if(user) props.onHide(false); else setErrorMessage('Invalid username or password.');});
        }
        else {
            // show a better error message...
            setErrorMessage('Invalid username or password.')
        }
    };

    return (
        <>
            <Modal show={props.show} >
                <Modal.Header >
                    <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" value={username} onChange={(e) => { e.preventDefault(); setUsername(e.target.value) }} onKeyPress={(e) => {
                                if (e.key === 'Enter')
                                    e.preventDefault();
                            }} required >
                            </Form.Control>
                            <Form.Label style={{ marginTop: "10px" }}>Password</Form.Label>
                            <FormControl type="password" value={password} onChange={(e) => { e.preventDefault(); setPassword(e.target.value) }} onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }} required />
                            {errorMessage ? <p className="text-danger">{errorMessage} </p> : null}
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={(e)=>{handleClose(e)}}>Close</Button>
                    <Button variant="info" onClick={(e) => { handleSubmit(e) }}>Login</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export { LogoutButton, LoginButton, ModalLogin }