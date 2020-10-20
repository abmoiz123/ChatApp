// import React from 'react';
// import * as firebase from 'firebase';

// var firebaseConfig = {
//     apiKey: "AIzaSyDrohpD7nI61Ee6p5qvvVdWKtgYh0bKVpU",
//     authDomain: "chatapp-3e5f9.firebaseapp.com",
//     databaseURL: "https://chatapp-3e5f9.firebaseio.com",
//     projectId: "chatapp-3e5f9",
//     storageBucket: "chatapp-3e5f9.appspot.com",
//     messagingSenderId: "704292027714",
//     appId: "1:704292027714:web:f75c68a9777371611f9cdb"
// };
// firebase.initializeApp(firebaseConfig);
// firebase.firestore().settings({
//     timestampsInSnapshots: true
// })

// export default firebase;
// import React from 'react';
import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyDrohpD7nI61Ee6p5qvvVdWKtgYh0bKVpU",
    authDomain: "chatapp-3e5f9.firebaseapp.com",
    databaseURL: "https://chatapp-3e5f9.firebaseio.com",
    projectId: "chatapp-3e5f9",
    storageBucket: "chatapp-3e5f9.appspot.com",
    messagingSenderId: "704292027714",
    appId: "1:704292027714:web:f75c68a9777371611f9cdb"
};
firebase.initializeApp(firebaseConfig);
// firebase.firestore().settings({
//     timestampsInSnapshots: true
// })

export const myFirebase = firebase
export const myFirestore = firebase.firestore()
export const myStorage = firebase.storage()