import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import ReactLoading from 'react-loading';
import 'react-toastify/dist/ReactToastify.css';
import { myFirestore, myStorage } from '../../Services/firebase'
import images from '../../Projectimages/Projectimages';
import moment from 'react-moment';
import './Chatbox.css';
import LoginString from '../Login/LoginString';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class ChatBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isShowSticker: false,
            inputValue: ''
        }
        this.currentUserName = localStorage.getItem(LoginString.name)
        this.currentUserId = localStorage.getItem(LoginString.Id)
        this.currentUserPhoto = localStorage.getItem(LoginString.PhotoURL)
        this.currentUserDocumentId = localStorage.getItem(LoginString.FirebaseDocumentId)
        this.stateChanged = localStorage.getItem(LoginString.UPLOAD_CHANGED)
        this.currentPeerUser = this.props.currentPeerUser
        this.groupChatId = null;
        this.listMessage = null;
        this.currentPeerUserMessages = [];
        this.removeListener = null;
        this.currentPhotofile = null;

        // myFirestore.collection('users').doc(this.currentPeerUser.documentKey).get()
        //     .then((docRef) => {
        //         this.currentPeerUserMessages = docRef.data().messages
        //     })
    }
    componentDidUpdate() {
        this.scrollToBottom()
    }
    componentDidMount() {
        this.getListHistory()
    }
    componentWillUnmount() {
        if (this.removeListener) {
            this.removeListener()
        }
    }
    componentWillReceiveProps(newProps) {
        if (newProps.currentPeerUser) {
            this.currentPeerUser = newProps.currentPeerUser
            this.getListHistory()
        }
    }
    getListHistory = () => {
        if (this.removeListener) {
            this.removeListener()
        }
        this.listMessage.length = 0
        this.setState({ isLoading: true })
        if (
            this.hashString(this.currentUserId) <=
            this.hashString(this.currentPeerUser.id)
        ) {
            this.groupChatId = `${this.currentUserId}-${this.currentPeerUser.id}`
        } else {
            this.groupChatId = `${this.currentPeerUser.id}-${this.currentUserId}`
        }

        this.removeListener = myFirestore
            .collection(LoginString.Messages)
            .doc(this.groupChatId)
            .collection(this.groupChatId)
            .onSnapshot(
                snapshot => {
                    snapshot.docChanges().forEach(change => {
                        if (change.type === LoginString.DOC) {
                            this.listMessage.push(change.doc.data())
                        }
                    })
                    this.setState({ isLoading: false })
                },
                err => {
                    this.props.showToast(0, err.toString())
                }
            )
    }
    // getListHistory = () => {
    //     if (this.removeListener) {
    //         this.removeListener()
    //     }
    //     this.listMessage.length = 0
    //     this.setState({ isLoading: true })
    //     if (
    //         this.hashString(this.currentUserId) <=
    //         this.hashString(this.currentPeerUser.id)
    //     ) {
    //         this.groupChatId = `${this.currentUserId}-${this.currentPeerUser.id}`
    //     } else {
    //         this.groupChatId = `${this.currentPeerUser.id}-${this.currentUserId}`
    //     }
    //     this.removeListener = myFirestore
    //         .collection(LoginString.Messages)
    //         .doc(this.groupChatId)
    //         .collection(this.groupChatId)
    //         .onSnapshot(
    //             Snapshot => {
    //                 Snapshot.docChanges().forEach(change => {
    //                     if (change.type === LoginString.DOC) {
    //                         this.listMessage.push(change.doc.data())
    //                     }
    //                 })
    //                 this.setState({ isLoading: false })
    //             }
    //         ),
    //         err => {
    //             this.props.showToast(0, err.toString())
    //         }
    // }
    onSendMessage = (content, type) => {
        let notificationMessages = []
        if (this.state.isShowSticker && type === 2) {
            this.setState({ isShowSticker: false })
        }
        if (content.trim() === '') {
            return;
        }
        const timestamp = moment()
            .valueOf()
            .toString()

        const itemMessage = {
            idFrom: this.currentUserId,
            idTo: this.currentPeerUser.id,
            timestamp: timestamp,
            content: content.trim(),
            type: type

        }
        myFirestore
            .collection(LoginString.Messages)
            .doc(this.groupChatId)
            .collection(this.groupChatId)
            .doc(timestamp)
            .set(itemMessage)
            .then(() => {
                this.setState({ inputValue: '' })
            })
        this.currentPeerUserMessages.map((item) => {
            if (item.notificationId != this.currentUserId) {
                notificationMessages.push(
                    {
                        notificationId: item.notificationId,
                        number: item.number
                    }
                )
            }
        })
        myFirestore
            .collection('users')
            .doc(this.currentPeerUser.documentKey)
            .update({
                messages: notificationMessages
            })
            .then((data) => { })
            .catch(err => {
                this.props.showToast(0, err.toString())
            })

    }
    onChoosePhoto = event => {
        if (event.target.files && event.target.files[0]) {
            this.setState({ isLoading: true })
            this.currentPhotofile = event.target.files[0]
            const prefixFiletype = event.target.files[0].type.toString()
            // if (prefixFiletype.indexOf('image/') !== 0) {
            if (prefixFiletype.indexOf(LoginString.PREFIX_IMAGE) !== 0) {
                this.uplaodPhoto()
            }
            else {
                this.setState({ isLoading: false })
                this.props.showToast(0, 'This file is no an image')
            }
        } else {
            this.setState({ isLoading: false })
        }
    }
    uplaodPhoto = () => {
        if (this.currentPhotofile) {
            const timestamp = moment()
                .valueOf()
                .toString()
            const uploadTask = myStorage
                .ref()
                .child(timestamp)
                .put(this.currentPhotofile)


            uploadTask.on(
                LoginString.UPLOAD_CHANGED,
                null,
                err => {
                    this.setState({ isLoading: false })
                    this.props.showToast(0, err.message)
                },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                        this.setState({ isLoading: false })
                        this.onSendMessage(downloadURL, 1)
                    })
                }
            )
        } else {
            this.setState({ isLoading: false })
            this.props.showToast(0, 'File is null')
        }
    }
    onKeyboardPress = event => {
        if (event.Key === 'Enter') {
            this.onSendMessage(this.state.inputValue, 0)
        }
    }
    scrollToBottom = () => {
        if (this.messagesEnd) {
            this.messagesEnd.scrollIntoView({})
        }
    }
    openListSticker = () => {
        this.setState({ isShowSticker: !this.state.isShowSticker })
    }
    render() {
        return (
            <Card className="viewChatBoard">
                <div className="headerChatBoard">
                    <img
                        className="viewAvatarItem"
                        src={this.currentUserPhoto.URL}
                        alt=""
                    />
                    <span className="textHeaderChatBoard">
                        <p style={{ fontSize: '20px' }}>{this.currentPeerUser.name}</p>
                    </span>
                    <div className="aboutme">
                        <span>
                            <p>{this.currentPeerUser.description}</p>
                        </span>
                    </div>
                </div>
                <div className="viewListContentChat">
                    {this.renderListMessage()}
                    <div style={{ float: 'left', clear: 'both' }}
                        ref={el => {
                            this.messagesEnd = el
                        }}
                    />
                </div>
                {this.state.isShowSticker ? this.renderSticker() : null}
                <div className="viewBottom">
                    <img
                        className="icOpenGallery"
                        src={images.send}
                        alt="input_file"
                        onClick={() => this.refInput.click()}
                    />
                    <img
                        className="viewInputGallery"
                        accept="images/*"
                        type="file"
                        onChange={this.onChoosePhoto}
                    />
                    <img
                        className="icOpenSticker"
                        src={images.inputfile}
                        alt="icon open sticker"
                        onClick={this.openListSticker}
                    />
                    <input
                        className="viewInput"
                        placeholder="Type a message"
                        value={this.state.inputValue}
                        onChange={event => {
                            this.setState({ inputValue: event.target.value })
                        }}
                        onKeyPress={this.onKeyboardPress}
                    />
                    <img
                        className="icSend"
                        src={images.send}
                        alt="icon send"
                        onClick={() => {
                            this.onSendMessage(this.state.inputValue, 0)
                        }}
                    />
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
        )
    }
    renderListMessage = () => {
        if (this.listMessage.length > 0) {
            let viewListMessage = []
            this.listMessage.forEach((item, index) => {
                if (item.idFrom === this.currentUserId) {
                    if (item.type === 0) {
                        viewListMessage.push(
                            <div className="viewItemRight" key={this.item.timestamp}>
                                <span className="textContentItem">{item.content}</span>
                            </div>
                        )
                    } else if (item.type === 1) {
                        viewListMessage.push(
                            <div className="viewItemRight2" Key={item.timestamp}>
                                <img
                                    className="imgItemRight"
                                    src={item.content}
                                    alt="Please update your image"
                                />
                            </div>
                        )
                    } else {
                        viewListMessage.push(
                            <div className="viewItemRight3" Key={item.timestamp}>
                                <img
                                    className="imgItemright"
                                    src={this.getGifImage(item.content)}
                                    alt="content message"
                                />
                            </div>
                        )
                    }
                } else {
                    if (item.type === 0) {
                        viewListMessage.push(
                            <div className="viewWrapItemLeft" Key={item.timestamp}>
                                <div className="viewWrapItemLeft3">
                                    {this.islastMessageLeft(index) ? (
                                        <img
                                            src={this.currentPeerUser.photoURL}
                                            alt="avatar"
                                            className="perrAvatarLeft"
                                        />
                                    ) : (
                                            <div className="viewPaddingLeft" />
                                        )}
                                    <div className="viewItemLeft">
                                        <span className="textItemContent">{this.content}</span>
                                    </div>
                                </div>
                                {this.islastMessageLeft(index) ? (
                                    <span className="textTimeLeft">
                                        <div className="time">
                                            {moment(Number(item.timestamp)).format('ll')}
                                        </div>
                                    </span>
                                ) : null}
                            </div>
                        )
                    } else if (item.type === 1) {
                        viewListMessage.push(
                            <div className="viewWrapItemLeft2" Key={item.timestamp}>
                                <div className="viewWrapItemLeft3">
                                    {this.islastMessageLeft(index) ? (
                                        <img
                                            src={this.currentPeerUser.URL}
                                            alt="avatar"
                                            className="perrAvatarLeft"
                                        />
                                    ) : (
                                            <div className="viewPaddingLeft" />
                                        )}
                                    <div className="viewItemLeft2">
                                        <img
                                            src={item.content}
                                            alt="content message"
                                            className="imgItemLeft"
                                        />
                                    </div>
                                </div>
                                {this.islastMessageLeft(index) ? (
                                    <span className="textTimeLeft">
                                        <div className="time">
                                            {moment(Number(item.timestamp)).format('ll')}
                                        </div>
                                    </span>
                                ) : null}
                            </div>
                        )
                    } else {
                        viewListMessage.push(
                            <div className="viewWrapItemLeft2" Key={item.timestamp}>
                                <div className="viewWrapItemLeft3">
                                    {this.islastMessageLeft(index) ? (
                                        <img
                                            src={this.currentPeerUser.URL}
                                            alt="avatar"
                                            className="perrAvatarLeft"
                                        />
                                    ) : (
                                            <div className="viewPaddingLeft" />

                                        )}
                                    <div className="viewitemLetf3" Key={item.timestamp}>
                                        <img
                                            className="imgItemRight"
                                            src={this.getGifImage(item.content)}
                                            alt="content message"
                                        />

                                    </div>
                                </div>
                                {this.islastMessageLeft(index) ? (
                                    <span className="textTimeLeft">
                                        <div className="time">
                                            {moment(Number(item.timestamp)).format('ll')}
                                        </div>
                                    </span>
                                ) : null}
                            </div>
                        )
                    }
                }
            })
            return viewListMessage
        } else {
            return (
                <div className="viewWrapSayHi">
                    <span className="textSayHi">Say hi to new friend</span>
                    <img
                        className="imgWavehand"
                        src={images.send}
                        alt="wave hand"
                    />
                </div>
            )
        }
    }
    renderSticker = () => {
        return (
            <div className="viewStickers">
                <img
                    className="imgSticker"
                    src={images.sticker1}
                    alt="sticker"
                    onClick={() => { this.onSendMessage('sticker1', 2) }}
                />
                <img
                    className="imgSticker"
                    src={images.sticker2}
                    alt="sticker"
                    onClick={() => { this.onSendMessage('sticker2', 2) }}
                />
                <img
                    className="imgSticker"
                    src={images.sticker3}
                    alt="sticker"
                    onClick={() => { this.onSendMessage('sticker3', 2) }}
                />
                <img
                    className="imgSticker"
                    src={images.gif1}
                    alt="sticker"
                    onClick={() => { this.onSendMessage('gif1', 2) }}
                />
                <img
                    className="imgSticker"
                    src={images.gif3}
                    alt="sticker"
                    onClick={() => { this.onSendMessage('gif3', 2) }}
                />
                <img
                    className="imgSticker"
                    src={images.gif4}
                    alt="sticker"
                    onClick={() => { this.onSendMessage('gif4', 2) }}
                />
            </div>
        )
    }
    getGifImage = value => {
        switch (value) {
            case 'sticker1':
                return images.sticker1
            case 'sticker2':
                return images.sticker2
            case 'sticker3':
                return images.sticker3
            case 'gif1':
                return images.gif1
            case 'gif3':
                return images.gif3
            case 'gif4':
                return images.gif4
        }
    }
    hashString = str => {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
            hash += Math.pow(str.charCodeAt(i) * 31, str.length - i)
            hash = hash & hash
        }
        return hash
    }
    islastMessageLeft(index) {
        if (
            (index + 1 < this.listMessage.length &&
                this.listMessage[index + 1].idFrom === this.currentUserId) ||
            index === this.listMessage.length - 1
        ) {
            return true
        } else {
            return false
        }
    }


    islastMessageRight(index) {
        if (
            (index + 1 < this.listMessage.length &&
                this.listMessage[index + 1].idFrom !== this.currentUserId) ||
            index === this.listMessage.length - 1
        ) {
            return true
        } else {
            return false
        }
    }

}