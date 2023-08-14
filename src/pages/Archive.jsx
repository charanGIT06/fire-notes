import SideNav from '../components/SideNav'
import { useDisclosure } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { collection, doc, getDocs, deleteDoc, setDoc, query } from "firebase/firestore";
import firebase from "../js/firebase.js";
import NotesContainer from "../components/NotesContainer";
import NavState from '../context/NavContext';
import ThemeState from '../context/ThemeContext';
import ArchiveModal from '../components/modals/ArchiveModal';
import UserAuth from '../context/UserContext';

const Archive = () => {
  const db = firebase.db;
  const { user } = UserAuth()
  const { theme } = ThemeState()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { searchText } = NavState()

  const [archiveNotes, setArchiveNotes] = useState([])

  const [currentNote, setCurrentNote] = useState({})

  const setModalData = (note) => {
    setCurrentNote(note)
  }

  const unArchiveCurrentNote = async () => {
    try {
      const userNotes = doc(collection(db, 'notes'), user.uid)
      const archivedNote = doc(collection(userNotes, 'archived'), currentNote.id)
      await deleteDoc(archivedNote)

      const activeNote = doc(collection(userNotes, 'active'), currentNote.id)
      await setDoc(activeNote, currentNote)

      console.log('note Unarchived')
      onClose()
      getNotes()
    } catch (error) {
      console.log(error)
    }
  }

  const deleteCurrentNote = async () => {
    try {
      const userNotes = doc(collection(db, 'notes'), user.uid)
      const archivedNote = doc(collection(userNotes, 'archived'), currentNote.id)
      await deleteDoc(archivedNote)

      const deletedNotesCollection = collection(userNotes, 'trash')
      const deletedNote = doc(deletedNotesCollection, currentNote.id)
      await setDoc(deletedNote, currentNote)

      console.log('note deleted from archive')
      getNotes()
    } catch (error) {
      console.log(error)
    }
  }

  const getNotes = async () => {
    try {
      const notes = []
      const q = query(collection(db, 'notes', user.uid, 'archived'))
      await getDocs(q).then(
        (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            notes.push({ id: doc.id, ...doc.data() })
          })
        }
      )
      setArchiveNotes(notes)
    } catch (error) {
      console.log('error', error)
    }
  }

  useEffect(() => {
    getNotes()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  
  return (
    <div className={`archive-page ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white'}`}>
      <div className="main-app container-fluid d-flex flex-row p-0 m-0">
        <SideNav />

        <div className="main-content py-3 col-12 col-md-10">
          <NotesContainer notes={archiveNotes} searchText={searchText} setModalData={setModalData} onOpen={onOpen} />
        </div>

        <ArchiveModal
          isOpen={isOpen}
          onClose={onClose}
          onOpen={onOpen}
          currentNote={currentNote}
          unArchiveCurrentNote={unArchiveCurrentNote}
          deleteCurrentNote={deleteCurrentNote}
        />
      </div>
    </div>
  )
}

export default Archive