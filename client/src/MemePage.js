import { useState, useEffect } from 'react';
import { Alert, Col, Container, ListGroup, Row, Button, ButtonGroup, Modal, Form, } from 'react-bootstrap';
import { BrowserRouter as Router, NavLink, Redirect, Route, Switch, useLocation, } from 'react-router-dom';
import API from './API'

const backgrounds = ["futurama_fry", "one_does_not_simply", "marked_safe_from", "goosebumps", "hide_the_pain", "if_i_had_one"];
const fonts = ["meme-font", "arial"];
const colors = ["white", "black", "yellow", "red"];
function MemePage(props) {

    const [memes, setMemes] = useState([]);
    const [dirty, setDirty] = useState(false);

    async function _getAllMemes() {
        const data = await API.getAllMemes();
        setMemes(data);
    }

    useEffect(() => {
        if (dirty) {
            _getAllMemes();
            setDirty(false);
        }
    }, [dirty]);

    useEffect(() => {
        _getAllMemes();
    }, []);

    const addMeme = (m) => {
        async function addMemeHandler() {
            m.id = memes.map((m) => m.id).reduce((id1, id2) => id1 > id2 ? id1 : id2, 0) + 1;
            API.addMemeDb(m).then(setDirty(true));
        }
        addMemeHandler();
    };

    const deleteMeme = (id) => {
        async function deleteMemeHandler() {
            API.deleteMemeDb(id).then(setDirty(true));
        }
        deleteMemeHandler();
    };

    return (
        <Router>
            <Switch>
                <Route exact path="/" render={() =>
                    <Row>
                        <MemeSidebar loggedIn={props.loggedIn}></MemeSidebar>
                        <Col md={9} style={{ paddingLeft: "10px" }} >
                            <Container fluid style={{ paddingLeft: "0px" }} >
                                <h2>All Memes</h2>
                                {memes.map((meme) => {
                                    if (meme.visibility || props.loggedIn)
                                        return (
                                            <div key={`allmemes-${meme.id}`}>
                                                <div className={meme.image} style={{ marginLeft: "0px" }} key={`all-${meme.id}`}>
                                                    {meme.top ? <p className={`${meme.font}-${meme.color} top`} key={`all-top-${meme.id}`}>{meme.top}</p> : ""}
                                                    {meme.center ? <p className={`${meme.font}-${meme.color} center`} key={`all-center-${meme.id}`}>{meme.center}</p> : ""}
                                                    {meme.bottom ? <p className={`${meme.font}-${meme.color} bottom`} key={`all-bottom-${meme.id}`}>{meme.bottom}</p> : ""}
                                                </div>
                                                <ButtonGroup style={{ marginBottom: "10px" }} key={`all-bg-${meme.id}`}>
                                                    <ButtonMod loggedIn={props.loggedIn} meme={meme} image="" addMeme={addMeme} key={`all-mod-${meme.id}`} />
                                                    <ButtonProps meme={meme} key={`all-props-${meme.id}`} />
                                                    <ButtonDelete meme={meme} deleteMeme={deleteMeme} loggedIn={props.loggedIn} key={`all-del-${meme.id}`} />
                                                </ButtonGroup>
                                            </div>
                                        );
                                    else return "";
                                })}
                            </Container>
                        </Col>
                    </Row >
                } />
                <Route exact path="/create" render={() =>
                    <Row>
                        <MemeSidebar loggedIn={props.loggedIn} ></MemeSidebar>
                        {props.loggedIn ?
                            <Col md={9} style={{ paddingLeft: "10px" }} >
                                <Container fluid style={{ paddingLeft: "0px" }} >
                                    <h2>Create a new meme</h2>
                                    {backgrounds.map((image) => {
                                        if (props.loggedIn)
                                            return (
                                                <div key={`creatememes-${image}`}>
                                                    <div className={image} style={{ marginLeft: "0px" }} key={`create-${image}`}></div>
                                                    <ButtonGroup style={{ marginBottom: "10px" }} key={`bg-${image}`}>
                                                        <ButtonMod loggedIn={props.loggedIn} meme="" image={image} addMeme={addMeme} key={`mod-${image}`} />
                                                    </ButtonGroup>
                                                </div>
                                            );
                                        else return "";
                                    })}
                                </Container>
                            </Col> : <Alert style={{ marginTop: "4px" }} variant='danger'> You are not logged in, please login and try again</Alert>}
                    </Row >
                } />
                <Route exact path="/mymemes" render={() =>
                    <Row>
                        <MemeSidebar loggedIn={props.loggedIn}></MemeSidebar>
                        {props.loggedIn ?
                            <Col md={9} style={{ paddingLeft: "10px" }}>
                                <Container fluid style={{ paddingLeft: "0px" }}>
                                    <h2>My Memes</h2>
                                    {memes.map((meme) => {
                                        if (meme.creator === props.loggedIn.id)
                                            return (
                                                <div key={`mymemes-${meme.id}`}>
                                                    <div className={meme.image} style={{ marginLeft: "0px" }} key={`my-${meme.id}`}>
                                                        {meme.top ? <p className={`${meme.font}-${meme.color} top`} key={`my-top-${meme.id}`}>{meme.top}</p> : ""}
                                                        {meme.center ? <p className={`${meme.font}-${meme.color} center`} key={`my-center-${meme.id}`}>{meme.center} </p> : ""}
                                                        {meme.bottom ? <p className={`${meme.font}-${meme.color} bottom`} key={`my-bottom-${meme.id}`}>{meme.bottom} </p> : ""}
                                                    </div>
                                                    <ButtonGroup style={{ marginBottom: "10px" }} key={`my-bg-${meme.id}`}>
                                                        <ButtonMod loggedIn={props.loggedIn} meme={meme} image="" addMeme={addMeme} key={`my-mod-${meme.id}`} />
                                                        <ButtonProps meme={meme} key={`my-props-${meme.id}`} />
                                                        <ButtonDelete meme={meme} deleteMeme={deleteMeme} loggedIn={props.loggedIn} key={`my-del-${meme.id}`} />
                                                    </ButtonGroup>
                                                </div>
                                            );
                                        else return "";
                                    })}
                                </Container>
                            </Col> : <> <Alert style={{ marginTop: "4px" }} variant='danger'> You are not logged in, please login and try again</Alert></>}
                    </Row >
                } />
                <Route path="/:something" render={() => <>
                    <Redirect to="/"></Redirect>
                </>
                }>
                </Route>
            </Switch>
        </Router >
    )
}

