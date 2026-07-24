const firebaseConfig = {
    apiKey: "AIzaSyAS2L4k9Pi0dQSsioN4BHyyti5en9dKlzY",
    authDomain: "fatu-delicias.firebaseapp.com",
    projectId: "fatu-delicias",
    storageBucket: "fatu-delicias.firebasestorage.app",
    messagingSenderId: "7774749246",
    appId: "1:7774749246:web:5b83cc63ec969e893bc76f"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();