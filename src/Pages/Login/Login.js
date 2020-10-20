import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import ReactLoading from 'react-loading'
import { withRouter } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import { myFirebase, myFirestore } from '../../Services/firebase'
import LoginString from '../Login/LoginString';
import './Login.css';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            email: "",
            password: ""
        }
        this.handlechange = this.handlechange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

    }
    handlechange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    componentDidMount() {
        this.checkLogin()
    }
    checkLogin = () => {
        if (localStorage.getItem(LoginString.ID)) {
            this.setState({ isLoading: false }, () => {
                this.setState({ isLoading: false })
                this.props.showToast(1, 'Login Success')
                this.props.history.push('./chat')
            })
        } else {
            this.setState({ isLoading: false })
        }
    }
    async handleSubmit(event) {
        event.preventDefault();
        await myFirebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(async result => {
                let user = result.user;
                if (user) {
                    await myFirestore.collection('users')
                        .where('id', "==", user.uid)
                        .get()
                        .then(function (querySnapshot) {
                            querySnapshot.forEach(function (doc) {
                                const currentdata = doc.data();
                                localStorage.setItem(LoginString.FirebaseDocumentId, doc.id)
                                localStorage.setItem(LoginString.ID, currentdata.id)
                                localStorage.setItem(LoginString.Name, currentdata.name)
                                localStorage.setItem(LoginString.Email, currentdata.email)
                                localStorage.setItem(LoginString.Password, currentdata.password)
                                localStorage.setItem(LoginString.PhotoURL, currentdata.URL)
                                localStorage.setItem(LoginString.Description, currentdata.Description)
                            })
                        })
                }
                this.props.showToast(1, 'Login Success')
                this.props.history.push('./chat')
            })
            .catch((error) => {
                document.getElementById('1').innerText = "incorrect email/password or poor internet"
            })

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
        const form = {
            width: '100%',
            marginTop: '50px'
        }
        const avatar = {
            backgroundColor: 'black',
        }
        return (
            <div>
                <Container fluid>
                    <Row>
                        <Col lg={7} md={7} sm={12} Col={12} className="backimg">
                        </Col>
                        <Col lg={5} md={5} sm={12} Col={12} className="loginmain">
                            <Card style={Signinsee}>
                                <div>
                                    <Avatar style={avatar}>
                                        <LockOutlinedIcon width="50px" height="50px" />
                                    </Avatar>
                                </div>
                                <div>
                                    <Typography component="h1" variant="h5">
                                        Sign in To
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
                            <div className="inputdiv1">
                                <form style={form} noValidate onSubmit={this.handleSubmit}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
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
                                        autoFocus
                                        onChange={this.handlechange}
                                        value={this.state.password}
                                    />
                                    <div className="remme">
                                        <FormControlLabel
                                            control={<Checkbox value="remember" color="primary" />}
                                            label="Remember Me"
                                        />
                                    </div>
                                    <div className="CenterAliningItems">
                                        <Button className="signinbtn" type="submit">
                                            LogIn <i class="fa fa-sign-in"></i>
                                        </Button>
                                    </div>
                                    <div className="CenterAliningItems">
                                        <p>Don't Have And Account?</p>
                                        <p><Link to="/signup" variant="body2">
                                            Sign Up
                                            </Link>
                                        </p>
                                    </div>
                                    <div className="CenterAliningItems">
                                        <p id='1' style={{ color: 'red' }}></p>
                                    </div>
                                </form>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}
export default withRouter(Login)