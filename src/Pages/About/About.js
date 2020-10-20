import React, { Component } from 'react';
import './About.css'
import images from '../../Projectimages/Projectimages';
import { Container, Row, Col } from 'react-bootstrap';

class AboutPage extends Component {
    render() {
        return (
            <div className="about">
                <Container fluid>
                    <Row>
                        <Col lg={12} md={12} sm={12} Col={12}>
                            <h2 className="feature">Features Of WebChat Application</h2>
                        </Col>
                        <Col lg={3} md={3} sm={12} Col={12}>
                            <hr style={{
                                color: '#000000',
                                backgroundColor: '#000000',
                                height: .5,
                                borderColor: '#000000'
                            }} />
                            <div>
                                <h3>
                                    <i class="featureicon fa fa-rocket"></i>
                                    Get Start Quickly
                                </h3>
                                <p>
                                    Just Register Your Self With This App And Start Your Chating With Your Loved Ones.
                                </p>
                            </div>
                        </Col>
                        <Col lg={3} md={3} sm={12} Col={12}>
                            <hr style={{
                                color: '#000000',
                                backgroundColor: '#000000',
                                height: .5,
                                borderColor: '#000000'
                            }} />
                            <div>
                                <h3>
                                    <i class="featureicon fa fa-sign-in"></i>
                                    Firebase Authentication
                                </h3>
                                <p>
                                    Firebase Authentication Has Been Implemented In This App.
                                </p>
                            </div>
                        </Col>
                        <Col lg={3} md={3} sm={12} Col={12}>
                            <hr style={{
                                color: '#000000',
                                backgroundColor: '#000000',
                                height: .5,
                                borderColor: '#000000'
                            }} />
                            <div>
                                <h3>
                                    <i class="featureicon fa fa-th-large"></i>
                                    Media
                                </h3>
                                <p>
                                    You Can Share Images With Your Friends For Better Experience .
                                </p>
                            </div>
                        </Col>
                        <Col lg={3} md={3} sm={12} Col={12}>
                            <hr style={{
                                color: '#000000',
                                backgroundColor: '#000000',
                                height: .5,
                                borderColor: '#000000'
                            }} />
                            <div>
                                <h3>
                                    <i class="featureicon fa fa-refresh"></i>
                                    Updates
                                </h3>
                                <p>
                                    We Will Working With New Features For This App For Better Experience In Future.
                                </p>
                            </div>
                        </Col>
                        <Col lg={4} md={4} sm={12} Col={12}>
                            <hr style={{
                                color: '#000000',
                                backgroundColor: '#000000',
                                height: .5,
                                borderColor: '#000000'
                            }} />
                            <img className="founderimage" alt="File Icons" src={images.moiz} />
                        </Col>
                        <Col lg={8} md={8} sm={12} Col={12}>
                            <hr style={{
                                color: '#000000',
                                backgroundColor: '#000000',
                                height: .5,
                                borderColor: '#000000'
                            }} />
                            <div className="founderdiv">
                                <h5>The Founder Of ChatApp.</h5>
                                <h2>Muhammad Moiz</h2>
                                <h5>Currently Working At ChatApp And Busy To Explore New Technologies.</h5>
                            </div>
                        </Col>
                        <Col>
                            <div>
                                <hr style={{
                                    color: '#000000',
                                    backgroundColor: '#000000',
                                    height: .5,
                                    borderColor: '#000000'
                                }} />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
export default AboutPage