import firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyC3qPpnbsIF6lwPEl8EaB9GhS77NTB7B6k",
  authDomain: "synchro-development-1.firebaseapp.com",
  databaseURL: "https://synchro-development-1-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "synchro-development-1",
  storageBucket: "synchro-development-1.appspot.com",
  messagingSenderId: "686041670376",
  appId: "1:686041670376:web:8e846efa4f80279a135f5d"
};

  const fire = firebase.initializeApp(firebaseConfig);
 

  export {fire};
