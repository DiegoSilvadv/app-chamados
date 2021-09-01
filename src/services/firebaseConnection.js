import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage' 
import 'firebase/firestore';

let firebaseConfig = {
    apiKey: "AIzaSyDzBxJ2EyYaJPag42sTY4b9BSmpTtlpUHs",
    authDomain: "chamados-1d585.firebaseapp.com",
    projectId: "chamados-1d585",
    storageBucket: "chamados-1d585.appspot.com",
    messagingSenderId: "1031421257690",
    appId: "1:1031421257690:web:09a12d50b552ace42a82e3",
    measurementId: "G-CRGVM8JS3L"
};
if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}
// Initialize Firebase

export default firebase;