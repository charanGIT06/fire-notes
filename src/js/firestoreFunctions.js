import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
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

const firestoreFunctions = {
  moveNote,
}

export default firestoreFunctions;