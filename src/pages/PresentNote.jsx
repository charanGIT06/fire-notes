import SideNav from "../components/SideNav";
import NotesState from "../context/NotesContext";
import ThemeState from "../context/ThemeContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import NoteCard from "../components/NoteCard";
import {
  useDisclosure,
  SlideFade,
} from "@chakra-ui/react";

const PresentNote = () => {
  const { presentNote } = NotesState();
  const { theme } = ThemeState();
  const navigate = useNavigate();
  let page = useParams();
  const { isOpen, onToggle } = useDisclosure();

  useEffect(() => {
    if (!presentNote.id) {
      navigate(`/${page.page === "notes" ? "" : page.page}`);
    }
  });

  useEffect(() => {
    if (presentNote.id) {
      onToggle();
    }
  }, []);

  return (
    <div
      className={`notes-page ${
        theme === "dark" ? "dark-theme" : "light-theme"
      }`}
    >
      <div className='main-app d-flex flex-row p-0 m-0'>
        <SideNav />
        <SlideFade
          in={isOpen}
          offsetY='100px'
          className='w-100 mx-2 mx-md-3'
          transition={{ enter: ".5s", exit: "1s" }}
        >
          <NoteCard page={page.page} />
        </SlideFade>
      </div>
    </div>
  );
};

export default PresentNote;
