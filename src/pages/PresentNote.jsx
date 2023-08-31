import SideNav from "../components/SideNav"
import NotesState from "../context/NotesContext"
import ThemeState from "../context/ThemeContext"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"
import NoteCard from "../components/NoteCard"

const PresentNote = () => {
  const { presentNote } = NotesState()
  const { theme } = ThemeState()
  const navigate = useNavigate()
  let page = useParams()

  useEffect(() => {
    if (!presentNote.id) {
      navigate(`/${page.page === 'notes' ? '' : page.page}`)
    }
  })

  return (
    <div className={`notes-page ${theme === 'dark' ? 'bg-dark text-white' : 'bg-white'}`}>
      <div className="main-app d-flex flex-row p-0 m-0">
        <SideNav />
        <NoteCard note={presentNote} page={page.page} />
      </div>
    </div>
  )
}

export default PresentNote