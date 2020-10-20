import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import { withRouter } from 'react-router-dom'
import LoginString from "../Login/LoginString";
import { myFirebase, myFirestore } from '../../Services/firebase'
import './Chat.css';
import { Container, Row, Col, Button, InputGroup, FormControl} from 'react-bootstrap';
import ChatBoard from '../Chatbox/ChatBoard';
import Welcome from '../Welcome/Welcome';

class Chat extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            isOpenDialogConfirmLogout: false,
            currentPeerUser: null,
            displayedContactSwitchedNotification: [],
            displayedContacts: []
        }
        this.currentUserName = localStorage.getItem(LoginString.Name)
        this.currentUserId = localStorage.getItem(LoginString.ID)
        this.currentUserPhoto = localStorage.getItem(LoginString.PhotoURL)
        this.currentUserDocumentId = localStorage.getItem(LoginString.FirebaseDocumentId)
        this.currentUserMessages = []
        this.ListUsers = []
        this.notificationMessagesErase = []
        this.onProfileClick = this.onProfileClick.bind(this);
        this.getListUser = this.getListUser.bind(this);
        this.renderListUser = this.renderListUser.bind(this);
        this.getClassnameforUserandNotification = this.getClassnameforUserandNotification.bind(this);
        this.notificationErase = this.notificationErase.bind(this);
        this.updaterenderList = this.updaterenderList.bind(this)
    }
    logout = () => {
        this.setState({ isLoading: true })
        myFirebase
            .auth()
            .signOut()
            .then(() => {
                this.setState({ isLoading: false }, () => {
                    localStorage.clear()
                    this.props.showToast(1, 'Logout success')
                    this.props.history.push('/')
                })
            })
            .catch(function (err) {
                this.setState({ isLoading: false })
                this.props.showToast(0, err.message)
            })
    }
    onProfileClick = () => {
        this.props.history.push('/profile')
    }
    componentDidMount() {
        // myFirestore.collection('users').doc(this.currentUserDocumentId).get()
        //     .then((doc) => {
        //         doc.data().messages.map((item) => {
        //             this.currentUserMessages.push({
        //                 notificationId: item.notificationId,
        //                 number: item.number
        //             })
        //         })
        //         this.setState({
        //             displayedContactSwitchedNotification: this.currentUserMessages
        //         })
        //     })
        this.getListUser()
    }
    onLogoutClick = () => {
        this.setState({
            isOpenDialogConfirmLogout: true
        })
    }

    hideDialogConfirmLogout = () => {
        this.setState({
            isOpenDialogConfirmLogout: false
        })
    }
    getClassnameforUserandNotification = (itemId) => {
        let number = 0
        let className = ""
        let check = false;
        if (this.state.currentPeerUser &&
            this.state.currentPeerUser.id === itemId) {
            className = 'viewWrapItemFocused'
        } else {
            this.state.displayedContactSwitchedNotification.forEach((item) => {
                if (item.notificationId.length > 0) {
                    if (item.notificationId === itemId) {
                        check = true
                        number = item.number
                    }
                }
            })
            if (check === true) {
                className = 'viewWrapItemNotification'
            }
            else {
                className = 'viewWrapItem'
            }
        }
        return className
    }

    getListUser = async () => {
        const result = await myFirestore.collection('users').get();
        if (result.docs.length > 0) {
            this.ListUsers = [...result.docs]
            this.setState({
                isLoading: false
            })
        }
        this.renderListUser()
    }
    notificationErase = (itemid) => {
        this.state.displayedContactSwitchedNotification.forEach((el) => {
            // if (el.notificationId > 0) {
            //     if (el.notificationId != itemid) {
            //         this.notificationMessagesErase.push({
            //             notificationId: el.notificationId,
            //             number: el.number
            //         })
            //     }
            // }
            if (el.notificationId > 0) {
                if (el.notificationId !== itemid) {
                    this.notificationMessagesErase.push({
                        notificationId: el.notificationId,
                        number: el.number
                    })
                }
            }
        })
        this.updaterenderList()
        this.gotohome()
    }
    updaterenderList = () => {
        myFirestore.collection('users').doc(this.currentUserDocumentId).update(
            { messages: this.notificationMessagesErase }
        )
        this.setState({
            displayedContactSwitchedNotification: this.notificationMessagesErase
        })
    }
    renderListUser = () => {
        if (this.ListUsers.length > 0) {
            let viewListUser = []
            this.ListUsers.forEach((item, index) => {
                if (item.data().id !== this.currentUserId) {
                    viewListUser.push(
                        <button
                            key={index}
                            className={
                                this.state.currentPeerUser &&
                                    this.state.currentPeerUser.id === item.data().id
                                    ? 'viewWrapItemFocused'
                                    : 'viewWrapItem'
                            }
                            onClick={() => {
                                this.notificationErase(item.id)
                                this.setState({ currentPeerUser: item.data() })
                            }}
                        >
                            <img
                                className="viewAvatarItem"
                                src={item.data().URL}
                                alt="icon avatar"
                            />
                            <div className="viewWrapContentItem">
                                <span className="textItem">{`Name: ${item.data().name
                                    }`}</span>
                            </div>
                        </button>
                    )
                }
            })
            this.setState({
                displayedContacts: viewListUser
            })
        } else {
            console.log("no user is present")

        }
    }
    searchHandler = (event) => {
        let searchQuery = event.target.value.toLowerCase(),
            displayedContacts = this.ListUsers.filter((el) => {
                let SearchValue = el.data().name.toLowerCase();
                return SearchValue.indexOf(searchQuery) !== -1;
            })
        this.displayedContacts = displayedContacts
        this.displayedSearchedContacts()
    }
    displayedSearchedContacts = () => {
        if (this.ListUsers.length > 0) {
            let viewListUser = []
            this.displayedContacts.map((item, index) => {
                if (item.data().id !== this.currentUserId) {
                    viewListUser.push(
                        <button
                            key={index}
                            className={
                                this.state.currentPeerUser &&
                                    this.state.currentPeerUser.id === item.data().id
                                    ? 'viewWrapItemFocused'
                                    : 'viewWrapItem'
                            }
                            onClick={() => {
                                this.notificationErase(item.id)
                                this.setState({ currentPeerUser: item.data() })
                            }}
                        >
                            <img
                                className="viewAvatarItem"
                                src={item.data().URL}
                                alt="icon avatar"
                            />
                            <div className="viewWrapContentItem">
                                <span className="textItem">{`Name: ${item.data().name
                                    }`}</span>
                            </div>
                        </button>
                    )
                }
            })
            this.setState({
                displayedContacts: viewListUser
            })
        }
        else {
            console.log("no user is present")
        }
    }
    gotohome = () => {
        var size = document.getElementById('mobchatcol1')
        size.style.display = 'none'
        var chech = document.getElementById('viewBoard3')
        chech.style.display = 'block'
    }
    gotochat = () => {
        var chech = document.getElementById('viewBoard3')
        chech.style.display = 'none'
        var size = document.getElementById('mobchatcol1')
        size.style.display = 'block'
    }
    render() {
        return (
            <div>
                <Container fluid className="chatcon">
                    <Row>
                        <Col lg={4} md={4} sm={12} className="chatCol">
                            <div className="chatbody">
                                <div className="userinfo">
                                    <div className="profileviewleftside">
                                        <p className="profilepic2">
                                            <img
                                                className="ProfilePicture"
                                                alt=""
                                                src={this.currentUserPhoto}
                                                onClick={this.onProfileClick}
                                            />
                                            <span className="currentUN">{this.currentUserName}</span>
                                        </p>
                                        <Button className="Logout shadow-none" onClick={this.onLogoutClick}>LogOut</Button>
                                    </div>
                                </div>
                                <div>
                                    {this.state.isOpenDialogConfirmLogout ? (
                                        <div className="dialog1">
                                            <h5 className="confirmlog">Are You Sure You Want To LogOut?</h5>
                                            <Button className="btnyes shadow-none" onClick={this.logout}>Yes</Button>
                                            <Button className="btnno shadow-none" onClick={this.hideDialogConfirmLogout}>No</Button>
                                        </div> 
                                    ) : null}
                                </div>
                                <div>
                                    <InputGroup className="mb-3">
                                        <FormControl
                                            onChange={this.searchHandler}
                                            placeholder="Search User"
                                            aria-describedby="basic-addon2"
                                        />
                                        <InputGroup.Append>
                                            <Button className="searchbtn">
                                                <i className="fa fa-search icon"></i>
                                            </Button>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </div>
                                {this.state.displayedContacts}
                            </div>
                        </Col>
                        <Col lg={8} md={8} sm={12} className="chatCol">
                            <div className="viewBoard">
                                {this.state.currentPeerUser ? (
                                    <ChatBoard currentPeerUser={this.state.currentPeerUser}
                                        showToast={this.props.showToast}
                                    />
                                ) : (<Welcome
                                    currentUserName={this.currentUserName}
                                    currentUserPhoto={this.currentUserPhoto}
                                />
                                    )}
                            </div>
                        </Col>
                        <Col lg={12} md={12} sm={12} className="mobilecol">
                            <Col id="mobchatcol1" lg={12} md={12} sm={12} className="mobchatCol">
                                <div className="chatbody">
                                    <div className="userinfo">
                                        <div className="profileviewleftside">
                                            <p className="profilepic2">
                                                <img
                                                    className="ProfilePicture"
                                                    alt=""
                                                    src={this.currentUserPhoto}
                                                    onClick={this.onProfileClick}
                                                />
                                                <span className="currentUN">{this.currentUserName}</span>
                                            </p>
                                            <Button className="Logout shadow-none" onClick={this.onLogoutClick}>LogOut</Button>
                                        </div>
                                    </div>
                                    <div>
                                        {this.state.isOpenDialogConfirmLogout ? (
                                            <div>
                                                <h5 className="confirmlog">Are You Sure You Want To LogOut?</h5>
                                                <Button className="btnyes shadow-none" onClick={this.logout}>Yes</Button>
                                                <Button className="btnno shadow-none" onClick={this.hideDialogConfirmLogout}>No</Button>
                                            </div>
                                        ) : null}
                                    </div>
                                    <div>
                                        <InputGroup className="mb-3">
                                            <FormControl
                                                onChange={this.searchHandler}
                                                placeholder="Search User"
                                                aria-describedby="basic-addon2"
                                            />
                                            <InputGroup.Append>
                                                <Button className="searchbtn">
                                                    <i className="fa fa-search icon"></i>
                                                </Button>
                                            </InputGroup.Append>
                                        </InputGroup>
                                    </div>
                                    {this.state.displayedContacts}
                                </div>
                            </Col>
                            <div id="viewBoard3" className="viewBoard2">
                                {this.state.currentPeerUser ? (
                                    <div>
                                        <Button onClick={this.gotochat} className="Bkbtn shadow-none"><i class="fa fa-arrow-right"></i></Button>
                                        <ChatBoard currentPeerUser={this.state.currentPeerUser}
                                            showToast={this.props.showToast}
                                        />
                                    </div>
                                ) : null
                                }
                            </div>
                        </Col>
                    </Row>

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
                </Container>
            </div>
        )
    }
}
export default withRouter(Chat)