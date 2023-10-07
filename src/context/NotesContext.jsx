import { useContext, createContext, useState, useEffect } from "react";
import propTypes from "prop-types";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import firebase from "../js/firebase.js";
import UserAuth from "./UserContext";

const NotesContext = createContext();

export function NotesProvider({ children }) {
  NotesProvider.propTypes = {
    children: propTypes.node.isRequired,
  };

  const db = firebase.db;
  const { user } = UserAuth();

  const [activeNotes, setActiveNotes] = useState([]);
  const [archiveNotes, setArchiveNotes] = useState([]);
  const [trashNotes, setTrashNotes] = useState([]);
  const [sharedNotes, setSharedNotes] = useState([]);
  const [presentNote, setPresentNote] = useState({});

  const updateNote = async () => {
    try {
      const noteRef = doc(
        collection(db, "notes", user.uid, "active"),
        presentNote.id
      );
      await setDoc(noteRef, presentNote).then(() => {
        // console.log('Document successfully updated!');
        getNotes("active");
      });

      // Update this note for all the collaborators
      presentNote?.collaborators?.forEach(async (collaborator) => {
        const collaboratorNoteRef = doc(
          collection(db, "notes", collaborator.uid, "shared"),
          presentNote.id
        );
        await setDoc(collaboratorNoteRef, presentNote).then(() => {
          // console.log('Document successfully updated!');
          getNotes("shared");
        });
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  const archiveNote = async () => {
    try {
      const userNotesRef = doc(collection(db, "notes"), user.uid);
      const activeNoteRef = doc(
        collection(userNotesRef, "active"),
        presentNote.id
      );
      await deleteDoc(activeNoteRef);

      const archivedNote = doc(
        collection(userNotesRef, "archive"),
        presentNote.id
      );
      await setDoc(archivedNote, presentNote);
      console.log("note archived");
      getNotes("active");
      getNotes("archive");
    } catch (error) {
      console.log(error);
    }
  };

  const unArchiveNote = async () => {
    try {
      const userNotes = doc(collection(db, "notes"), user.uid);
      const archivedNote = doc(
        collection(userNotes, "archive"),
        presentNote.id
      );
      await deleteDoc(archivedNote);

      const activeNote = doc(collection(userNotes, "active"), presentNote.id);
      await setDoc(activeNote, presentNote);

      console.log("note Unarchived");
      getNotes("active");
      getNotes("archive");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteNote = async () => {
    try {
      const userNotesCollection = collection(db, "notes");
      const userNotes = doc(userNotesCollection, user.uid);
      const activeNote = doc(collection(userNotes, "active"), presentNote.id);
      await deleteDoc(activeNote);

      const deletedNote = doc(collection(userNotes, "trash"), presentNote.id);
      await setDoc(deletedNote, presentNote);

      console.log("note deleted");
      getNotes("active");
      getNotes("trash");
    } catch (error) {
      console.log(error);
    }
  };

  const restoreNote = async () => {
    try {
      const userNotesCollection = collection(db, "notes");
      const userNotes = doc(userNotesCollection, user.uid);
      const trashNotesCollection = collection(userNotes, "trash");
      const trashNote = doc(trashNotesCollection, presentNote.id);
      await deleteDoc(trashNote);

      const activeNotesCollection = collection(userNotes, "active");
      const activeNote = doc(activeNotesCollection, presentNote.id);
      await setDoc(activeNote, presentNote);

      console.log("note restored from trash");
      getNotes("active");
      getNotes("trash");
    } catch (error) {
      console.log(error);
    }
  };

  const updateCurrentNote = async (person) => {
    console.log("2. Executing updateCurrentNote");
    const noteRef = doc(
      collection(db, "notes", user.uid, "active"),
      presentNote.id
    );
    await updateDoc(noteRef, {
      ...presentNote,
      collaborators: [...presentNote.collaborators, person],
    })
      .then(() => {
        setPresentNote({
          ...presentNote,
          collaborators: [...presentNote.collaborators, person],
        });
        console.log("Document successfully updated!");
        getNotes("active");
      })
      .catch((error) => {
        console.log(error);
      });
    getNotes("active");
  };

  const shareNote = async (person, permission) => {
    console.log("1. Executing Share Note");
    if (!person) {
      return "Invalid Data!";
    } else {
      console.log(person);

      if (person.uid === undefined) {
        return "User not found!";
      } else if (person.uid === presentNote.uid) {
        return "You cannot share with yourself!";
      } else if (presentNote.collaborators.length > 0) {
        const isAlreadyShared = presentNote.collaborators.find(
          (collaborator) => collaborator.uid === person.uid
        );
        if (isAlreadyShared) {
          console.log("User already has access to this note!");
          return "User already has access to this note!";
        }
      }
      const sharedNotesRef = collection(db, "notes", person.uid, "shared");
      const sharedNote = doc(sharedNotesRef, presentNote.id);
      await setDoc(sharedNote, {
        ...presentNote,
        permission: {
          canEdit: permission,
        },
        collaborators: [],
        owner: {
          displayName: user.displayName,
          email: user.email,
          uid: user.uid,
        },
      }).catch((error) => {
        console.log(error);
      });

      await updateCurrentNote({
        displayName: person.displayName,
        email: person.email,
        uid: person.uid,
        permission: {
          canEdit: permission,
        },
      });
    }
    return "success";
  };

  const getNotes = async (page) => {
    try {
      const notes = [];
      const q = query(
        collection(db, "notes", user.uid, page),
        orderBy("timestamp", "desc")
      );
      await getDocs(q).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          notes.push({ id: doc.id, ...doc.data() });
        });
      });

      if (page === "active") {
        setActiveNotes(notes);
      } else if (page === "archive") {
        setArchiveNotes(notes);
      } else if (page === "trash") {
        setTrashNotes(notes);
      } else if (page === "shared") {
        setSharedNotes(notes);
      }
      // setNotes(notes)
      // console.log('notes', notes)
    } catch (error) {
      // console.log('error', error)
      null;
    }
  };

  useEffect(() => {
    if (user && user.uid !== undefined) {
      getNotes("active");
      getNotes("archive");
      getNotes("trash");
      getNotes("shared");
    }
  }, [user]); //eslint-disable-line

  return (
    <NotesContext.Provider
      value={{
        activeNotes,
        setActiveNotes,
        archiveNotes,
        setArchiveNotes,
        trashNotes,
        setTrashNotes,
        sharedNotes,
        setSharedNotes,
        getNotes,
        presentNote,
        setPresentNote,
        updateNote,
        archiveNote,
        deleteNote,
        unArchiveNote,
        restoreNote,
        shareNote,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}

const NotesState = () => {
  return useContext(NotesContext);
};

export default NotesState;
