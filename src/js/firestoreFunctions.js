import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import firebase from "./firebase";

const db = firebase.db;


const moveNote = async (displayName, from, to, note, onClose, getNotes) => {
  try {
    const userNotesCollection = collection(db, "notes");
    const userNotes = doc(userNotesCollection, displayName);
    const activeNote = doc(collection(userNotes, from), note.id);
    await deleteDoc(activeNote);

    const deletedNote = doc(collection(userNotes, to), note.id);
    await setDoc(deletedNote, note);

    console.log("note deleted");
    onClose();
    getNotes();
  } catch (error) {
    console.log(error);
  }
}

const getUserFromEmail = async (email) => {
  try {
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    const user = querySnapshot.docs.map((doc) => {
      return {
        uid: doc.data().uid,
        email: doc.data().email,
        displayName: doc.data().displayName,
        firstName: doc.data().profile.firstName,
        lastName: doc.data().profile.lastName,
      };
    });
    if (user.length === 0) {
      return "none";
    }
    return user[0];
  } catch (error) {
    console.log(error);
  }
};

const firestoreFunctions = {
  moveNote,
  getUserFromEmail,
}

export default firestoreFunctions;