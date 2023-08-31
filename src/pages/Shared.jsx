import { useEffect, useState } from "react" // eslint-disable-line no-unused-vars
import NotesContainer from "../components/NotesContainer"
import SideNav from "../components/SideNav"
import ThemeState from "../context/ThemeContext"
// import UserAuth from "../context/UserContext"
// import { collection, getDocs } from "firebase/firestore"
// import firebase from "../js/firebase"
import NavState from "../context/NavContext"
import { IconButton, useDisclosure, Tooltip } from "@chakra-ui/react"
import SharedModal from "../components/modals/SharedModal"
import NotesState from "../context/NotesContext"
import { MdRefresh } from "react-icons/md"
import UserAuth from "../context/UserContext"
import { useNavigate } from "react-router-dom"

const Shared = () => {
  const { theme } = ThemeState()
  const { user } = UserAuth()
  const { searchText } = NavState()
  const navigate = useNavigate()

  // Props
  // const db = firebase.db
  const { isOpen, onOpen, onClose } = useDisclosure()

  // const [sharedNotes, setSharedNotes] = useState([])
  const { sharedNotes, getNotes } = NotesState()

  const [currentNote, setCurrentNote] = useState({})

  const setModalData = (note) => {
    setCurrentNote({ ...note })
  }
  // const unArchiveCurrentNote = async () => {
  //   try {
  //     const userNotes = doc(collection(db, 'notes'), user.uid)
  //     const archivedNote = doc(collection(userNotes, 'archived'), currentNote.id)
  //     await deleteDoc(archivedNote)

  //     const activeNote = doc(collection(userNotes, 'active'), currentNote.id)
  //     await setDoc(activeNote, currentNote)

  //     console.log('note Unarchived')
  //     onClose()
  //     getNotes()
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // const deleteCurrentNote = async () => {
  //   try {
  //     const userNotes = doc(collection(db, 'notes'), user.uid)
  //     const archivedNote = doc(collection(userNotes, 'archived'), currentNote.id)
  //     await deleteDoc(archivedNote)

  //     const deletedNotesCollection = collection(userNotes, 'trash')
  //     const deletedNote = doc(deletedNotesCollection, currentNote.id)
  //     await setDoc(deletedNote, currentNote)

  //     console.log('note deleted from archive')
  //     getNotes()
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }


  // const getNotes = async () => {
  //   try {
  //     const notes = []
  //     console.log('Inside GetNotes')
  //     const docRef = collection(db, 'notes', user.uid, 'shared')
  //     const docs = await getDocs(docRef)
  //     docs.forEach(doc => {
  //       notes.push(doc.data())
  //     })

  //     setSharedNotes(notes)
  //     // console.log('notes', notes)
  //   } catch (error) {
  //     // console.log('error', error)
  //     null
  //   }
  // }

  // useEffect(() => {
  //   if (user) {
  //     getNotes()
  //   }
  // }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`notes-page ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white'}`}>
      <div className="main-app d-flex flex-row p-0 m-0">
        <SideNav />
        <div className="main-section col-12 col-md-10 py-3">
          <div className="main-content">
            <div className="header d-flex align-items-center mb-3">
              <h5 className="ms-3 w-100">Shared</h5>
              <Tooltip title="Refresh" placement="bottom">
                <IconButton icon={<MdRefresh />} className="me-3" isRound={true} onClick={() => {
                  if (user) {
                    getNotes('shared')
                  } else {
                    navigate('/login')
                  }
                }} />
              </Tooltip>
            </div>
            <NotesContainer notes={sharedNotes} searchText={searchText} setModalData={setModalData} onOpen={onOpen} from={'shared'} />
          </div>
        </div>

        <SharedModal
          isOpen={isOpen}
          onClose={onClose}
          onOpen={onOpen}
          currentNote={currentNote}
        // unArchiveCurrentNote={unArchiveCurrentNote}
        // deleteCurrentNote={deleteCurrentNote}
        />
      </div>
    </div>
  )
}

export default Shared