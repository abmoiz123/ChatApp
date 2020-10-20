import React from 'react';
import {
    Route,
    BrowserRouter as Router,
    Switch
} from 'react-router-dom';
import './App.css';
import Root from './Pages/Root/Root';
import Chat from './Pages/Chat/Chat';
import Profile from './Pages/Profile/Profile';
import Signup from './Pages/Signup/Signup';
import Login from './Pages/Login/Login';
import ChatBoard from './Pages/Chatbox/ChatBoard'
import { myFirebase } from './Services/firebase';
import { toast, ToastContainer } from 'react-toastify';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            authenticated: false,
            loading: true
        }
    }
    showToast = (type, message) => {
        switch (type) {
            case 0:
                toast.warning(message)
                break;
            case 1:
                toast.success(message)
                break;
            default:
                break;
        }
    }
    componentDidMount() {
        myFirebase.auth().onAuthStateChanged(user => {
            if (user) {
                this.setState({
                    authenticated: true,
                    loading: false
                });
            }
            else {
                this.setState({
                    authenticated: false,
                    loading: true
                });
            }
        })
    }
    render() {
        return (
            <Router>
                <ToastContainer
                    autoClose={2000}
                    hideProgressBar={true}
                    position={toast.POSITION.TOP_CENTER}
                />
                <Switch>
                    <Route
                        exact
                        path="/"
                        render={props => <Root {...props} />} />

                    <Route
                        exact
                        path="/login"
                        render={props => <Login showToast={this.showToast} {...props} />}
                    />


                    <Route
                        exact
                        path="/profile"
                        render={props => <Profile showToast={this.showToast} {...props} />}
                    />

                    <Route
                        exact
                        path="/signup"
                        render={props => <Signup showToast={this.showToast} {...props} />}
                    />


                    <Route
                        exact
                        path="/chat"
                        render={props => <Chat showToast={this.showToast} {...props} />}
                    />
                    <Route
                        exact
                        path="/chatBoard"
                        render={props => <ChatBoard showToast={this.showToast} {...props} />}
                    />
                </Switch>
            </Router>
        )

    }
}
export default App