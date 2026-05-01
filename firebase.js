var firebaseConfig = {
    apiKey: "AIzaSyBr_6qG54RZ8Pi-6-MN0ishMnbJlofBgxE",
    authDomain: "incentivequiz.firebaseapp.com",
    projectId: "incentivequiz",
    storageBucket: "incentivequiz.firebasestorage.app",
    messagingSenderId: "888079756974",
    appId: "1:888079756974:web:e8c89b2c76844735f0473f"
};

firebase.initializeApp(firebaseConfig);

var auth = firebase.auth();
var db = firebase.firestore();
