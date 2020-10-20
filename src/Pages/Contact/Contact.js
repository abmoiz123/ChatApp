import React, { Component } from 'react';
import './Contact.css'
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';


class ContactPage extends Component {
    render() {
        return (
            <div className="contact">
                <Container fluid>
                    <Row>
                        <Col lg={12} md={12} sm={12} Col={12}><h2>Who We Are?</h2></Col>
                        <Col lg={4} md={4} sm={12} Col={12}>
                            <hr style={{
                                color: '#000000',
                                backgroundColor: '#000000',
                                height: .5,
                                borderColor: '#000000'
                            }} />
                            <h1 className="signhd">SignUp</h1>
                            <Form>
                                <Form.Group controlId="formBasicName">
                                    <Form.Label>Your Name</Form.Label>
                                    <Form.Control type="text" placeholder="Your Name" />
                                </Form.Group>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Your Email address</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email" />
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Your Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password" />
                                </Form.Group>
                                <Button className="headerbtn" variant="primary" type="submit">
                                    <Link to="/signup" className="linkline">Submit</Link>
                                </Button>
                            </Form>
                        </Col>
                        <Col className="contactdep" lg={8} md={8} sm={12} Col={12}>
                            <hr style={{
                                color: '#000000',
                                backgroundColor: '#000000',
                                height: .5,
                                borderColor: '#000000'
                            }} />
                            <h4>Contact Us</h4>
                            <p>
                                For Any Contact Or Suggestion You Can Directly Us On Our Facebook Page:
                            </p>
                            <h4>
                                <a href="https://twitter.com/?lang=en"><i class="cfont fa fa-twitter fa-lg"></i></a>
                                : Twitter
                            </h4>
                            <h4>
                                <a href="https://www.facebook.com/"><i class="cfont fa fa-facebook fa-lg"></i></a>
                                : FaceBook
                            </h4>
                            <h4>
                                <a href="https://www.instagram.com/?hl=en"><i class="cfont fa fa-instagram fa-lg"></i></a>
                                : Instagram
                            </h4>
                            <h4>More Information</h4>
                            <p>To Whom It Any Concern</p>
                            <p>This App Is Developed For Learning Purpose - Developed By -Muhammad Moiz.</p>
                        </Col>
                    </Row>
                </Container>
                <div class="foot">
                    <h2 >
                        <span>Copyright <i class="fa fa-copyright"></i> ChatApp </span>
                        {new Date().getFullYear()}
                        {'.'}
                    </h2>
                </div>
            </div>
        )
    }
}
export default ContactPage