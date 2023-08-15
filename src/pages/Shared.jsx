import { useEffect, useState } from "react"
import NotesContainer from "../components/NotesContainer"
import SideNav from "../components/SideNav"
import ThemeState from "../context/ThemeContext"
import UserAuth from "../context/UserContext"
import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from "firebase/firestore"
import firebase from "../js/firebase"
import NavState from "../context/NavContext"
import { useDisclosure } from "@chakra-ui/react"
import ArchiveModal from "../components/modals/ArchiveModal"



const Shared = () => {
  const { theme } = ThemeState()
  const { user } = UserAuth()
  const { searchText } = NavState()

  // Props
  const { isOpen, onOpen, onClose } = useDisclosure()
  const db = firebase.db

  const [sharedNotes, setSharedNotes] = useState([])

  const [currentNote, setCurrentNote] = useState({})

  const setModalData = (note) => {
    setCurrentNote({ ...note })
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
      const q = query(collection(db, 'notes', user.uid, 'active'))
      await getDocs(q).then(
        (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            notes.push({ id: doc.id, ...doc.data() })
          })
        }
      )

      setSharedNotes(notes)
      // console.log('notes', notes)
    } catch (error) {
      // console.log('error', error)
      null
    }
  }

  useEffect(() => {
    if (user) {
      getNotes()
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`notes-page ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white'}`}>
      <div className="main-app d-flex flex-row p-0 m-0">
        <SideNav />
        <div className="main-section col-12 col-md-10 py-3">
          <div className="main-content">
            <h1>Shared</h1>
            <NotesContainer notes={sharedNotes} searchText={searchText} setModalData={setModalData} onOpen={onOpen} />
          </div>
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

export default Shared