function MemeSidebar(props) {

    return (
        <Col md={3} style={{ paddingRight: "5px" }}>
            <ListGroup style={{ paddingTop: "14px" }}>
                <NavLink to="/" className='list-group-item' activeClassName='active' exact key="allmemes">
                    All Memes
                </NavLink>
                {props.loggedIn ?
                    <>
                        <NavLink to="/mymemes" className='list-group-item' activeClassName='active' exact key="mymemes">
                            My Memes
                        </NavLink>
                        <NavLink to="/create" className='list-group-item' activeClassName='active' exact key="creatememes">
                            Create a Meme
                        </NavLink>
                    </>
                    :
                    ""
                }
            </ListGroup>

        </Col>
    );
}

function ButtonProps(props) {
    const [showProps, setShowProps] = useState(false);
    const handleClose = () => setShowProps(false);

    return (<>
        <Button className="myButtonSel" variant="info" onClick={() => { setShowProps(props.meme.id) }}>Props</Button>
        <Modal show={props.meme.id === showProps} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Meme's Props</Modal.Title>
            </Modal.Header>
            <Modal.Body>Id: {props.meme.id}<br />Title: {props.meme.title}<br />Image: {props.meme.image}<br />Font: {props.meme.font}<br />Color: {props.meme.color}<br />Visibility: {props.meme.visibility ? <>public</> : <>protected</>}<br />Creator: {props.meme.creator}<br />
            Sentences<br />
                <ul className="shift">
                    <li key={"top-prop"}>top: {props.meme.top ? props.meme.top : "none"}</li>
                    <li key={"center-prop"}>center: {props.meme.center ? props.meme.center : "none"}</li>
                    <li key={"bottom-prop"}>bottom: {props.meme.bottom ? props.meme.bottom : "none"}</li>
                </ul>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
            </Modal.Footer>
        </Modal>
    </>
    );
}
function ButtonDelete(props) {
    const [showDel, setShowDel] = useState(false);
    const location = useLocation();
    const handleClose = () => setShowDel(false);
    const handleShow = () => setShowDel(true);

    return (
        <>
            <Button className="myButtonSel" variant="danger" disabled={!(props.meme.creator === props.loggedIn.id)} key={`del-${props.meme.id}-${location.pathname}`} onClick={handleShow} >Delete</Button>

            <Modal show={showDel} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Attention!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to permanently delete this meme?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
            </Button>
                    <Button variant="danger" onClick={() => { props.deleteMeme(props.meme.id); handleClose(); }}>
                        Yes, delete it
            </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
function ButtonMod(props) {
    const location = useLocation();
    const [showMod, setShowMod] = useState(false);
    const [title, setTitle] = useState(location.pathname === "/create" ? "" : props.meme.title);
    const [image, setImage] = useState(location.pathname === "/create" ? props.image : props.meme.image);
    const [top, setTop] = useState(location.pathname === "/create" ? "" : props.meme.top);
    const [center, setCenter] = useState(location.pathname === "/create" ? "" : props.meme.center);
    const [bottom, setBottom] = useState(location.pathname === "/create" ? "" : props.meme.bottom);
    const [font, setFont] = useState(location.pathname === "/create" ? "" : props.meme.font);
    const [color, setColor] = useState(location.pathname === "/create" ? "" : props.meme.color);
    const [visibility, setVisibility] = useState(location.pathname === "/create" ? 1 : props.meme.visibility);

    const [errorT, setErrorT] = useState(false);
    const [errorF, setErrorF] = useState(false);
    const [errorC, setErrorC] = useState(false);
    const [errorI, setErrorI] = useState(false);

    const resizing = { "futurama_fry": 349, "one_does_not_simply": 273, "marked_safe_from": 305, "goosebumps": 466, "hide_the_pain": 585, "if_i_had_one": 650 };
    const available_fields = { "futurama_fry": { top: true, center: false, bottom: true }, "one_does_not_simply": { top: true, center: false, bottom: true }, "marked_safe_from": { top: false, center: true, bottom: false }, "goosebumps": { top: false, center: true, bottom: false }, "hide_the_pain": { top: true, center: true, bottom: true }, "if_i_had_one": { top: true, center: true, bottom: true } };

    useEffect(() => {
        setTitle(location.pathname === "/create" ? "" : props.meme.title);
        setImage(location.pathname === "/create" ? props.image : props.meme.image);
        setTop(location.pathname === "/create" ? "" : props.meme.top);
        setCenter(location.pathname === "/create" ? "" : props.meme.center);
        setBottom(location.pathname === "/create" ? "" : props.meme.bottom);
        setFont(location.pathname === "/create" ? "" : props.meme.font);
        setColor(location.pathname === "/create" ? "" : props.meme.color)
        setVisibility(location.pathname === "/create" ? 1 : props.meme.visibility);
    }, [location.pathname, props.image, props.meme, props.loggedIn])

    const check = (meme) => {
        let flag = true;
        if (meme.title === '') {
            setErrorT(true);
            flag = false;
        } else setErrorT(false);
        if (meme.image === '') {
            setErrorI(true);
            flag = false;
        } else setErrorI(false);
        if (meme.font === '') {
            setErrorF(true);
            flag = false;
        } else setErrorF(false);
        if (meme.color === '') {
            setErrorC(true);
            flag = false;
        } else setErrorC(false);

        return flag;
    }

    const handleClose = () => setShowMod(false);
    const handleSave = () => {
        const m = { id: "", title: title, image: image, top: top, center: center, bottom: bottom, font: font, color: color, visibility: visibility, creator: props.loggedIn.id };
        if (check(m)) {
            props.addMeme(m);
            setShowMod(false);
        }
    }
    return (<>
        <Button className="myButtonSel" disabled={!props.loggedIn} variant="info" onClick={() => { setShowMod(location.pathname === "/create" ? props.image : props.meme.id) }} key={`mod-${props.meme ? props.meme.id : props.image}-${location.pathname}`}>{location.pathname === "/create" ? "Create" : "Copy"}</Button>
        <Modal show={showMod ? true : false} onHide={handleClose}>
            <Modal.Header closeButton style={{ padding: "8px 16px" }}>
                <Modal.Title>Meme's Props</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ paddingBottom: "0px" }}>
                <Form>
                    <Row>
                        <Col>
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" value={title} placeholder="Insert a title" onChange={(e) => { e.preventDefault(); setTitle(e.target.value); if (errorT) setErrorT(false); }} onKeyPress={(e) => {
                                if (e.key === 'Enter')
                                    e.preventDefault();
                            }} required >
                            </Form.Control>
                            {errorT ? <p className="text-danger">Error: title is required. </p> : null}
                        </Col>
                        <Col>
                            <Form.Group controlId='selectedCourse'>
                                <Form.Label>Image</Form.Label>
                                <Form.Control as="select" value={image} onChange={e => { setImage(e.target.value); if (errorI) setErrorI(false); }} disabled={!props.image}>
                                    <option disabled value=''>Choose an image...</option>
                                    {backgrounds.map(im => <option key={im} value={im} >{im} </option>)}
                                </Form.Control>
                                {errorI ? <p className="text-danger">Error: font is required. </p> : null}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId='selectedCourse'>
                                <Form.Label>Font</Form.Label>
                                <Form.Control as="select" value={font} onChange={e => { setFont(e.target.value); if (errorF) setErrorF(false); }}>
                                    <option disabled value=''>Choose a font...</option>
                                    {fonts.map(f => <option key={f} value={f} >{f} </option>)}
                                </Form.Control>
                                {errorF ? <p className="text-danger">Error: font is required. </p> : null}
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId='selectedCourse'>
                                <Form.Label>Color</Form.Label>
                                <Form.Control as="select" value={color} onChange={e => { setColor(e.target.value); if (errorC) setErrorC(false); }}>
                                    <option disabled value=''>Choose a color...</option>
                                    {colors.map(c => <option key={c} value={c} >{c} </option>)}
                                </Form.Control>
                                {errorC ? <p className="text-danger">Error: color is required. </p> : null}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Label>Sentences</Form.Label>
                    <div style={{ padding: "0px", marginBottom: "16px", marginTop: "0px" }}>
                        <Row>
                            <Col sm={2}>
                                <Form.Label hidden={!available_fields[image].top}>Top</Form.Label>
                            </Col>
                            <Col>
                                <Form.Control type="text" placeholder="Insert top sentence" value={top} hidden={!available_fields[image].top} onChange={(e) => { e.preventDefault(); setTop(e.target.value) }} onKeyPress={(e) => {
                                    if (e.key === 'Enter')
                                        e.preventDefault();
                                }} style={{ marginBottom: "4px" }} >
                                </Form.Control>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={2}>
                                <Form.Label hidden={!available_fields[image].center}>Center</Form.Label>
                            </Col>
                            <Col>
                                <Form.Control type="text" placeholder="Insert center sentence" value={center} hidden={!available_fields[image].center} onChange={(e) => { e.preventDefault(); setCenter(e.target.value) }} onKeyPress={(e) => {
                                    if (e.key === 'Enter')
                                        e.preventDefault();
                                }} style={{ marginBottom: "4px" }} >
                                </Form.Control>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={2}>
                                <Form.Label hidden={!available_fields[image].bottom}>Bottom</Form.Label>
                            </Col>
                            <Col>
                                <Form.Control type="text" placeholder="Insert bottom sentence" value={bottom} hidden={!available_fields[image].bottom} onChange={(e) => { e.preventDefault(); setBottom(e.target.value) }} onKeyPress={(e) => {
                                    if (e.key === 'Enter')
                                        e.preventDefault();
                                }}  >
                                </Form.Control>
                            </Col>
                        </Row>
                    </div>
                    <div className={image} style={{ backgroundSize: "466px", maxWidth: "466px", maxHeight: `${resizing[image]}px` }} >
                        {(top && font && color) ? <p className={`${font}-${color} top`} style={{ fontSize: "1.6rem" }}>{top}</p> : ""}
                        {(center && font && color) ? <p className={`${font}-${color} center`} style={{ fontSize: "1.6rem" }}>{center}</p> : ""}
                        {(bottom && font && color) ? <p className={`${font}-${color} bottom`} style={{ fontSize: "1.6rem" }}>{bottom}</p> : ""}
                    </div>
                    <Row>
                        <Col>
                            <fieldset>
                                <Form.Group style={{ marginTop: "16px" }}>
                                    <Form.Label style={{ padding: "0px", marginLeft: "20px", marginBottom: "8px" }} as="legend" column sm={2}>Visibility</Form.Label>
                                    <Form.Check style={{ marginLeft: "20px" }} type="radio" label="Public" name="formRadios" id="formRadios1" disabled={props.meme.creator !== props.loggedIn.id && props.meme.visibility === 0} checked={visibility} onChange={(e) => { setVisibility(1); }} />
                                    <Form.Check style={{ marginLeft: "20px" }} type="radio" label="Protected" name="formRadios" id="formRadios2" checked={!visibility} onChange={(e) => { setVisibility(0); }} />
                                </Form.Group>
                            </fieldset>
                        </Col>
                        <Col>
                            <fieldset disabled>
                                <Form.Group style={{ marginTop: "16px" }}>
                                    <Form.Label htmlFor="disabledTextInput">Creator</Form.Label>
                                    <Form.Control id="disabledTextInput" placeholder={props.loggedIn.username} />
                                </Form.Group>
                            </fieldset>
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
                <Button variant="info" onClick={(e) => { e.preventDefault(); handleSave(); }}>Save</Button>
            </Modal.Footer>
        </Modal>
    </>
    );
}

export { MemePage, MemeSidebar }