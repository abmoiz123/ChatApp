import moment from 'moment'
import React, { Component } from 'react'
import ReactLoading from 'react-loading'
import 'react-toastify/dist/ReactToastify.css'
import { myFirebase, myFirestore, myStorage } from '../../Services/firebase'
import images from '../../Projectimages/Projectimages'
import '../Chatbox/Chatbox.css'
import LoginString from '../Login/LoginString';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
export default class ChatBox2 extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            isShowSticker: false,
            inputValue: ''
        }
        this.currentUserId = localStorage.getItem(LoginString.ID)
        this.currentUserPhoto = localStorage.getItem(LoginString.PhotoURL)
        this.currentUserName = localStorage.getItem(LoginString.Name)
        this.currentUserDocumentId = localStorage.getItem(LoginString.FirebaseDocumentId)
        this.stateChanged = localStorage.getItem(LoginString.UPLOAD_CHANGED)
        this.listMessage = []
        this.currentPeerUser = this.props.currentPeerUser
        this.groupChatId = null
        this.removeListener = null
        this.currentPeerUserMessages = [];
        this.currentPhotoFile = null
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

    openListSticker = () => {
        this.setState({ isShowSticker: !this.state.isShowSticker })
    }

    onSendMessage = (content, type) => {
        let notificationMessages = []
        if (this.state.isShowSticker && type === 2) {
            this.setState({ isShowSticker: false })
        }

        if (content.trim() === '') {
            return
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
            // this.currentPeerUserMessages.map((item) => {
            //     if (item.notificationId != this.currentUserId) {
            //         notificationMessages.push(
            //             {
            //                 notificationId: item.notificationId,
            //                 number: item.number
            //             }
            //         )
            //     }
            // })
            // myFirestore
            //     .collection('users')
            //     .doc(this.currentPeerUser.documentKey)
            //     .update({
            //         messages: notificationMessages
            //     })
            //     .then((data) => { })
            .catch(err => {
                this.props.showToast(0, err.toString())
            })


        // myFirestore
        //     .collection(LoginString.Messages)
        //     .doc(this.groupChatId)
        //     .collection(this.groupChatId)
        //     .doc(timestamp)
        //     .set(itemMessage)
        //     .then(() => {
        //         this.setState({ inputValue: '' })
        //     })
        //     .catch(err => {
        //         this.props.showToast(0, err.toString())
        //     })
    }

    onChoosePhoto = event => {
        if (event.target.files && event.target.files[0]) {
            this.setState({ isLoading: true })
            this.currentPhotoFile = event.target.files[0]
            const prefixFiletype = event.target.files[0].type.toString()
            if (prefixFiletype.indexOf(LoginString.PREFIX_IMAGE) === 0) {
                this.uploadPhoto()
            } else {
                this.setState({ isLoading: false })
                this.props.showToast(0, 'This file is not an image')
            }
        } else {
            this.setState({ isLoading: false })
        }
    }

    uploadPhoto = () => {
        if (this.currentPhotoFile) {
            const timestamp = moment()
                .valueOf()
                .toString()

            const uploadTask = myStorage
                .ref()
                .child(timestamp)
                .put(this.currentPhotoFile)

            uploadTask.on(
                LoginString.UPLOAD_CHANGED,
                null,
                err => {
                    this.setState({ isLoading: false })
                    this.props.showToast(0, err.Messages)
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
        if (event.key === 'Enter') {
            this.onSendMessage(this.state.inputValue, 0)
        }
    }

    scrollToBottom = () => {
        if (this.messagesEnd) {
            this.messagesEnd.scrollIntoView({})
        }
    }

    render() {
        return (
            <Card className="viewChatBoard">
                <div className="viewChatBoard">
                    <div className="headerChatBoard">
                        <img
                            className="viewAvatarItem"
                            src={this.currentPeerUser.URL}
                            alt=""
                        />
                        <span className="textHeaderChatBoard">
                            <p style={{ fontSize: '20px' }}>{this.currentPeerUser.Name}</p>
                        </span>
                        <div className="aboutme">
                            <span>
                                <p>{this.currentPeerUser.Description}</p>
                            </span>
                        </div>
                        <Button className="Bkbtn"><i class="fa fa-arrow-right"></i></Button>
                    </div>
                    <div className="viewListContentChat">
                        {this.renderListMessage()} 
                        <div
                            style={{ float: 'left', clear: 'both' }}
                            ref={el => {
                                this.messagesEnd = el
                            }}
                        />
                    </div>
                    <div className="emojidiv">
                        {this.state.isShowSticker ? this.renderStickers() : null}
                    </div>

                    <div className="viewBottom">
                        <div className="gallery">
                            <img
                                className="icOpenGallery"
                                src={images.inputfile}
                                alt="icon open gallery"
                                onClick={() => this.refInput.click()}
                            />
                            <input
                                ref={el => {
                                    this.refInput = el
                                }}
                                accept="image/*"
                                className="viewInputGallery"
                                type="file"
                                onChange={this.onChoosePhoto}
                            />
                        </div>
                        <div className="sticker">
                            <img
                                className="icOpenSticker"
                                src={images.inputphoto}
                                alt="icon open sticker"
                                onClick={this.openListSticker}
                            />
                        </div>
                        <div className="textbar">
                            <input
                                className="viewInput"
                                placeholder="Type your message..."
                                value={this.state.inputValue}
                                onChange={event => {
                                    this.setState({ inputValue: event.target.value })
                                }}
                                onKeyPress={this.onKeyboardPress}
                            />
                        </div>
                        <div className="sendbtn">
                            <img
                                className="icSend"
                                src={images.send}
                                alt="icon send"
                                onClick={() => { this.onSendMessage(this.state.inputValue, 0) }}
                            />
                        </div>
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
                </div>
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
                            <div className="viewItemRight" key={item.timestamp}>
                                <span className="textContentItem">{item.content}</span>
                            </div>
                        )
                    } else if (item.type === 1) {
                        viewListMessage.push(
                            <div className="viewItemRight2" key={item.timestamp}>
                                <img
                                    className="imgItemRight"
                                    src={item.content}
                                    alt="content message"
                                />
                            </div>
                        )
                    } else {
                        viewListMessage.push(
                            <div className="viewItemRight3" key={item.timestamp}>
                                <img
                                    className="imgItemRight"
                                    src={this.getGifImage(item.content)}
                                    alt="content message"
                                />
                            </div>
                        )
                    }
                } else {
                    if (item.type === 0) {
                        viewListMessage.push(
                            <div className="viewWrapItemLeft" key={item.timestamp}>
                                <div className="viewWrapItemLeft3">
                                    {this.isLastMessageLeft(index) ? (
                                        <img
                                            src={this.currentPeerUser.URL}
                                            alt="avatar"
                                            className="peerAvatarLeft"
                                        />
                                    ) : (
                                            <div className="viewPaddingLeft" />
                                        )}
                                    <div className="viewItemLeft">
                                        <span className="textContentItem">{item.content}</span>
                                    </div>
                                </div>
                                {this.isLastMessageLeft(index) ? (
                                    <span className="textTimeLeft">
                                        {moment(Number(item.timestamp)).format('ll')}
                                    </span>
                                ) : null}
                            </div>
                        )
                    } else if (item.type === 1) {
                        viewListMessage.push(
                            <div className="viewWrapItemLeft2" key={item.timestamp}>
                                <div className="viewWrapItemLeft3">
                                    {this.isLastMessageLeft(index) ? (
                                        <img
                                            src={this.currentPeerUser.PhotoURL}
                                            alt="avatar"
                                            className="peerAvatarLeft"
                                        />
                                    ) : (
                                            <div className="viewPaddingLeft" />
                                        )}
                                    <div className="viewItemLeft2">
                                        <img
                                            className="imgItemLeft"
                                            src={item.content}
                                            alt="content message"
                                        />
                                    </div>
                                </div>
                                {this.isLastMessageLeft(index) ? (
                                    <span className="textTimeLeft">
                                        {moment(Number(item.timestamp)).format('ll')}
                                    </span>
                                ) : null}
                            </div>
                        )
                    } else {
                        viewListMessage.push(
                            <div className="viewWrapItemLeft2" key={item.timestamp}>
                                <div className="viewWrapItemLeft3">
                                    {this.isLastMessageLeft(index) ? (
                                        <img
                                            src={this.currentPeerUser.PhotoURL}
                                            alt="avatar"
                                            className="peerAvatarLeft"
                                        />
                                    ) : (
                                            <div className="viewPaddingLeft" />
                                        )}
                                    <div className="viewItemLeft3" key={item.timestamp}>
                                        <img
                                            className="imgItemLeft"
                                            src={this.getGifImage(item.content)}
                                            alt="content message"
                                        />
                                    </div>
                                </div>
                                {this.isLastMessageLeft(index) ? (
                                    <span className="textTimeLeft">
                                        {moment(Number(item.timestamp)).format('ll')}
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
                        className="imgWaveHand"
                        src={images.wavehand}
                        alt="wave hand"
                    />
                </div>
            )
        }
    }

    renderStickers = () => {
        return (
            <div className="viewStickers">
                <img
                    className="imgSticker"
                    src={images.emoji1}
                    alt="sticker"
                    onClick={() => this.onSendMessage('emoji1', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.emoji2}
                    alt="sticker"
                    onClick={() => this.onSendMessage('emoji2', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.emoji3}
                    alt="sticker"
                    onClick={() => this.onSendMessage('emoji3', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.emoji4}
                    alt="sticker"
                    onClick={() => this.onSendMessage('emoji4', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.emoji5}
                    alt="sticker"
                    onClick={() => this.onSendMessage('emoji5', 2)}
                />
                <img
                    className="imgSticker"
                    src={images.emoji6}
                    alt="sticker"
                    onClick={() => this.onSendMessage('emoji6', 2)}
                />
            </div>
        )
    }

    hashString = str => {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
            hash += Math.pow(str.charCodeAt(i) * 31, str.length - i)
            hash = hash & hash
        }
        return hash
    }

    getGifImage = value => {
        switch (value) {
            case 'emoji1':
                return images.emoji1
            case 'emoji2':
                return images.emoji2
            case 'emoji3':
                return images.emoji3
            case 'emoji4':
                return images.emoji4
            case 'emoji5':
                return images.emoji5
            case 'emoji6':
                return images.emoji6
            default:
                return null
        }
    }

    isLastMessageLeft(index) {
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

    isLastMessageRight(index) {
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