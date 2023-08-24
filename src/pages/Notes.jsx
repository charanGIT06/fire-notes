import SideNav from '../components/SideNav'
import {
	Input, Textarea, Tooltip, useDisclosure, Button,
} from "@chakra-ui/react";
import { useState } from "react";
import { collection, doc, addDoc, updateDoc, deleteDoc, setDoc, serverTimestamp } from "firebase/firestore";
import firebase from "../js/firebase.js";
import NotesContainer from "../components/NotesContainer";
import NavState from '../context/NavContext';
import UserAuth from '../context/UserContext';
import NoteModal from '../components/modals/NoteModal';
import ThemeState from '../context/ThemeContext';
import NotesState from '../context/NotesContext';

const Notes = () => {
	// Firestore Credentials
	const db = firebase.db;

	// Context
	const { user } = UserAuth();
	const { searchText } = NavState()
	const { theme } = ThemeState()

	// Props
	const { isOpen, onOpen, onClose } = useDisclosure()

	// Notes
	// const [notes, setNotes] = useState([])
	const { activeNotes, getNotes } = NotesState()

	// Current Note
	const [currentNote, setCurrentNote] = useState({})
	const [currentNoteChanged, setCurrentNoteChanged] = useState(false)

	// New Note
	const [newNote, setNewNote] = useState({})
	const [newNoteChanged, setNewNoteChanged] = useState(false)

	const setModalData = (note) => {
		setCurrentNote({ ...note })
	}

	const updateNote = async () => {
		if (!currentNoteChanged) {
			console.log('No changes made to note')
			return
		} else {
			try {
				const activeNoteRef = doc(collection(db, 'notes', user.uid, 'active'), currentNote.id)
				await updateDoc(activeNoteRef, currentNote)
				console.log('Note updated!')

				setCurrentNote({})
				setCurrentNoteChanged(false)

				onClose()
				getNotes('active')
			} catch (error) {
				console.log(error)
			}
		}
	}

	const archiveNote = async () => {
		try {
			const userNotesRef = doc(collection(db, 'notes'), user.uid)
			const activeNoteRef = doc(collection(userNotesRef, 'active'), currentNote.id)
			await deleteDoc(activeNoteRef)

			const archivedNote = doc(collection(userNotesRef, 'archive'), currentNote.id)
			await setDoc(archivedNote, currentNote)
			console.log('note archived')
			onClose()
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
			const activeNote = doc(collection(userNotes, 'active'), currentNote.id)
			await deleteDoc(activeNote)

			const deletedNote = doc(collection(userNotes, 'trash'), currentNote.id)
			await setDoc(deletedNote, currentNote)

			console.log('note deleted')
			onClose()
			getNotes('active')
			getNotes('trash')
		} catch (error) {
			console.log(error)
		}
	}

	const addNote = async () => {
		if (!newNoteChanged) {
			console.log('empty note')
			return
		} else {
			const time = serverTimestamp()
			try {
				const newNoteRef = doc(collection(db, 'notes'), user.uid)
				const activeNotesCollection = collection(newNoteRef, 'active')
				await addDoc(activeNotesCollection, {
					uid: user.uid,
					timestamp: time,
					collaborators: [],
					...newNote,
				}).then(() => {
					setNewNote({})
					setNewNoteChanged(false)
					document.getElementById('title-input').value = ''
					document.getElementById('content-input').value = ''
					getNotes('active')
					console.log('Note added!')
				})
			} catch (error) {
				console.log('error', error)
			}
		}
	}

	return (
		<div className={`notes-page ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white'}`}>
			<div className="main-app d-flex flex-row p-0 m-0">
				<SideNav />
				<div className="main-section col-12 col-md-10 py-3">
					<div className="main-content">
						<div className="header px-3">
							<div className={`new-note mt-2 mb-3 mx-0 ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white'}`} >
								<div className={`new-note-container mb-1 ${(newNoteChanged) ? 'px-4 py-3 shadow' : 'px-2'} `}>
									<div className={`new-note-header mb-2 d-flex flex-row `} onKeyDown={(e) => {
										if (e.key === 'Escape') {
											addNote()
										}
									}}>
										<Input id='title-input' type="text" placeholder={`${(newNoteChanged) ? 'Title' : "Take a note..."}`} variant='flushed' focusBorderColor="yellow.400" onChange={(e) => {
											if (!newNoteChanged) {
												setNewNoteChanged(true)
											}
											setNewNote({ ...newNote, title: e.target.value })
										}} />
									</div>
									<div className="new-note-body p-0 m-0">
										<Textarea
											id="content-input"
											className={`text-area mb-4 ${(newNoteChanged) ? 'd-inline' : 'd-none'}`} placeholder="Take a note..."
											rows='1' size='md' height={50} variant='unstyled'
											onChange={(e) => {
												setNewNote({ ...newNote, content: e.target.value })
												if (e.target.value === '') {
													e.target.style.height = '20px'
												} else {
													e.target.style.height = `${e.target.scrollHeight}` + 'px';
												}
											}} />
									</div>
									<div className={`footer d-flex flex-row mt-2 ${(newNoteChanged) ? 'd-inline' : 'd-none'}`}>
										<div className="btns d-flex flex-row justify-content-end w-100">
											<Tooltip label='Close' hasArrow='true'>
												<Button className='me-2' variant='solid' colorScheme='yellow' onClick={() => {
													addNote()
												}}>
													Save
												</Button>
											</Tooltip>
										</div>
									</div>
								</div>
							</div>
						</div>
						<NotesContainer notes={activeNotes} searchText={searchText} setModalData={setModalData} onOpen={onOpen} />
					</div>
				</div>
				<div className="note-modal" onKeyUp={(e) => { if (e.key === 'Escape') { updateNote() } }}>
					<NoteModal
						isOpen={isOpen} onClose={onClose}
						currentNote={currentNote}
						setCurrentNote={setCurrentNote}
						currentNoteChanged={currentNoteChanged}
						setCurrentNoteChanged={setCurrentNoteChanged}
						updateNote={updateNote}
						deleteNote={deleteNote}
						archiveNote={archiveNote}
						setModalData={setModalData}
						getNotes={getNotes}
					/>
				</div>
			</div>
		</div>
	)
}

export default Notes