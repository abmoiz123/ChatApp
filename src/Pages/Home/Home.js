import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { Button, Container, Row, Col } from 'react-bootstrap';

class HomePage extends Component {
    render() {
        return (
            <div className="homecon">
                <Container fluid>
                    <Row>
                        <Col lg={3} md={3} sm={0} Col={0}></Col>
                        <Col lg={6} md={6} sm={12} Col={12}>
                            <h1 className="webchat">WEB CHAT APP</h1>
                            <h3 className="letstalk">Let's talk with our loved ones</h3>
                            <Container>
                                <Row>
                                    <Col lg={3} md={3} sm={2} Col={2}></Col>
                                    <Col lg={6} md={6} sm={8} Col={8} align="center">
                                        <Link to="/signup"><Button className="getstr"><h3>GetStarted</h3></Button></Link>
                                    </Col>
                                    <Col lg={3} md={3} sm={2} Col={2}></Col>
                                </Row>
                            </Container>
                        </Col>
                        <Col lg={3} md={3} sm={0} Col={0}></Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
export default HomePage