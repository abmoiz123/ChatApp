import React from 'react';
import './Header.css';
import { Navbar } from 'react-bootstrap'
import { Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
// import { Home } from '@material-ui/icons';

function Header() {
    return (
        <Navbar className="navbar" fixed="top" expand="lg">
            <Navbar.Brand href="/"><b>ChatApp</b></Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="#" className="link" >
                        Home</Nav.Link>
                    <Nav.Link href="#" className="link">About</Nav.Link>
                    <Nav.Link href="#" className="link">ContactUs</Nav.Link>
                </Nav>
                <Button className="headerbtn"><Link to="/login" className="linkline">LogIn <i class="fa fa-sign-in"></i></Link></Button>
                <Button className="headerbtn"><Link to="/signup" className="linkline">SignUp <i class="fa fa-user-plus"></i></Link></Button>
                {/* <Button className="headerbtn">SignUp</Button> */}
            </Navbar.Collapse>
        </Navbar>
    )
}
export default Header