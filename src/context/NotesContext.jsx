import { useContext, createContext, useState, useEffect } from 'react';
import propTypes from 'prop-types'
import { collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import firebase from '../js/firebase.js';
import UserAuth from './UserContext';
import { useToast } from '@chakra-ui/react';

const NotesContext = createContext();

export function NotesProvider({ children }) {
  NotesProvider.propTypes = {
    children: propTypes.node.isRequired,
  };

  const db = firebase.db
  const { user } = UserAuth()
  const toast = useToast()

  const [activeNotes, setActiveNotes] = useState([])
  const [archiveNotes, setArchiveNotes] = useState([])
  const [trashNotes, setTrashNotes] = useState([])
  const [sharedNotes, setSharedNotes] = useState([])
  const [presentNote, setPresentNote] = useState({})

  const updateNote = async () => {
    try {
      const noteRef = doc(collection(db, 'notes', user.uid, 'active'), presentNote.id);
      await updateDoc(noteRef, presentNote).then(() => {
        // console.log('Document successfully updated!');
        getNotes('active')
      });
    } catch (error) {
      console.log('error', error)
    }
  }

  const archiveNote = async () => {
    try {
      const userNotesRef = doc(collection(db, 'notes'), user.uid)
      const activeNoteRef = doc(collection(userNotesRef, 'active'), presentNote.id)
      await deleteDoc(activeNoteRef)

      const archivedNote = doc(collection(userNotesRef, 'archive'), presentNote.id)
      await setDoc(archivedNote, presentNote)
      console.log('note archived')
      getNotes('active')
      getNotes('archive')
    } catch (error) {
      console.log(error)
    }
  }

  const unArchiveNote = async () => {
    try {
      const userNotes = doc(collection(db, 'notes'), user.uid)
      const archivedNote = doc(collection(userNotes, 'archive'), presentNote.id)
      await deleteDoc(archivedNote)

      const activeNote = doc(collection(userNotes, 'active'), presentNote.id)
      await setDoc(activeNote, presentNote)

      console.log('note Unarchived')
      getNotes('active')
      getNotes('archive')
    } catch (error) {
      console.log(error)
    }
  }

  const deleteNote = async () => {
    try {
      const userNotesCollection = collection(db, 'notes')
      const userNotes = doc(userNotesCollection, user.uid)
      const activeNote = doc(collection(userNotes, 'active'), presentNote.id)
      await deleteDoc(activeNote)

      const deletedNote = doc(collection(userNotes, 'trash'), presentNote.id)
      await setDoc(deletedNote, presentNote)

      console.log('note deleted')
      getNotes('active')
      getNotes('trash')
    } catch (error) {
      console.log(error)
    }
  }

  const restoreNote = async () => {
    try {
      const userNotesCollection = collection(db, 'notes')
      const userNotes = doc(userNotesCollection, user.uid)
      const trashNotesCollection = collection(userNotes, 'trash')
      const trashNote = doc(trashNotesCollection, presentNote.id)
      await deleteDoc(trashNote)

      const activeNotesCollection = collection(userNotes, 'active')
      const activeNote = doc(activeNotesCollection, presentNote.id)
      await setDoc(activeNote, presentNote)

      console.log('note restored from trash')
      getNotes('active')
      getNotes('trash')
    } catch (error) {
      console.log(error)
    }
  }

  const shareNote = async (email, permission) => {
    if (email === '') {
      return 'Email is required!'
    } else {
      console.log('email', email)

      let sharedPerson = {}
      const usersRef = query(collection(db, 'users'), where('email', '==', email))
      await getDocs(usersRef).then(
        (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            sharedPerson = { id: doc.id, ...doc.data() }
          })
        }
      ).catch((error) => {
        console.log(error)
      })

      if (sharedPerson.uid === undefined) {
        return 'User not found!'
      } else if (sharedPerson.uid === presentNote.uid) {
        return 'You cannot share with yourself!'
      } else if (presentNote.collaborators.length > 0) {
        const isAlreadyShared = presentNote.collaborators.find((collaborator) => collaborator.uid === sharedPerson.uid)
        if (isAlreadyShared) {
          return 'User already has access to this note!'
        } 
      } else {
        await updateDoc(doc(collection(db, 'notes', user.uid, 'active'), presentNote.id), {
          ...presentNote,
          collaborators: [...presentNote.collaborators, {
            displayName: sharedPerson.displayName,
            email: sharedPerson.email,
            uid: sharedPerson.uid,
            permission: {
              canEdit: permission,
            }
          }]
        }).then(() => {
          toast({
            title: 'Note shared!',
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
        }).catch((error) => {
          console.log(error)
        })

        const sharedNotesRef = collection(db, 'notes', sharedPerson.uid, 'shared')
        const sharedNote = doc(sharedNotesRef, presentNote.id)
        await setDoc(sharedNote, {
          ...presentNote,
          permission: {
            canEdit: permission,
          },
          collaborators: [],
          owner: {
            displayName: user.displayName,
            email: user.email,
          }
        }).then(() => {
          toast({
            title: 'Note shared!',
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
        }).catch((error) => {
          console.log(error)
        })
      }

      return 'success'
    }
  }

  const getNotes = async (page) => {
    try {
      const notes = []
      const q = query(collection(db, 'notes', user.uid, page))
      await getDocs(q).then(
        (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            notes.push({ id: doc.id, ...doc.data() })
          })
        }
      )

      if (page === 'active') {
        setActiveNotes(notes)
      } else if (page === 'archive') {
        setArchiveNotes(notes)
      } else if (page === 'trash') {
        setTrashNotes(notes)
      } else if (page === 'shared') {
        setSharedNotes(notes)
      }
      // setNotes(notes)
      // console.log('notes', notes)
    } catch (error) {
      // console.log('error', error)
      null
    }
  }

  useEffect(() => {
    if (user && user.uid !== undefined) {
      getNotes('active')
      getNotes('archive')
      getNotes('trash')
      getNotes('shared')
    }
  }, [user]) //eslint-disable-line

  return (
    <NotesContext.Provider value={{
      activeNotes, setActiveNotes, archiveNotes, setArchiveNotes, trashNotes, setTrashNotes, sharedNotes, setSharedNotes,
      getNotes, presentNote, setPresentNote, updateNote, archiveNote, deleteNote, unArchiveNote, restoreNote, shareNote
    }}>
      {children}
    </NotesContext.Provider>
  )
}

const NotesState = () => {
  return useContext(NotesContext)
}

export default NotesState