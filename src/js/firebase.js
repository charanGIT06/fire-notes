import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth"; //  eslint-disable-line
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore"; //eslint-disable-line

const firebaseConfig = {
  apiKey: "AIzaSyAQhG7kEgPHYElMrN3yUFTsdCGvgWAVnL4",
  authDomain: "fire-note-me.firebaseapp.com",
  projectId: "fire-note-me",
  storageBucket: "fire-note-me.appspot.com",
  messagingSenderId: "982063005277",
  appId: "1:982063005277:web:f56f9f7b7d7b60d73097b4",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
// connectAuthEmulator(auth, "http://127.0.0.1:9099", { disableWarnings: true });

const db = getFirestore(app);
// connectFirestoreEmulator(db, "127.0.0.1", 8080);

const firebase = {
  app,
  auth,
  db,
};

export default firebase;
