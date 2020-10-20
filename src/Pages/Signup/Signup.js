import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Signup.css';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { myFirestore, myFirebase } from '../../Services/firebase'
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import LoginString from '../Login/LoginString'
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import ReactLoading from 'react-loading'


export default class SignUp extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            name: "",
            error: null
        }
        this.handlechange = this.handlechange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    handlechange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    async handleSubmit(event) {
        const { name, password, email } = this.state;
        event.preventDefault();
        try {
            myFirebase.auth().createUserWithEmailAndPassword(email, password)
                .then(async result => {
                    myFirestore.collection('users')
                        .add({
                            name,
                            id: result.user.uid,
                            email,
                            password,
                            url: '',
                            description: '',
                            messages: [{ notificationId: "", number: 0 }]
                        }).then((docRef) => {
                            localStorage.setItem(LoginString.ID, result.user.uid);
                            localStorage.setItem(LoginString.Name, name);
                            localStorage.setItem(LoginString.Email, email);
                            localStorage.setItem(LoginString.Password, password);
                            localStorage.setItem(LoginString.PhotoURL, "");
                            localStorage.setItem(LoginString.UPLOAD_CHANGED, 'state_changed');
                            localStorage.setItem(LoginString.Description, "");
                            localStorage.setItem(LoginString.FirebaseDocumentId, docRef.id);
                            this.setState({
                                name: '',
                                password: '',
                                url: '',
                            });
                            this.props.history.push("/Chat")
                        })
                })
                .catch((error) => {
                    document.getElementById('1').innerText = "Error in signing up please tryagain"
                })
        }
        catch (error) {
            document.getElementById('1').innerHTML = "Error in signing up please tryagain"
        }
    }
    render() {
        const Signinsee = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'mintcream',
            backgroundColor: 'mediumaquamarine',
            width: '100%',
            boxShadow: '0 5px 5px #808888',
            height: '10rem',
            paddingTop: '48px',
            borderBottom: '5px solid black'
        }

        const avatar = {
            backgroundColor: 'black',
        }
        return (
            <div>
                <Container fluid className="formacontrooutside">
                    <Row>
                        <Col lg={12} md={12} sm={12}>
                            <Card className="wbchat" style={Signinsee}>
                                <div>
                                    <Avatar style={avatar}>
                                        <LockOutlinedIcon width="50px" height="50px" />
                                    </Avatar>
                                </div>
                                <div>
                                    <Typography component="h1" variant="h5">
                                        Sign Up To
                                    </Typography>
                                </div>
                                <div>
                                    <Link to="/">
                                        <Button className="webchatbtn">
                                            <i class="fa fa-home"></i>
                                        WebChat
                                        </Button>
                                    </Link>
                                </div>

                                {this.state.isLoading ? (
                                    <div className="viewLoading">
                                        <ReactLoading
                                            type={'spin'}
                                            color={'#203152'}
                                            height={'3%'}
                                            width={'3%'}
                                        />
                                    </div>
                                ) : null}
                            </Card>
                            <Container fluid className="formcon">
                                <Row>
                                    <Col lg={3} md={3} sm={0}></Col>
                                    <Col lg={6} md={6} sm={0} className="formcol">
                                        <form className="customform" noValidate onSubmit={this.handleSubmit}>
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="email"
                                                label="Email Address"
                                                placeholder="example:abc@gmail.com"
                                                name="email"
                                                autoComplete="email"
                                                autoFocus
                                                onChange={this.handlechange}
                                                value={this.state.email}
                                            />
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="password"
                                                label="Password"
                                                name="password"
                                                type="password"
                                                autoComplete="current-password"
                                                // autoFocus
                                                onChange={this.handlechange}
                                                value={this.state.password}
                                            />
                                            <div>
                                                <p style={{ color: 'grey', fontSize: '15px', marginLeft: '0' }}>
                                                    Password :Length Greater Than 6 (alphabet,number,special character)
                                                </p>
                                            </div>
                                            <TextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                id="name"
                                                label="Your Name"
                                                name="name"
                                                autoComplete="name"
                                                // autoFocus
                                                onChange={this.handlechange}
                                                value={this.state.name}
                                            />
                                            <div>
                                                <p style={{ color: 'grey', fontSize: '15px', marginLeft: '0' }}>
                                                    Please Fill All Fields And Password Should Be Greater Than 6
                                                </p>
                                            </div>
                                            <div className="centerAliningItems">
                                                <Button className="signinbtn" type="submit">
                                                    <span>Sign Up</span>
                                                </Button>
                                            </div>
                                            <div>
                                                <p style={{ color: "grey" }}>
                                                    Already Have And Account?
                                                </p>

                                                <Link to="/login">
                                                    Login In
                                                </Link>
                                            </div>
                                            <div className="CenterAliningItems">
                                                <p id='1' style={{ color: 'red' }}></p>
                                            </div>
                                        </form>
                                    </Col>
                                    <Col lg={3} md={3} sm={0}></Col>
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}