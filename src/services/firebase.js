import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBb4T0cLCxcfQZm1H-g8Vf4ZkX13dAi2fk",
    authDomain: "svigufotardevinicius.firebaseapp.com",
    databaseURL: "https://svigufotardevinicius.firebaseio.com",
    projectId: "svigufotardevinicius",
    storageBucket: "svigufotardevinicius.appspot.com",
    messagingSenderId: "638792635835",
    appId: "1:638792635835:web:4506327d41e4ab3b"
  };

  firebase.initializeApp(firebaseConfig);

export default firebase;