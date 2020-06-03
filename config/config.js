import firebase from 'firebase';


const config = {
    apiKey: "AIzaSyBKRH4FEsaFUIIazJr98VoCLUYy5srXDh0",
    authDomain: "photo-feed-5fd03.firebaseapp.com",
    databaseURL: "https://photo-feed-5fd03.firebaseio.com",
    projectId: "photo-feed-5fd03",
    storageBucket: "photo-feed-5fd03.appspot.com",
    messagingSenderId: "282556013904",
    appId: "1:282556013904:web:8f51a7db0c49df3b152055",
    measurementId: "G-FJV30CNRS2"
};
// Initialize Firebase
firebase.initializeApp(config);

export const f = firebase;
export const database = firebase.database();
export const auth = firebase.auth();
export const storage = firebase.storage();