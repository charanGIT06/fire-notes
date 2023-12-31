import SideNav from "../components/Navigation/SideNav";
import { useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { collection, doc, deleteDoc, setDoc } from "firebase/firestore";
import firebase from "../js/firebase.js";
import NotesContainer from "../components/Notes/NotesContainer";
import NavState from "../context/NavContext";
import ThemeState from "../context/ThemeContext";
import ArchiveModal from "../components/modals/ArchiveModal";
import UserAuth from "../context/UserContext";
import NotesState from "../context/NotesContext";

const Archive = () => {
  const db = firebase.db;
  const { user } = UserAuth();
  const { theme } = ThemeState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { searchText } = NavState();

  const { getNotes, archiveNotes } = NotesState();
  // const [archiveNotes, setArchiveNotes] = useState([])

  const [currentNote, setCurrentNote] = useState({});

  const setModalData = (note) => {
    setCurrentNote(note);
  };

  const unArchiveCurrentNote = async () => {
    try {
      const userNotes = doc(collection(db, "notes"), user.uid);
      const archivedNote = doc(
        collection(userNotes, "archive"),
        currentNote.id
      );
      await deleteDoc(archivedNote);

      const activeNote = doc(collection(userNotes, "active"), currentNote.id);
      await setDoc(activeNote, currentNote);

      console.log("note Unarchived");
      getNotes("active");
      getNotes("archive");
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCurrentNote = async () => {
    try {
      const userNotes = doc(collection(db, "notes"), user.uid);
      const archivedNote = doc(
        collection(userNotes, "archive"),
        currentNote.id
      );
      await deleteDoc(archivedNote);

      const deletedNotesCollection = collection(userNotes, "trash");
      const deletedNote = doc(deletedNotesCollection, currentNote.id);
      await setDoc(deletedNote, currentNote);

      console.log("note deleted from archive");
      getNotes("archive");
      getNotes("trash");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`archive-page  ${
        theme === "dark" ? "dark-theme text-white" : "light-theme"
      }`}
    >
      <div className='main-app container-fluid d-flex flex-row p-0 m-0'>
        <SideNav />

        <div className='main-content py-3 col-12 col-md-10 px-3 px-md-3'>
          <h5 className='mb-2'>Archived Notes</h5>
          <NotesContainer
            notes={archiveNotes}
            searchText={searchText}
            setModalData={setModalData}
            onOpen={onOpen}
            from={"archive"}
          />
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
  );
};

export default Archive;
