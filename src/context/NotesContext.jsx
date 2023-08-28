import { useContext, createContext, useState, useEffect } from 'react';
import propTypes from 'prop-types'
import { collection, getDocs, query } from 'firebase/firestore';
import firebase from '../js/firebase.js';
import UserAuth from './UserContext';

const NotesContext = createContext();

export function NotesProvider({ children }) {
  NotesProvider.propTypes = {
    children: propTypes.node.isRequired,
  };

  const db = firebase.db
  const { user } = UserAuth()

  const [activeNotes, setActiveNotes] = useState([])
  const [archiveNotes, setArchiveNotes] = useState([])
  const [trashNotes, setTrashNotes] = useState([])
  const [sharedNotes, setSharedNotes] = useState([])

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
    <NotesContext.Provider value={{ activeNotes, setActiveNotes, archiveNotes, setArchiveNotes, trashNotes, setTrashNotes, sharedNotes, setSharedNotes, getNotes }}>
      {children}
    </NotesContext.Provider>
  )
}

const NotesState = () => {
  return useContext(NotesContext)
}

export default NotesState