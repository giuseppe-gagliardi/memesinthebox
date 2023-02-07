import 'bootstrap/dist/css/bootstrap.min.css';
import { Nav, Navbar } from 'react-bootstrap';
import { LogoutButton, LoginButton, ModalLogin } from './loginComponents'
import { useState } from 'react'


function MemeNavbar(props) {
    const [show, setShow] = useState(false);

    return (
        <>
            <Navbar bg="info" expand="lg">
                <Navbar.Brand href="/">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" fill="white" className="bi bi-box-seam  inline" style={{ paddingRight: "4px", verticalAlign: "center" }} viewBox="0 0 16 16">
                        <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2l-2.218-.887zm3.564 1.426L5.596 5 8 5.961 14.154 3.5l-2.404-.961zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z" />
                    </svg>
                    <div className="d-inline-block" >
                        <p style={{ marginBottom: "0px" }} className="inline text-white">Memes in the box</p>
                    </div>
                </Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav">

                </Navbar.Collapse>
                <Nav.Item className='text-white text-right'>
                    {props.message}
                </Nav.Item>
                <Nav.Item>
                    {
                        props.loggedIn ?
                            <LogoutButton logout={props.doLogOut} />
                            :
                            <LoginButton setShow={setShow} show={show} />
                    }
                </Nav.Item>
                <Nav.Item>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" fill="white" className="bi bi-person-square mr-3" style={{ paddingRight: "8px" }} viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12z" />
                    </svg>
                </Nav.Item>

            </Navbar>

            <ModalLogin show={show} onHide={setShow} login={props.doLogIn} />
        </>
    );
}

export { MemeNavbar };