import "../scss/notes.scss";
import { useState, useEffect } from "react";
import { collection, doc, getDocs, deleteDoc, setDoc, query } from "firebase/firestore";
import firebase from "../js/firebase.js";
import NotesContainer from "../components/NotesContainer";
import TrashModal from "../components/modals/TrashModal";
import NavState from "../context/NavContext";
import SideNav from "../components/SideNav";
import ThemeState from "../context/ThemeContext";
import UserAuth from "../context/UserContext";
import { useDisclosure } from "@chakra-ui/react";

const Trash = () => {
  const db = firebase.db;
  const { user } = UserAuth();
  const { theme } = ThemeState();


  const { isOpen, onOpen, onClose } = useDisclosure()
  const { searchText } = NavState()

  const [trashNotes, setTrashNotes] = useState([])


  const [currentNote, setCurrentNote] = useState({})

  // New Note
  const setModalData = (note) => {
    setCurrentNote(note)
  }

  const archiveCurrentNote = async () => {
    try {
      const userNotes = doc(collection(db, 'notes'), user.uid)
      const trashNote = doc(collection(userNotes, 'trash'), currentNote.id)
      await deleteDoc(trashNote)

      const archivedNote = doc(collection(userNotes, 'archived'), currentNote.id)
      await setDoc(archivedNote, currentNote)
      console.log('note archived')
      getNotes()
    } catch (error) {
      console.log(error)
    }
  }

  const restoreCurrentNote = async () => {
    try {
      const userNotesCollection = collection(db, 'notes')
      const userNotes = doc(userNotesCollection, user.uid)
      const trashNotesCollection = collection(userNotes, 'trash')
      const trashNote = doc(trashNotesCollection, currentNote.id)
      await deleteDoc(trashNote)

      const activeNotesCollection = collection(userNotes, 'active')
      const activeNote = doc(activeNotesCollection, currentNote.id)
      await setDoc(activeNote, currentNote)

      console.log('note restored from trash')
      getNotes()
    } catch (error) {
      console.log(error)
    }
  }

  const getNotes = async () => {
    try {
      const notes = []
      const q = query(collection(db, 'notes', user.uid, 'trash'))
      await getDocs(q).then(
        (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            notes.push({ id: doc.id, ...doc.data() })
          })
        }
      )
      setTrashNotes(notes)
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    getNotes()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`trash-page ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white'}`}>
      <div className="main-app container-fluid d-flex flex-row p-0 m-0">
        <SideNav />
        <div className="main-content py-3 col-12 col-md-10">
          <NotesContainer notes={trashNotes} searchText={searchText} setModalData={setModalData} onOpen={onOpen} />
        </div>
      </div>
      <TrashModal
        isOpen={isOpen}
        onClose={onClose}
        currentNote={currentNote}
        archiveCurrentNote={archiveCurrentNote}
        restoreCurrentNote={restoreCurrentNote}
      />
    </div>
  );
};

export default Trash;