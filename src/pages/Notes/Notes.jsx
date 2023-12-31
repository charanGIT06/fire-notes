import SideNav from "../../components/Navigation/SideNav";
import {
  Input,
  Textarea,
  Tooltip,
  useDisclosure,
  Button,
  IconButton, // eslint-disable-line no-unused-vars
} from "@chakra-ui/react"; // eslint-disable-line no-unused-vars
import { useState } from "react";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import firebase from "../../js/firebase.js";
import NotesContainer from "../../components/Notes/NotesContainer";
import NavState from "../../context/NavContext";
import UserAuth from "../../context/UserContext";
import NoteModal from "../../components/modals/NoteModal";
import ThemeState from "../../context/ThemeContext";
import NotesState from "../../context/NotesContext";
import { useNavigate } from "react-router-dom";

const Notes = () => {
  // Utils
  const navigate = useNavigate();

  // Firestore Credentials
  const db = firebase.db;

  // Context
  const { user } = UserAuth();
  const { searchText } = NavState();
  const { theme } = ThemeState();

  // Props
  const { isOpen, onClose } = useDisclosure();

  // Notes
  // const [notes, setNotes] = useState([])
  const { activeNotes, getNotes } = NotesState();
  const notes = activeNotes.filter((note) => {
    if (note.isPinned === false || note.isPinned === undefined) {
      return note;
    }
  });
  const pinnedNotes = activeNotes.filter((note) => {
    if (note.isPinned === true) {
      return note;
    }
  });

  // Current Note
  const [currentNote, setCurrentNote] = useState({});
  const [currentNoteChanged, setCurrentNoteChanged] = useState(false);

  // New Note
  const [newNote, setNewNote] = useState({});
  const [newNoteChanged, setNewNoteChanged] = useState(false);

  const setModalData = (note) => {
    setCurrentNote({ ...note });
  };

  const updateNote = async () => {
    if (!currentNoteChanged) {
      return;
    } else {
      try {
        // Updating the note in the active collection
        // console.log(currentNote)
        const activeNoteRef = doc(
          collection(db, "notes", user.uid, "active"),
          currentNote.id
        );
        await updateDoc(activeNoteRef, currentNote).then(() => {
          // Updating the note for collaborators
          currentNote.collaborators.forEach((collaborator) => {
            const sharedDoc = doc(
              db,
              "notes",
              collaborator.uid,
              "shared",
              currentNote.id
            );
            console.log(collaborator.uid, currentNote.id);
            updateDoc(sharedDoc, {
              ...currentNote,
            });
          });
        });
        setCurrentNote({});
        setCurrentNoteChanged(false);

        onClose();
        getNotes("active");
      } catch (error) {
        console.log(error, "notes", "line 64");
      }
    }
  };

  const archiveNote = async () => {
    try {
      const userNotesRef = doc(collection(db, "notes"), user.uid);
      const activeNoteRef = doc(
        collection(userNotesRef, "active"),
        currentNote.id
      );
      await deleteDoc(activeNoteRef);

      const archivedNote = doc(
        collection(userNotesRef, "archive"),
        currentNote.id
      );
      await setDoc(archivedNote, currentNote);
      console.log("note archived");
      onClose();
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
      const activeNote = doc(collection(userNotes, "active"), currentNote.id);
      await deleteDoc(activeNote);

      const deletedNote = doc(collection(userNotes, "trash"), currentNote.id);
      await setDoc(deletedNote, currentNote);

      console.log("note deleted");
      onClose();
      getNotes("active");
      getNotes("trash");
    } catch (error) {
      console.log(error);
    }
  };

  const addNote = async () => {
    if (!newNoteChanged) {
      console.log("empty note");
      return;
    } else {
      const time = serverTimestamp();
      try {
        const newNoteRef = doc(collection(db, "notes"), user.uid);
        const activeNotesCollection = collection(newNoteRef, "active");
        await addDoc(activeNotesCollection, {
          ...newNote,
          uid: user.uid,
          timestamp: time,
          collaborators: [],
          labels: [],
          isPinned: false,
        }).then(() => {
          setNewNote({});
          setNewNoteChanged(false);
          document.getElementById("title-input").value = "";
          document.getElementById("content-input").value = "";
          getNotes("active");
          console.log("Note added!");
        });
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  return (
    <div
      className={`notes-page ${
        theme === "dark" ? "dark-theme text-white" : "light-theme"
      }`}
    >
      <div className='main-app d-flex flex-row p-0 m-0'>
        <SideNav />
        <div className='main-section col-12 col-md-10 py-3'>
          <div className='main-content'>
            <div className='header px-3'>
              <div className={`new-note mt-2 mb-3 mx-0`}>
                <div
                  className={`new-note-container mb-1 ${
                    newNoteChanged
                      ? `${
                          theme === "dark"
                            ? "dark-element px-4 py-3 shadow"
                            : "light-element px-4 py-3 shadow"
                        }`
                      : "px-2"
                  } `}
                >
                  <div
                    className={`new-note-header mb-2 d-flex flex-row `}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") {
                        if(newNote.title !== "" || newNote.content !== "") {
                          addNote();
                        }
                      }
                    }}
                  >
                    <Input
                      id='title-input'
                      className='py-2'
                      type='text'
                      placeholder={`${
                        newNoteChanged ? "Title" : "Take a note..."
                      }`}
                      variant='unstyled'
                      focusBorderColor='yellow.400'
                      onChange={(e) => {
                        if (!newNoteChanged) {
                          setNewNoteChanged(true);
                        }
                        setNewNote({ ...newNote, title: e.target.value });
                      }}
                    />
                  </div>
                  <div className='new-note-body p-0 m-0'>
                    <Textarea
                      id='content-input'
                      className={`text-area mb-4 ${
                        newNoteChanged ? "d-inline" : "d-none"
                      }`}
                      placeholder='Take a note...'
                      rows='1'
                      size='md'
                      height={50}
                      variant='unstyled'
                      onChange={(e) => {
                        setNewNote({ ...newNote, content: e.target.value });
                        if (e.target.value === "") {
                          e.target.style.height = "20px";
                        } else {
                          e.target.style.height =
                            `${e.target.scrollHeight}` + "px";
                        }
                      }}
                    />
                  </div>
                  <div
                    className={`footer d-flex flex-row mt-2 ${
                      newNoteChanged ? "d-inline" : "d-none"
                    }`}
                  >
                    <div className='btns d-flex flex-row justify-content-end w-100'>
                      <Tooltip label='Close' hasArrow='true'>
                        <Button
                          className='me-2'
                          variant='solid'
                          colorScheme='yellow'
                          onClick={() => {
                            if (user) {
                              addNote();
                            } else {
                              navigate("/login");
                            }
                          }}
                        >
                          Save
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="new-note-mobile">
								<IconButton isRound={true} size={'lg'} icon={<BiPlus size={'30px'} />} onClick={onOpen} />
							</div> */}
            </div>
            {/* <Toolbar /> */}
            <div
              className={`pinned px-3 px-md-4 ${
                pinnedNotes.length ? "d-block" : "d-none"
              }`}
            >
              <h6 className='mb-2'>Pinned</h6>
              <NotesContainer
                notes={pinnedNotes}
                searchText={searchText}
                from={"notes"}
              />
            </div>
            <div className='normal-notes px-3 px-md-4'>
              <h6 className='mb-2'>Notes</h6>
              <NotesContainer
                notes={notes}
                searchText={searchText}
                from={"notes"}
              />
            </div>
          </div>
        </div>
        <div
          className='note-modal'
          onKeyUp={(e) => {
            if (e.key === "Escape") {
              updateNote();
            }
          }}
        >
          <NoteModal
            isOpen={isOpen}
            onClose={onClose}
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
  );
};

export default Notes;
